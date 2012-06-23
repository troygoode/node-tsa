var should = require('should')
  , tsa = require('../');

describe('Required Field', function(){
  var guard = tsa({
    bar: tsa.required()
  });

  it('custom error message', function(done){
    //arrange
    var guard = tsa({
        foo: tsa.property({ required: 'fail1!' })
      , bar: tsa.required('fail2!')
    });
    var input = {};

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err[0].key.should.equal('foo');
      err[0].error.should.equal('fail1!');
      err[1].key.should.equal('bar');
      err[1].error.should.equal('fail2!');
      should.not.exist(result);

      done();
    });
  });

  it('error array is returned if required property is not in input', function(done){
    //arrange
    var input = {
      baz: 'blah'
    };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      err[0].key.should.equal('bar');
      err[0].error.should.equal('Required property not provided.');
      should.not.exist(result);

      done();
    });
  });

  it('works with nested guards', function(done){
    //arrange
    var innerGuard = tsa({
      bar: tsa.optional()
    });
    var guard = tsa({
      foo: innerGuard({ required: true })
    });
    var input = {};

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      should.not.exist(result);

      done();
    });
  });
});

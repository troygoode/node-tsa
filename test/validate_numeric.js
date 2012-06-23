var should = require('should')
  , tsa = require('../');

describe('Validations: Numeric', function(){
  var guard = tsa({
    foo: tsa.required({ validate: tsa.validate.numeric() })
  });

  it('positive case', function(done){
    //arrange
    var input = { foo: 1 };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.foo.should.equal(1);

      done();
    });
  });

  it('negative case', function(done){
    //arrange
    var input = { foo: 'bar' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      err[0].key.should.equal('foo');
      err[0].error.should.equal('\'bar\' is not a number.');
      should.not.exist(result);

      done();
    });
  });

  it('custom error message', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.required({ validate: tsa.validate.numeric('well... crap (%1)') })
    });
    var input = { foo: 'bar' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      err[0].key.should.equal('foo');
      err[0].error.should.equal('well... crap (bar)');
      should.not.exist(result);

      done();
    });
  });
});

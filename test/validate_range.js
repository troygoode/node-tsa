var should = require('should')
  , tsa = require('../');

describe('Validations: Range', function(){
  var guard = tsa({
    foo: tsa.required({ validate: tsa.validate.range(0, 2) })
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

  it('not a number', function(done){
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

  it('below', function(done){
    //arrange
    var input = { foo: -1 };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      err[0].key.should.equal('foo');
      should.not.exist(result);

      done();
    });
  });

  it('above', function(done){
    //arrange
    var input = { foo: 3 };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      err[0].key.should.equal('foo');
      should.not.exist(result);

      done();
    });
  });

  it('no min', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.required({ validate: tsa.validate.range(undefined, 2) })
    });
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

  it('no max', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.required({ validate: tsa.validate.range(0) })
    });
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
});

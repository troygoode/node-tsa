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

  it('not a number - custom error message', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.required({ validate: tsa.validate.range(0, 2, {invalid: 'fail!'}) })
    });
    var input = { foo: 'bar' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      err[0].key.should.equal('foo');
      err[0].error.should.equal('fail!');
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

  it('below - custom error message', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.required({ validate: tsa.validate.range(0, 2, {below: 'fail below!'}) })
    });
    var input = { foo: -1 };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      err[0].key.should.equal('foo');
      err[0].error.should.equal('fail below!');
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

  it('above - custom error message', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.required({ validate: tsa.validate.range(0, 2, {above: 'fail above!'}) })
    });
    var input = { foo: 3 };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      err[0].key.should.equal('foo');
      err[0].error.should.equal('fail above!');
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

describe('Validations: Min', function(){
  var guard = tsa({
    foo: tsa.required({ validate: tsa.validate.min(0) })
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

  it('custom error message - below', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.required({ validate: tsa.validate.min(0, {below: 'fail!'}) })
    });
    var input = { foo: -1 };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err[0].error.should.equal('fail!');
      should.not.exist(result);

      done();
    });
  });
});

describe('Validations: Max', function(){
  var guard = tsa({
    foo: tsa.required({ validate: tsa.validate.max(10) })
  });

  it('positive case', function(done){
    //arrange
    var input = { foo: 9 };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.foo.should.equal(9);

      done();
    });
  });

  it('custom error message - above', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.required({ validate: tsa.validate.max(10, {above: 'fail!'}) })
    });
    var input = { foo: 11 };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err[0].error.should.equal('fail!');
      should.not.exist(result);

      done();
    });
  });
});

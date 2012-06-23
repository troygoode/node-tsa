var should = require('should')
  , tsa = require('../');

describe('Validations: Boolean', function(){
  var guard = tsa({
    foo: tsa.required({ validate: tsa.validate.boolean() })
  });

  it('positive case: true', function(done){
    //arrange
    var input = { foo: true };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.foo.should.equal(true);

      done();
    });
  });

  it('positive case: false', function(done){
    //arrange
    var input = { foo: false };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.foo.should.equal(false);

      done();
    });
  });

  it('negative case: \'true\'', function(done){
    //arrange
    var input = { foo: 'true' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      should.not.exist(result);

      done();
    });
  });
});

describe('Validations: Boolean (True)', function(){
  var guard = tsa({
    foo: tsa.required({ validate: tsa.validate.true() })
  });

  it('positive case: true', function(done){
    //arrange
    var input = { foo: true };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.foo.should.equal(true);

      done();
    });
  });

  it('negative case: false', function(done){
    //arrange
    var input = { foo: false };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      should.not.exist(result);

      done();
    });
  });

  it('negative case: \'true\'', function(done){
    //arrange
    var input = { foo: 'true' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      should.not.exist(result);

      done();
    });
  });
});

describe('Validations: Boolean (True)', function(){
  var guard = tsa({
    foo: tsa.required({ validate: tsa.validate.false() })
  });

  it('positive case: false', function(done){
    //arrange
    var input = { foo: false };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.foo.should.equal(false);

      done();
    });
  });

  it('negative case: true', function(done){
    //arrange
    var input = { foo: true };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      should.not.exist(result);

      done();
    });
  });

  it('negative case: \'false\'', function(done){
    //arrange
    var input = { foo: 'false' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      should.not.exist(result);

      done();
    });
  });
});

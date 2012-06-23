var should = require('should')
  , tsa = require('../');

describe('Custom Validations', function(){
  var mustBeUpper = function(value, cb){
    if(value === value.toUpperCase()){
      cb();
    }else{
      cb('not uppercase');
    }
  };
  var guard = tsa({
    foo: tsa.property({ validate: mustBeUpper })
  });

  it('succeeds properly', function(done){
    //arrange
    var input = {
      foo: 'BAR'
    };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.foo.should.equal('BAR');

      done();
    });
  });

  it('fails properly', function(done){
    //arrange
    var input = {
      foo: 'bar'
    };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err[0].error.should.equal('not uppercase');
      should.not.exist(result);

      done();
    });
  });

  it('works with nested guards - negative', function(done){
    //arrange
    var v = function(json, cb){
      if(json.bar === 'blah')
        cb('can\'t equal blah');
      else
        cb();
    };
    var innerGuard = tsa({
      bar: tsa.required()
    });
    var guard = tsa({
      foo: innerGuard({ validate: v })
    });
    var input = {foo: {bar: 'blah'}};

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      should.not.exist(result);

      done();
    });
  });

  it('works with nested guards - positive', function(done){
    //arrange
    var v = function(json, cb){
      if(json.bar === 'blah')
        cb('can\'t equal blah');
      else
        cb();
    };
    var innerGuard = tsa({
      bar: tsa.required()
    });
    var guard = tsa({
      foo: innerGuard({ validate: v })
    });
    var input = {foo: {bar: 'blah2'}};

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);

      done();
    });
  });

  it('can supply key name for error', function(done){
    //arrange
    var passwordsMustMatch = function(json, cb){
      if(json.password1 === json.password2)
        cb();
      else
        cb({ key: 'password2', error: 'Passwords must match.' });
    };
    var guard = tsa({
        password1: tsa.required()
      , password2: tsa.required()
    }, { validate: passwordsMustMatch });
    var input = {
        password1: 'foo'
      , password2: 'bar'
    };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.should.be.an.instanceof(Array);
      err.length.should.equal(1);
      err[0].key.should.equal('password2');
      err[0].error.should.equal('Passwords must match.');
      should.not.exist(result);

      done();
    });
  });

  it('can return multiple errors', function(done){
    //arrange
    var v = function(json, cb){
      cb(['error1', 'error2']);
    };
    var guard = tsa({
      foo: tsa.validate(v)
    });
    var input = {foo: 'blah'};

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.should.be.an.instanceof(Array);
      err.length.should.equal(1);
      err[0].key.should.equal('foo');
      err[0].error.should.be.an.instanceof(Array);
      err[0].error.length.should.equal(2);
      err[0].error[0].should.equal('error1');
      err[0].error[1].should.equal('error2');
      should.not.exist(result);

      done();
    });
  });
});

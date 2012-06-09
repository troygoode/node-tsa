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
    foo: tsa.field({ validate: mustBeUpper })
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
});

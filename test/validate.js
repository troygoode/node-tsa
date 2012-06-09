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
    guard.frisk(input, function(err, result){
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
    guard.frisk(input, function(err, result){
      //assert
      should.exist(err);
      err[0].error.should.equal('not uppercase');
      should.not.exist(result);

      done();
    });
  });
});

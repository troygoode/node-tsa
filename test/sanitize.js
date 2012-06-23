var should = require('should')
  , tsa = require('../');

describe('Sanitization', function(){
  var mustBeUpper = function(value, cb){
    if(value === value.toUpperCase()){
      cb();
    }else{
      cb('not uppercase');
    }
  };
  var guard = tsa({
    foo: tsa.property({ sanitize: mustBeUpper })
  });

  it('positive', function(done){
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

  it('positive - shortcut', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.sanitize(mustBeUpper)
    });
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

  it('negative', function(done){
    //arrange
    var input = {
      foo: 'Bar'
    };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.not.exist(result.foo);

      done();
    });
  });
});

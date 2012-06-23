var should = require('should')
  , tsa = require('../');

var isEmptyHash = function(hash){
  for(var key in hash){
    if(hash.hasOwnProperty(key)){
      return false;
    }
  }
  return true;
};

describe('Optional Field', function(){
  var guard = tsa({
    bar: tsa.optional()
  });

  it('property is used if supplied', function(done){
    //arrange
    var input = {
      bar: 'blah'
    };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.bar.should.equal('blah');

      done();
    });
  });

  it('property is ignored if not supplied', function(done){
    //arrange
    var input = {};

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      isEmptyHash(result).should.be.true;

      done();
    });
  });

  it('works with nested guards', function(done){
    //arrange
    var innerGuard = tsa({
      bar: tsa.optional()
    });
    var guard = tsa({
      foo: innerGuard()
    });
    var input = {};

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.exist(result.foo);
      isEmptyHash(result.foo).should.be.true;

      done();
    });
  });
});

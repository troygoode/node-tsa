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

  it('field is used if supplied', function(done){
    //arrange
    var input = {
      bar: 'blah'
    };

    //act
    guard.frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.bar.should.equal('blah');

      done();
    });
  });

  it('field is ignored if not supplied', function(done){
    //arrange
    var input = {};

    //act
    guard.frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      isEmptyHash(result).should.be.true;

      done();
    });
  });
});

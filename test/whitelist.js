var should = require('should')
  , tsa = require('../');

describe('Optional Field', function(){
  var guard = tsa({
    bar: tsa.optional()
  });

  it('field is in whitelist', function(done){
    //arrange
    var input = {
      bar: 'blah'
    };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.exist(result.bar);
      result.bar.should.equal('blah');

      done();
    });
  });

  it('field is not in whitelist', function(done){
    //arrange
    var input = {
      baz: 'blah'
    };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.not.exist(result.bar);
      should.not.exist(result.baz);

      done();
    });
  });
});

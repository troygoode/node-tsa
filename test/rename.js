var should = require('should')
  , tsa = require('../');

describe('Rename Field', function(){
  var guard = tsa({
    foo: tsa.field({ rename: 'bar' })
  });

  it('renames incoming field', function(done){
    //arrange
    var input = {
      foo: 'blah'
    };

    //act
    guard.frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.not.exist(result.foo);
      should.exist(result.bar);
      result.bar.should.equal('blah');

      done();
    });
  });
});

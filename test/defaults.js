var should = require('should')
  , tsa = require('../');

describe('Default Values', function(){
  var guard = tsa({
    foo: tsa.field({ default: 'bar' })
  });

  it('returns the default value for fields when the field isn\'t supplied', function(done){
    //arrange
    var input = {};

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.exist(result.foo);
      result.foo.should.equal('bar');

      done();
    });
  });

  it('returns the supplied value for fields instead of default when the field IS supplied', function(done){
    //arrange
    var input = {
      foo: 'baz'
    };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.exist(result.foo);
      result.foo.should.equal('baz');

      done();
    });
  });

  it('supports executing a function to retrieve default value', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.field({ default: function(){ return 'bar'; } })
    });
    var input = {};

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.exist(result.foo);
      result.foo.should.equal('bar');

      done();
    });
  });
});

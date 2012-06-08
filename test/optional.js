var should = require('should')
  , kiln = require('../');

describe('Optional Field', function(){
  var recipe = kiln({
    bar: kiln.optional()
  });

  it('field is in whitelist', function(done){
    //arrange
    var input = {
      bar: 'blah'
    };

    //act
    recipe.fire(input, function(err, result){
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
    recipe.fire(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.not.exist(result.bar);
      should.not.exist(result.baz);

      done();
    });
  });
});

var should = require('should')
  , kiln = require('../');

describe('Required Field', function(){
  var recipe = kiln({
    bar: kiln.required()
  });

  it('required field is not in input', function(done){
    //arrange
    var input = {
      baz: 'blah'
    };

    //act
    recipe.fire(input, function(err, result){
      //assert
      should.exist(err);
      should.not.exist(result);

      done();
    });
  });
});

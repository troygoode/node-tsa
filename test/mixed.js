var should = require('should')
  , kiln = require('../');

describe('Mix of Required & Optional Fields', function(){
  var recipe = kiln({
      bar1: kiln.required()
    , bar2: kiln.optional()
  });

  it('works when all fields are present', function(done){
    //arrange
    var input = {
        bar1: 'bar1'
      , bar2: 'bar2'
    };

    //act
    recipe.fire(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.bar1.should.equal('bar1');
      result.bar2.should.equal('bar2');

      done();
    });
  });

  it('works when only required field is present', function(done){
    //arrange
    var input = {
      bar1: 'bar1'
    };

    //act
    recipe.fire(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.bar1.should.equal('bar1');
      should.not.exist(result.bar2);

      done();
    });
  });

  it('reports error when only optional field is present', function(done){
    //arrange
    var input = {
      bar2: 'bar2'
    };

    //act
    recipe.fire(input, function(err, result){
      //assert
      should.exist(err);
      should.not.exist(result);

      done();
    });
  });

  it('excludes non-whitelisted field', function(done){
    //arrange
    var input = {
        bar1: 'bar1'
      , bar2: 'bar2'
      , bar3: 'bar3'
    };

    //act
    recipe.fire(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.exist(result.bar1);
      should.exist(result.bar2);
      should.not.exist(result.bar3);

      done();
    });
  });
});

var should = require('should')
  , tsa = require('../');

describe('Mix of Required & Optional Fields', function(){
  var guard = tsa({
      bar1: tsa.required()
    , bar2: tsa.optional()
  });

  it('works when all fields are present', function(done){
    //arrange
    var input = {
        bar1: 'bar1'
      , bar2: 'bar2'
    };

    //act
    guard().frisk(input, function(err, result){
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
    guard().frisk(input, function(err, result){
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
    guard().frisk(input, function(err, result){
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
    guard().frisk(input, function(err, result){
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

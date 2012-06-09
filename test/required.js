var should = require('should')
  , tsa = require('../');

describe('Required Field', function(){
  var guard = tsa({
    bar: tsa.required()
  });

  it('error array is returned if required field is not in input', function(done){
    //arrange
    var input = {
      baz: 'blah'
    };

    //act
    guard.frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      err[0].key.should.equal('bar');
      err[0].error.should.equal('Required field not provided.');
      should.not.exist(result);

      done();
    });
  });
});

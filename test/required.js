var should = require('should')
  , tsa = require('../');

describe('Required Field', function(){
  var guard = tsa({
    bar: tsa.required()
  });

  it('required field is not in input', function(done){
    //arrange
    var input = {
      baz: 'blah'
    };

    //act
    guard.frisk(input, function(err, result){
      //assert
      should.exist(err);
      should.not.exist(result);

      done();
    });
  });
});

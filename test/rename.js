var should = require('should')
  , tsa = require('../');

describe('Rename Field', function(){
  var guard = tsa({
    foo: tsa.property({ rename: 'bar' })
  });

  it('renames incoming property', function(done){
    //arrange
    var input = {
      foo: 'blah'
    };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.not.exist(result.foo);
      should.exist(result.bar);
      result.bar.should.equal('blah');

      done();
    });
  });

  it('works with nested guards', function(done){
    //arrange
    var innerGuard = tsa({
      bar: tsa.optional()
    });
    var guard = tsa({
      foo: innerGuard({ rename: 'baz' })
    });
    var input = {};

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.not.exist(result.foo);
      should.exist(result.baz);

      done();
    });
  });
});

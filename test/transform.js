var should = require('should')
  , tsa = require('../');

describe('Transformations', function(){
  it('transforms lowercase to uppercase', function(done){
    //arrange
    var toUpper = function(value, cb){
      cb(null, value.toUpperCase());
    };
    var guard = tsa({
      foo: tsa.property({ transform: toUpper })
    });
    var input = { foo: 'bar' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.exist(result.foo);
      result.foo.should.equal('BAR');

      done();
    });
  });

  it('passes errors up the chain', function(done){
    //arrange
    var error = function(value, cb){
      cb('some error');
    };
    var guard = tsa({
      foo: tsa.property({ transform: error })
    });
    var input = { foo: 'bar' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err[0].error.should.equal('some error');
      should.not.exist(result);

      done();
    });
  });

  it('works with nested guards', function(done){
    //arrange
    var t = function(json, cb){
      json.color = 'red';
      cb(null, json);
    };
    var innerGuard = tsa({
      bar: tsa.optional()
    });
    var guard = tsa({
      foo: innerGuard({ transform: t })
    });
    var input = {};

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      should.exist(result.foo);
      should.exist(result.foo.color);
      result.foo.color.should.equal('red');

      done();
    });
  });
});

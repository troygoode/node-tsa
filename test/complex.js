var should = require('should')
  , tsa = require('../');

describe('Complex Object', function(){
  var innerGuard = tsa({
    baz: tsa.required()
  });
  var guard = tsa({
      foo: tsa.required()
    , bar: innerGuard
  });

  it('works when all values supplied', function(done){
    //arrange
    var input = {
      foo: 'foo'
      , bar: {baz: 'baz'}
    };

    //act
    guard.frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.foo.should.equal('foo');
      should.exist(result.bar);
      should.exist(result.bar.baz);
      result.bar.baz.should.equal('baz');

      done()
    });
  });

  it('returns error if nested required field isn\'t supplied', function(done){
    //arrange
    var input = {
      foo: 'foo'
      , bar: {baz: undefined}
    };

    //act
    guard.frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.should.be.a('string');
      should.not.exist(result);

      done()
    });
  });

  it('returns array of errors if multiple required field aren\'t supplied', function(done){
    //arrange
    var input = {
      foo: undefined
      , bar: {baz: undefined}
    };

    //act
    guard.frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.should.be.an.instanceof(Array);
      err.length.should.equal(2);
      should.not.exist(result);

      done()
    });
  });
});

describe('More Complex Object', function(){
  var moreInnerGuard = tsa({
    fizz: tsa.required()
  });
  var innerGuard = tsa({
      baz: tsa.required()
    , blah: moreInnerGuard
  });
  var guard = tsa({
      foo: tsa.required()
    , bar: innerGuard
  });

  it('works when all values supplied', function(done){
    //arrange
    var input = {
      foo: 'foo'
      , bar: {
        baz: 'baz'
        , blah: {
          fizz: 'bang'
        }
      }
    };

    //act
    guard.frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.foo.should.equal('foo');
      should.exist(result.bar);
      should.exist(result.bar.baz);
      result.bar.baz.should.equal('baz');
      should.exist(result.bar.blah);
      should.exist(result.bar.blah.fizz);
      result.bar.blah.fizz.should.equal('bang');

      done()
    });
  });
});

var should = require('should')
  , tsa = require('../')
  , person = require('./guards/person');

describe('Nested Guards', function(){
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

  it('returns error array if nested required field isn\'t supplied', function(done){
    //arrange
    var input = {
      foo: 'foo'
      , bar: {baz: undefined}
    };

    //act
    guard.frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      err[0].should.be.a('string');
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

describe('Nested Guards - Further Nesting', function(){
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

describe('Nested Guards - Person', function(){

  it('works when all values are passed', function(done){
    //arrange
    var input = {
        first: 'Troy'
      , middle: 'Michael'
      , last: 'Goode'
      , address: {
          street1: '123 My Street'
        , street2: 'Unit B'
        , zip: '22204'
      }
    };

    //act
    person.frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.first.should.equal('Troy');
      result.middle.should.equal('Michael');
      result.last.should.equal('Goode');
      result.address.street1.should.equal('123 My Street');
      result.address.street2.should.equal('Unit B');
      result.address.zip.should.equal('22204');

      done();
    });
  });

  it('works when only required values are passed', function(done){
    //arrange
    var input = {
        first: 'Troy'
      , last: 'Goode'
      , address: {
          street1: '123 My Street'
        , zip: '22204'
      }
    };

    //act
    person.frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.first.should.equal('Troy');
      should.not.exist(result.middle);
      result.last.should.equal('Goode');
      result.address.street1.should.equal('123 My Street');
      should.not.exist(result.address.street2);
      result.address.zip.should.equal('22204');

      done();
    });
  });

  it('returns array of 1 error when required value isn\'t passed', function(done){
    //arrange
    var input = {
        first: 'Troy'
      , last: 'Goode'
      , address: {
        street1: '123 My Street'
      }
    };

    //act
    person.frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.length.should.equal(1);
      err[0].should.be.a('string');
      should.not.exist(result);

      done();
    });
  });

  it('returns array of errors when multple required values aren\'t passed', function(done){
    //arrange
    var input = {
      first: 'Troy'
      , address: {
        street1: '123 My Street'
      }
    };

    //act
    person.frisk(input, function(err, result){
      //assert
      should.exist(err);
      err.should.be.an.instanceof(Array);
      err.length.should.equal(2);
      should.not.exist(result);

      done();
    });
  });

});

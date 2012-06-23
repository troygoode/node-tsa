var should = require('should')
  , tsa = require('../');

describe('Validations: Regex', function(){
  var guard = tsa({
    foo: tsa.required({ validate: tsa.validate.regex(/^bar$/) })
  });

  it('positive case', function(done){
    //arrange
    var input = { foo: 'bar' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.foo.should.equal('bar');

      done();
    });
  });

  it('negative case', function(done){
    //arrange
    var input = { foo: 'baz' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err[0].key.should.equal('foo');
      err[0].error.should.equal('Pattern did not match: /^bar$/.');
      should.not.exist(result);

      done();
    });
  });

  it('custom error message', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.required({ validate: tsa.validate.regex(/^bar$/, 'well... crap (%1)') })
    });
    var input = { foo: 'baz' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err[0].key.should.equal('foo');
      err[0].error.should.equal('well... crap (baz)');
      should.not.exist(result);

      done();
    });
  });

  it('positive case - string instead of regex', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.required({ validate: tsa.validate.regex("^bar$") })
    });
    var input = { foo: 'bar' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.not.exist(err);
      should.exist(result);
      result.foo.should.equal('bar');

      done();
    });
  });

  it('negative case - string instead of regex', function(done){
    //arrange
    var guard = tsa({
      foo: tsa.required({ validate: tsa.validate.regex("^bar$") })
    });
    var input = { foo: 'baz' };

    //act
    guard().frisk(input, function(err, result){
      //assert
      should.exist(err);
      err[0].key.should.equal('foo');
      err[0].error.should.equal('Pattern did not match: /^bar$/.');
      should.not.exist(result);

      done();
    });
  });
});

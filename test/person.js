var should = require('should')
  , person = require('./recipes/person');

describe('The Person Recipe', function(){

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
    person.fire(input, function(err, result){
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
    person.fire(input, function(err, result){
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

  it('returns error when required value isn\'t passed', function(done){
    //arrange
    var input = {
        first: 'Troy'
      , last: 'Goode'
      , address: {
        street1: '123 My Street'
      }
    };

    //act
    person.fire(input, function(err, result){
      //assert
      should.exist(err);
      err.should.be.a('string');
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
    person.fire(input, function(err, result){
      //assert
      should.exist(err);
      err.should.be.an.instanceof(Array);
      err.length.should.equal(2);
      should.not.exist(result);

      done();
    });
  });

});

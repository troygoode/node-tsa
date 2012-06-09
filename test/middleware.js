var should = require('should')
  , tsa = require('../');

describe('Middleware', function(){
  var guard = tsa({
    foo: tsa.required()
  });

  it('validates whitelist', function(done){
    //arrange
    var input = {
        foo: 'blah'
      , bar: 'baz'
    };
    var req = {
      body: input
    };

    //act
    guard().middleware()(req, null, function(err){
      //assert
      should.not.exist(err);
      should.exist(req.body);
      should.exist(req.body.foo);
      req.body.foo.should.equal('blah');
      should.not.exist(req.body.bar);

      done();
    });
  });

  it('passes errors to next()', function(done){
    //arrange
    var input = {
      bar: 'baz'
    };
    var req = {
      body: input
    };

    //act
    guard().middleware()(req, null, function(err){
      //assert
      should.exist(err);
      err.should.be.an.instanceof(Array);
      err.length.should.equal(1);

      done();
    });
  });

  it('passes errors to error handler when specified', function(done){
    //arrange
    var input = {
      bar: 'baz'
    };
    var req = {
      body: input
    };
    var handler = function(err){
      //assert
      should.exist(err);
      err.should.be.an.instanceof(Array);
      err.length.should.equal(1);

      done();
    };

    //act
    guard().middleware(handler)(req, null, function(err){
      throw 'shouldn\'t reach this';
    });
  });
});

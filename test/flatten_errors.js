var should = require('should')
  , tsa = require('../');

describe('Flatten Errors', function(){

  it('should work on already flat structure', function(){
    //arrange
    var errors = [
      { key: 'foo', error: 'blah' }
    ];

    //act
    var flat = tsa.flattenErrors(errors);
    flat.length.should.equal(1);
    flat[0].key.should.equal('foo');
    flat[0].error.should.equal('blah');
  });

  it('should work on a single level of nesting', function(){
    //arrange
    var errors = [
      { key: 'foo', error: [
          { key: 'bar', error: 'blah' }
        , { key: 'bar2', error: 'blah2' }
      ] }
    ];

    //act
    var flat = tsa.flattenErrors(errors);
    flat.length.should.equal(2);
    flat[0].key.should.equal('foo[bar]');
    flat[0].error.should.equal('blah');
    flat[1].key.should.equal('foo[bar2]');
    flat[1].error.should.equal('blah2');
  });

  it('should work on multiple levels of nesting', function(){
    //arrange
    var errors = [
      { key: 'foo', error: [
          { key: 'bar', error: [
            { key: 'baz', error: 'blahbaz' }
          ] }
        , { key: 'bar2', error: 'blah2' }
      ] }
    ];

    //act
    var flat = tsa.flattenErrors(errors);
    flat.length.should.equal(2);
    flat[0].key.should.equal('foo[bar[baz]]');
    flat[0].error.should.equal('blahbaz');
    flat[1].key.should.equal('foo[bar2]');
    flat[1].error.should.equal('blah2');
  });

  it('can flatten to hash', function(){
    //arrange
    var errors = [
      { key: 'foo', error: [
          { key: 'bar', error: [
              { key: 'baz', error: 'blahbaz' }
            , { key: 'baz', error: 'blahba2' }
          ] }
        , { key: 'bar2', error: 'blah2' }
      ] }
    ];

    //act
    var flat = tsa.flattenErrors(errors, {hash: true});
    console.log(flat);
    flat['foo[bar[baz]]'].join(' ').should.equal('blahbaz blahba2');
    flat['foo[bar2]'].join(' ').should.equal('blah2');
  });
});

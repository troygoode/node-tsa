module.exports = function(errors, opts){
  var toHash = opts && opts.hash;
  var recurse = function(outerError){
    if(!outerError.error instanceof Array || typeof outerError.error === 'string') return [outerError];

    if(outerError.error){
      var result = [];
      outerError.error.forEach(function(innerError){
        var recursed = recurse(innerError);
        if(recursed instanceof Array){
          recursed.forEach(function(e){
            var k = outerError.key
              ? outerError.key + '[' + e.key + ']'
              : e.key;
            result.push({ key: k, error: e.error });
          });
        }else{
          result.push({ key: outerError.key, error: recursed });
        }
      });
      return result;
    }else{
      return outerError;
    }
  };

  var flattened = recurse({ key: null, error: errors });
  if(toHash){
    var hash = {};
    flattened.forEach(function(e){
      if(hash[e.key])
        hash[e.key].push(e.error);
      else
        hash[e.key] = [e.error];
    });
    return hash;
  }else{
    return flattened;
  }
};

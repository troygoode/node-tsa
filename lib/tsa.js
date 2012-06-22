var guard = require('./guard');

module.exports = guard;

var field = module.exports.field = function(opts){
  return guard(null)(opts);
};

module.exports.required = function(opts){
  opts = opts || {};
  opts.required = true;
  return field(opts);
};

module.exports.optional = function(opts){
  return field(opts);
};

module.exports.default = function(d, opts){
  opts = opts || {};
  opts.default = d;
  return field(opts);
};

module.exports.validate = function(f, opts){
  opts = opts || {};
  opts.validate = f;
  return field(opts);
};

module.exports.validate.regex = function(pattern, errorMessage){
  var pattern = typeof pattern === 'string'
    ? new RegExp(pattern)
    : pattern;
  var errorMessage = errorMessage
    ? errorMessage
    : 'Pattern did not match: ' + pattern + '.';
  return function(value, cb){
    if(pattern.test(value)) return cb();
    cb(errorMessage);
  };
};

module.exports.transform = function(f, opts){
  opts = opts || {};
  opts.transform = f;
  return field(opts);
};

module.exports.rename = function(n, opts){
  opts = opts || {};
  opts.rename = n;
  return field(opts);
};

module.exports.flattenErrors = function(errors, opts){
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

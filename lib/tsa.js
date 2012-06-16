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

    var result = [];
    outerError.error.forEach(function(innerError){
      var recursed = recurse(innerError);
      recursed.forEach(function(e){
        var k = outerError.key
          ? outerError.key + '[' + e.key + ']'
          : e.key;
        result.push({ key: k, error: e.error});
      });
    });
    return result;
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

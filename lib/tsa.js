var property = require('./property');

module.exports = require('./guard');
module.exports.property = property;
module.exports.validate = require('./validate');
module.exports.flattenErrors = require('./flattenErrors');

module.exports.required = function(message, opts){
  if(message && typeof message !== 'string'){
    opts = message;
    message = null;
  };
  opts = opts || {};
  opts.required = message || true;
  return property(opts);
};

module.exports.optional = function(opts){
  return property(opts);
};

module.exports.default = function(d, opts){
  opts = opts || {};
  opts.default = d;
  return property(opts);
};

module.exports.transform = function(f, opts){
  opts = opts || {};
  opts.transform = f;
  return property(opts);
};

module.exports.sanitize = function(f, opts){
  opts = opts || {};
  opts.sanitize = f;
  return property(opts);
};

module.exports.rename = function(n, opts){
  opts = opts || {};
  opts.rename = n;
  return property(opts);
};

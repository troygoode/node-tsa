var guard = require('./guard');

module.exports = guard;

var field = module.exports.field = function(opts){
  return guard(null, opts);
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

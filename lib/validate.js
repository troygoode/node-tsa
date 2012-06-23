var property = require('./property');

//from : http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
var isNumber = function(n){
  return !isNaN(parseFloat(n)) && isFinite(n);
};

module.exports = function(f, opts){
  opts = opts || {};
  opts.validate = f;
  return property(opts);
};

module.exports.boolean = function(errorMessage){
  var errorMessage = errorMessage
    ? errorMessage
    : '\'%1\' is not a true/false value.'
  return function(value, cb){
    if(value !== true && value !== false) return cb(errorMessage.replace(/\%1/g, value));
    cb();
  };
};

module.exports.true = function(errorMessage){
  var errorMessage = errorMessage
    ? errorMessage
    : '\'%1\' must be true.'
  return function(value, cb){
    if(value !== true) return cb(errorMessage.replace(/\%1/g, value));
    cb();
  };
};

module.exports.false = function(errorMessage){
  var errorMessage = errorMessage
    ? errorMessage
    : '\'%1\' must be false.'
  return function(value, cb){
    if(value !== false) return cb(errorMessage.replace(/\%1/g, value));
    cb();
  };
};

module.exports.numeric = function(errorMessage){
  var errorMessage = errorMessage
    ? errorMessage
    : '\'%1\' is not a number.'
  return function(value, cb){
    if(!isNumber(value)) return cb(errorMessage.replace(/\%1/g, value));
    cb();
  };
};

module.exports.range = function(min, max){
  var notANumber = '\'%1\' is not a number.';
  var tooLow = 'Too low - must be at least ' + min + '.';
  var tooHigh = 'Too high - must be no greater than ' + max + '.';
  return function(value, cb){
    if(!isNumber(value)) return cb(notANumber.replace(/\%1/g, value));
    else if(value < min) return cb(tooLow.replace(/\%1/g, value));
    else if(value > max) return cb(tooHigh.replace(/\%1/g, value));
    cb();
  };
};

module.exports.min = function(min){
  var notANumber = '\'%1\' is not a number.';
  var tooLow = 'Too low - must be at least ' + min + '.';
  return function(value, cb){
    if(!isNumber(value)) return cb(notANumber.replace(/\%1/g, value));
    else if(value < min) return cb(tooLow.replace(/\%1/g, value));
    cb();
  };
};

module.exports.max = function(max){
  var notANumber = '\'%1\' is not a number.';
  var tooHigh = 'Too high - must be no greater than ' + max + '.';
  return function(value, cb){
    if(!isNumber(value)) return cb(notANumber.replace(/\%1/g, value));
    else if(value > max) return cb(tooHigh.replace(/\%1/g, value));
    cb();
  };
};

module.exports.regex = function(pattern, errorMessage){
  var pattern = typeof pattern === 'string'
    ? new RegExp(pattern)
    : pattern;
  var errorMessage = errorMessage
    ? errorMessage
    : 'Pattern did not match: ' + pattern + '.';
  return function(value, cb){
    if(pattern.test(value)) return cb();
    cb(errorMessage.replace(/\%1/g, value));
  };
};

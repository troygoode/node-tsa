var guard = require('./guard');

//from : http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
var isNumber = function(n){
  return !isNaN(parseFloat(n)) && isFinite(n);
};

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

module.exports.validate.boolean = function(errorMessage){
  var errorMessage = errorMessage
    ? errorMessage
    : '\'%1\' is not a true/false value.'
  return function(value, cb){
    if(value !== true && value !== false) return cb(errorMessage.replace(/\%1/g, value));
    cb();
  };
};

module.exports.validate.true = function(errorMessage){
  var errorMessage = errorMessage
    ? errorMessage
    : '\'%1\' must be true.'
  return function(value, cb){
    if(value !== true) return cb(errorMessage.replace(/\%1/g, value));
    cb();
  };
};

module.exports.validate.false = function(errorMessage){
  var errorMessage = errorMessage
    ? errorMessage
    : '\'%1\' must be false.'
  return function(value, cb){
    if(value !== false) return cb(errorMessage.replace(/\%1/g, value));
    cb();
  };
};

module.exports.validate.numeric = function(errorMessage){
  var errorMessage = errorMessage
    ? errorMessage
    : '\'%1\' is not a number.'
  return function(value, cb){
    if(!isNumber(value)) return cb(errorMessage.replace(/\%1/g, value));
    cb();
  };
};

module.exports.validate.range = function(min, max){
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

module.exports.validate.min = function(min){
  var notANumber = '\'%1\' is not a number.';
  var tooLow = 'Too low - must be at least ' + min + '.';
  return function(value, cb){
    if(!isNumber(value)) return cb(notANumber.replace(/\%1/g, value));
    else if(value < min) return cb(tooLow.replace(/\%1/g, value));
    cb();
  };
};

module.exports.validate.max = function(max){
  var notANumber = '\'%1\' is not a number.';
  var tooHigh = 'Too high - must be no greater than ' + max + '.';
  return function(value, cb){
    if(!isNumber(value)) return cb(notANumber.replace(/\%1/g, value));
    else if(value > max) return cb(tooHigh.replace(/\%1/g, value));
    cb();
  };
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
    cb(errorMessage.replace(/\%1/g, value));
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

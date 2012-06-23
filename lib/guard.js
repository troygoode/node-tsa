var _ = require('underscore');

// function to convert a single error into an array of errors and pass to cb
var errorToErrors = function(err){
  if(err instanceof Array) return err;
  else if(err) return [err];
  return err;
};

var formatError = function(err, key){
  if(err && err.key && err.error) return err;
  return { key: key, error: err };
};

module.exports = function(guard, opts1){
  return function(opts2){
    var opts = _.defaults(opts2 || {}, opts1 || {});

    var frisk = function(input, key, cb){
      var result = {}
        , errors = []
        , keys = []
        , counter = 0;

      // the key argument is optional
      if(typeof key === 'function') cb = key;

      // handle each key in the input
      if(guard){ // this is a complex object

        // setup validation for this object
        var validate = opts.validate || function(input, _cb){
          _cb();
        };
        validate(input, function(err){
          if(err){
            errors.push(formatError(err, key));
            return cb(errors);
          }

          // find every key in the guard
          for(var key in guard){
            if(guard.hasOwnProperty(key)) keys.push(key);
          }

          // setup function to call once all keys have been recursed
          var complete = function(){
            if(errors.length) return cb(errors);
            var transform = opts.transform || function(_result, _cb){
              _cb(null, _result);
            };
            transform(result, function(err, _result){
              if(err){
                errors.push(formatError(err, key));
                cb(errors);
              }else{
                cb(null, _result);
              }
            });
          };

          // protected against empty guards
          if(!keys.length) return complete();

          // recurse to each key in the guard
          keys.forEach(function(_key){
            if(!input){
              if(opts.required) errors.push({ key: _key, error: 'Required property not provided.' });
              if(++counter === keys.length) return complete();
            }

            guard[_key].frisk(input[_key], _key, function(err, _result){
              if(err){
                errors.push(formatError(err, _key));
              }else if(_result !== undefined){
                result[guard[_key].options.rename || _key] = _result;
              }

              // if we've hit every key, wrap up
              if(++counter === keys.length) complete();
            });
          });
        });
      }else{
        // this is a simple field, not a complex object / guard
        if(opts.required && !input && input !== false && !opts.default){
          // validate required field criteria
          cb('Required property not provided.');
        }else if(opts.default && !input){
          // supply default value if nothing else passed in
          var d = opts.default;
          if(typeof d === 'function') d = d();
          cb(null, d);
        }else if(input || input === false){
          var validate = opts.validate || function(_input, _cb){
            _cb(); // pass-through validation
          };
          var transform = opts.transform || function(_input, _cb){
            _cb(null, _input); // pass-through transform
          };

          // validate value if validate function was specified
          validate(input, function(err){
            if(err) return cb(err);

            // transform value if transform function was specifed
            transform(input, function(err, newValue){
              if(err) return cb(err);
              cb(null, newValue);
            });
          });
        }else{
          cb(null, undefined);
        }
      }
    };

    var middleware = function(errorHandler){
      return function(req, res, next){
        frisk(req.body, function(err, result){
          if(err && errorHandler) return errorHandler(errorToErrors(err), req, res, next);
          else if(err) return next(errorToErrors(err));
          req.body = result;
          next();
        });
      };
    };

    return {
        frisk: frisk
      , options: opts
      , middleware: middleware
    };
  };
};

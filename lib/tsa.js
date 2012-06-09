var tsa = function(guard, opts){
  opts = opts || {};
  var frisk = function(input, key, cb){
    var result = {}
      , errors = []
      , keys = [];

    // the key argument is optional
    if(typeof key === 'function'){
      cb = key;
    }

    //handle each key in the input
    if(guard){
      // find every key in the guard
      for(var key in guard){
        if(guard.hasOwnProperty(key)){
          keys.push(key);
        }
      }

      // setup function to call once all keys have been recursed
      var complete = function(){
        if(errors.length){
          cb(errors);
        }else{
          cb(null, result);
        }
      };

      // protected against empty guards
      if(!keys.length){
        complete();
      }

      // recurse to each key in the guard
      var counter = 0;
      keys.forEach(function(_key){
        guard[_key].frisk(input[_key], _key, function(err, _result){
          if(err){
            err.forEach(function(e){
              errors.push(e);
            });
          }else if(_result !== undefined){
            result[_key] = _result;
          }

          if(++counter === keys.length){
            complete();
          }
        });
      });
    }else{
      // this is a simple field, not a complex object / guard
      if(opts.required && !input && !opts.default){
        cb(['required field ' + key + ' not provided']);
      }else if(opts.default && !input){
        var d = opts.default;
        if(typeof d === 'function'){
          d = d();
        }
        cb(null, d);
      }else{
        cb(null, input);
      }
    }
  };

  var middleware = function(){
    return function(req, res, next){
      frisk(req.body, function(err, result){
        if(err && err instanceof Array){
          next(err);
        }else if(err){
          next([err]);
        }else{
          req.tsa = result;
          next();
        }
      });
    };
  };

  return {
      frisk: frisk
    , middleware: middleware
  };
};

tsa.field = function(opts){
  return tsa(null, opts);
};

tsa.required = function(opts){
  opts = opts || {};
  opts.required = true;
  return tsa.field(opts);
};

tsa.optional = function(opts){
  return tsa.field(opts);
};

module.exports = tsa;

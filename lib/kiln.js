var kiln = function(hash, opts){
  opts = opts || {};
  var fire = function(input, key, cb){
    var result = {}
      , errors = []
      , keys = [];

    // the key argument is optional
    if(typeof key === 'function'){
      cb = key;
    }

    //handle each key in the input
    if(hash && hash !== {}){
      // find every key in the hash
      for(var key in hash){
        keys.push(key);
      }

      // setup function to call once all keys have been recursed
      var complete = function(){
        if(errors.length === 1){
          cb(errors[0]);
        }else if(errors.length > 1){
          cb(errors);
        }else{
          cb(null, result);
        }
      };

      // recurse to each key in the hash
      var counter = 0;
      keys.forEach(function(_key){
        hash[_key].fire(input[_key], _key, function(err, _result){
          if(err && err instanceof Array && typeof err !== 'string'){
            err.forEach(function(e){
              errors.push(e);
            });
          }else if(err){
            errors.push(err);
          }else{
            result[_key] = _result;
          }

          if(++counter === keys.length){
            complete();
          }
        });
      });
    }else{
      // this is a simple field, not a complex object / hash
      if(opts.required && !input){
        cb('required field ' + key + ' not provided');
      }else{
        cb(null, input);
      }
    }
  };

  var middleware = function(){
    return function(req, res, next){
      fire(req.body, function(err, result){
        if(err && err instanceof Array){
          next(err);
        }else if(err){
          next([err]);
        }else{
          req.kiln = result;
          next();
        }
      });
    };
  };

  return {
      fire: fire
    , middleware: middleware
  };
};

kiln.required = function(){
  return kiln(null, { required: true });
};

kiln.optional = function(){
  return kiln();
};

module.exports = kiln;

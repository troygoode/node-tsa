var kiln = function(recipe){
  var fire = function(input, cb){
    var result = {}
      , errors = []
      , complexKeys = [];

    //verify required fields are present
    for(var key in recipe){
      if(recipe[key] && recipe[key].required && !input[key]){
        errors.push('required field ' + key + ' not found');
      }
    }

    //handle each key in the input
    for(var key in input){
      var recipeValue = recipe[key];
      if(recipeValue === undefined){
        //not in whitelist
      }else if(recipeValue.fire){
        //hash
        complexKeys.push(key);
      }else{
        //value type
        result[key] = input[key];
      }
    }

    var complete = function(){
      if(errors.length === 1){
        cb(errors[0]);
      }else if(errors.length > 1){
        cb(errors);
      }else{
        cb(null, result);
      }
    }

    if(complexKeys.length === 0){
      // this is a simple object, so finish early
      complete();
    }else{
      var counter = 0;

      // recurse into complex objects
      complexKeys.forEach(function(key){
        recipe[key].fire(input[key], function(err, fireResult){
          if(err && err instanceof Array){
            // multiple errors were returned
            err.forEach(function(e){
              errors.push(e);
            });
          }else if(err){
            // a single error was returned
            errors.push(err);
          }else{
            // no errors; update value
            result[key] = fireResult;
          }

          // if this is the last complex object, finish this whole thing
          if(++counter === complexKeys.length){
            complete();
          }
        });
      });
    }
  }

  return {
      fire: fire
    , middleware: function(req, res, next){
      fire(req.body, function(err, result){
        if(err){
          next(err);
        }else{
          req.kiln = result;
          next();
        }
      });
    }
  };
};

kiln.required = function(){
  return { required: true };
};

kiln.optional = function(){
  return { required: false };
};

module.exports = kiln;

var tsa = require('../../')
  , address = require('./address');

var justFirstCharacter = function(input, cb){
  if(input && input.length){
    cb(null, input[0]);
  }else{
    cb(null, input);
  }
};

var isEmail = function(input, cb){
  if(input){
    var regex = /^[\w\.]+@[\w\.]+\.\w+$/; // <-- not a good regex, fyi
    if(regex.test(input)){
      cb();
    }else{
      cb('invalid email address');
    }
  }else{
    // no value was passed; defer to the 'required' validation
    cb();
  }
};

module.exports = tsa({
    first: tsa.required()
  , middle: tsa.transform(justFirstCharacter)
  , last: tsa.required()
  , email: tsa.validate(isEmail)
  , address: address
});

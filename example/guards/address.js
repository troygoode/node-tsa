var tsa = require('../../');

var dontIncludeIfEmptyString = function(input, cb){
  if(input === ''){
    cb(null, undefined);
  }else{
    cb(null, input);
  }
};

module.exports = tsa({
    street1: tsa.required()
  , street2: tsa.optional({ transform: dontIncludeIfEmptyString })
  , zip: tsa.required()
});

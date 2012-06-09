var tsa = require('../../')
  , address = require('./address');

module.exports = tsa({
    first: tsa.required()
  , middle: tsa.optional()
  , last: tsa.required()
  , address: address
});

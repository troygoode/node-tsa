var tsa = require('../../');

module.exports = tsa({
    street1: tsa.required()
  , street2: tsa.optional()
  , zip: tsa.required()
});

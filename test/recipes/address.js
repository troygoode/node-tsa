var kiln = require('../../');

module.exports = kiln({
    street1: kiln.required()
  , street2: kiln.optional()
  , zip: kiln.required()
});

var kiln = require('../../')
  , address = require('./address');

module.exports = kiln({
    first: kiln.required()
  , middle: kiln.optional()
  , last: kiln.required()
  , address: address
});

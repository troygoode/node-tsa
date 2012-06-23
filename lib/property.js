var guard = require('./guard');

module.exports = function(opts){
  return guard(null)(opts);
};

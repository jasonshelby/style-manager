const { readConfig } = require('../services/config-service');

module.exports = function (req, res) {
  res.json(readConfig());
};

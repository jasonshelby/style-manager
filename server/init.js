const doConfig = require('./services/config-service');

module.exports = function (req, res) {

    res.json(doConfig.read());
};

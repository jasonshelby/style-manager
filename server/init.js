const doConfig = require('./API/doConfig');

module.exports = function (req, res) {

    res.json(doConfig.read());
};

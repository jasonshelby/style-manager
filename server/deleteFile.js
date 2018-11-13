const doConfig = require('./services/config-service');
const { rmdirSync } = require('./services/file-service');

module.exports = function (req, res) {
  req.on('data',function(data) {
    const deletePath = data.toString();
    const json = doConfig.delete(deletePath);

    rmdirSync(deletePath,() => {
      console.log('删除成功');
    });

    doConfig.write(json);
    res.json(json);
  });
};

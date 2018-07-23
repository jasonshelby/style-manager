const doConfig = require('./API/doConfig');
const fsSuper = require('./API/fsSuper');

module.exports = function (req, res) {
  req.on('data',function(data) {
    const deletePath = data.toString();
    const json = doConfig.delete(deletePath);

    fsSuper.rmdirSync(deletePath,() => {
      console.log('删除成功');
    });

    doConfig.write(json);
    res.json(json);
  });
};

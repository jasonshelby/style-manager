const doConfig = require('./API/doConfig');
const fsSuper = require('./API/fsSuper');

module.exports = function (req, res) {
  req.on('data',function(data) {
    const deletePath = data.toString();
    const json = doConfig.delete(deletePath);

    fsSuper.rmdirSync(deletePath,() => {
      console.log('cheng');
    });

    doConfig.write(json);
    res.json(json);
  });
};

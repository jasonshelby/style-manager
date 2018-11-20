const { deleteConfig } = require('../services/config-service');
const { removeDirSync } = require('../services/file-service');

module.exports = function (req, res) {
  req.on('data',function(data) {
    const config = JSON.parse(data)

    removeDirSync(config.path, (e) => {
      if(!e) {
        const deleteMessage = deleteConfig(config.type, config.name);
        console.log('项目删除成功')

        res.json({
          success: true,
          data: deleteMessage,
          errorMessage: null,
        })
      } else {
        res.json({
          success: false,
          errorMessage: JSON.stringify(e)
        })
      }
    })

  });
};

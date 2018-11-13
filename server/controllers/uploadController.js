const multer = require('multer');
const fsSuper = require('../API/fsSuper');
const doConfig = require('../services/config-service');
const configDomain = 'http://localhost:3000/';
const {
  parseFormData,
  checkFile,
} = require('../services/file-service')


function setConfig(config) {
  config.static = configDomain +config.path+ config.originalZipName
  console.log('settingConfig')
  let figJson = doConfig.read();

  doConfig.write(figJson);
}

module.exports = {
  upload: multer({ storage: multer.diskStorage({
    //设置路径的钩子
    destination: function (req, file, cb) {
      const detail = JSON.parse(req.body.detail)
      const path = `store/${detail.type}/${detail.name}/`
      fsSuper.mkdirSync(path, 0, e => e ? console.log('储存文件夹创建失败') : console.log('储存文件创建成功'));//按路径添加文件夹

      cb(null, path);
    },
    //设置文件名的钩子
    filename: function (req, file, cb) {
      // const filename = (file.originalname.split('.')[1] == 'zip') ? 'fornow.zip' : 'origin.sketch';
      cb(null, file.originalname);
    }
  })}),

  add: (req, res)=> {
    const newConfig = parseFormData(req.files, req.body)
    const path = `store/${newConfig.type}/${newConfig.name}/`
    newConfig.path = path

    fsSuper.UnzipToPosition(path + newConfig.zipName, path);
    fsSuper.rmdirSync(path + '__MACOSX', e => e ? console.log('删除失败') : console.log('__MACOSX删除成功'))


    if(checkFile(newConfig)) {
      console.log('文件合格')

      // setFiles(newConfig)
      setConfig(newConfig)
      console.log(newConfig)
      res.json(newConfig);
    } else {
      console.log('文件不合格')
      fsSuper.rmdirSync(path, e => e ? console.log('删除失败') : console.log('不合格文件删除成功'))
      res.json('errorMessage');
    }
  }
};

//重命名
// fs.renameSync(pathSpace+ '/'+ filename.split('.')[0], pathSpace+ '/static');
//删除多余文件
// this.rmdirSync(pathSpace + '/__MACOSX');
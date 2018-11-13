const multer = require('multer');
const doConfig = require('../services/config-service');
const {
  checkFile,
  mkdirSync,
  UnzipToPosition,
  rmdirSync,
} = require('../services/file-service')

const uploadFile = (req, res)=> {
  const newConfig = doConfig.parseFormData(req.files, req.body)
  const path = `store/${newConfig.type}/${newConfig.name}/`
  newConfig.path = path

  UnzipToPosition(path + newConfig.zipName, path);
  rmdirSync(path + '__MACOSX', e => e ? console.log('删除失败') : console.log('__MACOSX删除成功'))

  if(checkFile(newConfig, [ 'assets', 'index.html', 'links', 'preview' ])) {
    console.log('文件合格')
    doConfig.setConfig(newConfig)
    console.log(newConfig)
    res.json(newConfig);
  } else {
    console.log('文件不合格')
    rmdirSync(path, e => e ? console.log('删除失败') : console.log('不合格文件删除成功'))
    res.json('errorMessage');
  }
}


module.exports = {
  upload: multer({ storage: multer.diskStorage({
    //设置路径的钩子
    destination: function (req, file, cb) {
      const detail = JSON.parse(req.body.detail)
      const path = `store/${detail.type}/${detail.name}/`
      mkdirSync(path, 0, e => e ? console.log('储存文件夹创建失败') : console.log('储存文件创建成功'));//按路径添加文件夹

      cb(null, path);
    },
    //设置文件名的钩子
    filename: function (req, file, cb) {
      // const filename = (file.originalname.split('.')[1] == 'zip') ? 'fornow.zip' : 'origin.sketch';
      cb(null, file.originalname);
    }
  })}),
  uploadFile,
};

//重命名
// fs.renameSync(pathSpace+ '/'+ filename.split('.')[0], pathSpace+ '/static');
//删除多余文件
// this.rmdirSync(pathSpace + '/__MACOSX');
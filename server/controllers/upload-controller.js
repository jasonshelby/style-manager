const multer = require('multer');
const {
  parseFormData,
  updataConfig,
} = require('../services/config-service');
const {
  UnzipToPosition,
  checkFile,
  makedirSync,
  removeDirSync,
} = require('../services/file-service')
const fs = require('fs');

const router = multer({ storage: multer.diskStorage({
  //设置路径的钩子
  destination: function (req, file, cb) {
    const detail = JSON.parse(req.body.detail)
    const path = `store/${detail.type}/${detail.name}/`
    makedirSync(path, 0, e => e ? console.log('储存文件夹创建失败') : console.log('储存文件创建成功'));//按路径添加文件夹

    cb(null, path);
  },
  //设置文件名的钩子
  filename: function (req, file, cb) {
    // const filename = (file.originalname.split('.')[1] == 'zip') ? 'fornow.zip' : 'origin.sketch';
    cb(null, file.originalname);
  }
})})

const uploadFile = (req, res)=> {
  const newConfig = parseFormData(req.files, req.body)

  UnzipToPosition(newConfig.path + newConfig.zipName, newConfig.path);
  removeDirSync(newConfig.path + '__MACOSX', e => e ? console.log('删除失败') : console.log('__MACOSX删除成功'))

  if(checkFile(newConfig, [ 'assets', 'index.html', 'links', 'preview'])) {
    fs.renameSync(newConfig.path + newConfig.originalZipName, newConfig.path+ 'static');
    updataConfig(newConfig)
    
    res.json({
      success: true,
      data: newConfig,
      errorMessage: null,
    });
  } else {
    removeDirSync(newConfig.path, e => e ? console.log('删除失败') : console.log('不合格文件删除成功'))
    res.json({
      success: false,
      data: null,
      errorMessage: '文件不合格',
    })
  }
}

const updataFile = (req, res) => {
  const newConfig = parseFormData(req.files, req.body)

  if(newConfig.zipName) {
    UnzipToPosition(newConfig.path + newConfig.zipName, newConfig.path);
    removeDirSync(newConfig.path + '__MACOSX', e => e ? console.log('删除失败') : console.log('__MACOSX删除成功'))

    if(checkFile(newConfig, [ 'assets', 'index.html', 'links', 'preview'])) {
      updataConfig(newConfig)

      res.json({
        success: true,
        data: updataConfig(newConfig),
        errorMessage: null,
      })
    } else {
      res.json({
        success: false,
        data: null,
        errorMessage: '文件不合格'
      })
    }
  }

  if(newConfig.sketchName) {
    //...
    res.json({
      success: true,
      data: null,
      errorMessage: '文件不合格'
    })
  }

}

module.exports = {
  router,
  uploadFile,
  updataFile,
};

//重命名
// fs.renameSync(pathSpace+ '/'+ filename.split('.')[0], pathSpace+ '/static');
//删除多余文件
// this.removeDirSync(pathSpace + '/__MACOSX');
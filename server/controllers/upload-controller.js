const multer = require('multer');
const {
  parseFormData,
  updateConfig,
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
    updateConfig(newConfig)
    
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
      errorMessage: '压缩文件夹内缺少响应文件',
    })
  }
}

const updateFile = (req, res) => {

  const newConfig = parseFormData(req.files, req.body)
  updateConfig(newConfig)

  // console.log('更新配置: ', newConfig)

  if(newConfig.sketchName) {
    //...

    res.json({
      success: true,
      data: newConfig,
      errorMessage: null,
    })
  }


  if(newConfig.zipName) {
    console.log('更新配置: ', newConfig)
    UnzipToPosition(newConfig.path + newConfig.zipName, newConfig.path);

    console.log('delete path:', newConfig.path + '__MACOSX')
    // removeDirSync(newConfig.path + '__MACOSX', e => e ? console.log('删除失败') : console.log('__MACOSX删除成功'))


    console.log(888)
    // if(checkFile(newConfig, [ 'assets', 'index.html', 'links', 'preview'])) {
    //   fs.renameSync(newConfig.path + newConfig.originalZipName, newConfig.path+ 'static');
    //   updateConfig(newConfig)
    //   console.log(999)


    //   res.json({
    //     success: true,
    //     data: updateConfig(newConfig),
    //     errorMessage: null,
    //   })
    // } else {
    //   console.log(111)

    //   res.json({
    //     success: false,
    //     data: null,
    //     errorMessage: '文件不合格'
    //   })
    // }
  }

  

}

module.exports = {
  router,
  uploadFile,
  updateFile,
};

//重命名
// fs.renameSync(pathSpace+ '/'+ filename.split('.')[0], pathSpace+ '/static');
//删除多余文件
// this.removeDirSync(pathSpace + '/__MACOSX');
const multer = require('multer');
const fs = require('fs');
const fsSuper = require('./API/fsSuper');
const doConfig = require('./API/doConfig');
const configDomain = 'http://localhost:3000/';


function parseFormData (files, data) {
  const result = Object.assign({}, JSON.parse(data.detail));
  
  files.forEach(item => {
    const fileName = item.fieldname;
    result[fileName + 'Name'] = item.originalname;
    result[fileName + 'Size'] = item.size;
  });
  return result;
}

function checkFile(config) {
  const subFiles = fs.readdirSync(config.path);
  const directorys = subFiles.filter(item => !/\.(zip)|(sketch)/.test(item))
  if(directorys.length == 1) {
    config.originalZipName = directorys[0]
    return fsSuper.checkInnerChild(config.path + directorys.pop(), [ 'assets', 'index.html', 'links', 'preview' ])
  } else {
    //出现两个文件夹视为异常，文件不合格
    return false
  }
}


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

  func: (req, res)=> {
    const newConfig = parseFormData(req.files, req.body)
    const path = `store/${newConfig.type}/${newConfig.name}/`
    newConfig.path = path

    fsSuper.UnzipToPosition(path + newConfig.zipName, path);
    fsSuper.rmdirSync(path + '__MACOSX', e => e ? console.log('删除失败') : console.log('__MACOSX删除成功'))


    if(checkFile(newConfig)) {
      console.log('文件合格')

      var mark = /到此运行完美/
      // setFiles(newConfig)
      setConfig(newConfig)
      console.log(newConfig)
      res.json(newConfig);
    } else {
      console.log('文件不合格')
      fsSuper.rmdirSync(path, e => e ? console.log('删除失败') : console.log('不合格文件删除成功'))
      fsSuper.rmdirSync(path);
      //文件校验失败
      res.json('errorMessage');
    }
  }
};

//重命名
// fs.renameSync(pathSpace+ '/'+ filename.split('.')[0], pathSpace+ '/static');
//删除多余文件
// this.rmdirSync(pathSpace + '/__MACOSX');
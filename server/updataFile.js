//接受前端更新的文件
const multer = require('multer');
const fsSuper = require('./API/fsSuper');
const doConfig = require('./API/doConfig');


let pathSpace = ''; //文件储存

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, pathSpace);
    },
    filename: function (req, file, cb) {
      const filename = (file.originalname.split('.')[1] == 'zip') ? 'fornow.zip' : 'origin.sketch';
      cb(null, filename);
    }
});
const upload = multer({ storage: storage });

let oldProject = {};
function handlePath(req, res, data) {
  pathSpace = data.toString();
  oldProject = doConfig.read(pathSpace);
  console.log('旧数据', oldProject);
  res.json('收到');
}
let checkmsg = '';
function handleFile(file, res) {
  let figJson = doConfig.read();
  let newProject = {};
  const fileExt = file.originalname.replace(/.+\./, '');

  if (fileExt == 'sketch'){
    newProject = Object.assign(oldProject, {
      sketchName: file.originalname,
      sketchSize: file.size,
      updataTime: Date.now(),
    });
  } else if (fileExt == 'zip') {
    newProject = Object.assign(oldProject, {
      zipName: file.originalname,
      zipSize: file.size,
      updataTime: Date.now(),
    });
    checkmsg = fsSuper.afterZip(pathSpace, file.originalname, 'updata');
  }

  
  if (checkmsg === true) {//文件合格
    delete figJson.error;
    console.log('更新配置', newProject);
    const arr = pathSpace.split('/');
    figJson.files[arr[1]][arr[2]] = newProject;
    doConfig.write(figJson);
  } else if (typeof checkmsg == 'string') {
    console.log('文件不合格，配置未更新');
    figJson.error = checkmsg;
  }
  res.json(figJson);
}

module.exports = {
  upload: upload,
  func: function (req, res) {
    req.on('data',function(data) {
      handlePath(req, res, data);
    });

    if(req.file) {
      handleFile(req.file, res);
    }
  }
};
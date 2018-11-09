//接受前端上传来的文件
const multer = require('multer');
const fsSuper = require('./API/fsSuper');
const doConfig = require('./API/doConfig');
const configDomain = 'http://localhost:3000/';


let pathSpace = ''; //文件储存
let formData = {};


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

function handleForm(req, res, data) {
  let thunk = JSON.parse(data);
  console.log(thunk);
  thunk.timeId = Date.now();
  formData = thunk;
  pathSpace = `store/${thunk.type}/${thunk.timeId}`;//创建路径
  fsSuper.mkdirSync(pathSpace,0,e => e ? console.log('储存文件创建失败') : console.log('储存文件创建成功'));//按路径添加文件夹
  res.json('接受并处理表单');
}

let project = {};   //配置信息
let figJson = doConfig.read();

function handleFile(file, data, res) {
  console.log(11111, file, data);
  const fileExt = file.originalname.split('.').pop();
  if (fileExt == 'sketch'){
    Object.assign(project, {
      explain: formData.explain,
      projectName: formData.name,
      path: file.destination,
      updataTime: formData.timeId,
      sketchName: file.originalname,
      sketchSize: file.size,
      configDomain
    });
    res.json('sketch处理完成');
  } else if (fileExt == 'zip') {
    Object.assign(project, {
      zipName: file.originalname,
      zipSize: file.size,
      htmlPath: `${project.path}/static/index.html`
    });
    figJson.files[formData.type][formData.timeId] = project;

    //解压，重命名文件，删除多余文件
    const checkmsg = fsSuper.afterZip(pathSpace, file.originalname, 'upload');

    if (checkmsg === true) {//文件合格

      delete figJson.error;
      doConfig.write(figJson);
      console.log('新建配置', project);
      res.json(figJson);
    } else if (typeof checkmsg == 'string'){
      delete figJson.files[formData.type][formData.timeId];
      console.log('文件不符合标准');
      figJson.error = checkmsg;
      res.json(figJson);
    }
  }
}

module.exports = {
  upload: upload,
  func: function (req, res) {

    req.on('data', function(data) {
      // demoData(req, res, data);
      handleForm(req, res, data);
    });

    if(req.file) {
      // demoFile(req.file, res);
      handleFile(req.file, req.body, res);
    }

  }
};

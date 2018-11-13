const fsSuper = require('../API/fsSuper');
const fs = require('fs');

function parseFormData (files, data) {
  const result = Object.assign({}, JSON.parse(data.detail));
  
  files.forEach(item => {
    const fileName = item.fieldname;
    result[fileName + 'Name'] = item.originalname;
    result[fileName + 'Size'] = item.size;
  });
  return result;
}

function checkFile (config) {
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
module.exports = {
  parseFormData,
  checkFile,
}
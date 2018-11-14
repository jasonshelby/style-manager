const fs = require('fs');
const AdmZip = require('adm-zip');

function checkFile (config, checkChilds) {
  const subFiles = fs.readdirSync(config.path);
  const directorys = subFiles.filter(item => !/\.(zip)|(sketch)/.test(item))
  if(directorys.length == 1) {
    const originalZipName = directorys.pop()
    config.originalZipName = originalZipName
    const subFiles = fs.readdirSync(config.path + originalZipName);

    return checkChilds.every(item => subFiles.indexOf(item) != -1)
  } else {
    //出现两个文件夹视为异常，文件不合格
    return false
  }
}

function UnzipToPosition(from, to) {
  let unzip = new AdmZip(from);
  unzip.extractAllTo(to, /*overwrite*/true);
}

function mkdirSync(url,mode,cb){
  var arr = url.split('/');
  mode = mode || 0755;
  cb = cb || function(){};
  if(arr[0]==='.'){//处理 ./aaa
      arr.shift();
  }
  if(arr[0] == '..'){//处理 ../ddd/d
      arr.splice(0,2,arr[0]+'/'+arr[1])
  }
  function inner(cur){
      if(!fs.existsSync(cur)){//不存在就创建一个
          fs.mkdirSync(cur, mode);
      }
      if(arr.length){
          inner(cur + '/'+arr.shift());
      }else{
          cb();
      }
  }
  arr.length && inner(arr.shift());
}
const rmdirSync = (function(){
  function iterator(url,dirs){
      var stat = fs.statSync(url);
      if(stat.isDirectory()){
          dirs.unshift(url);//收集目录
          inner(url,dirs);
      }else if(stat.isFile()){
          fs.unlinkSync(url);//直接删除文件
      }
  }
  function inner(path,dirs){
      var arr = fs.readdirSync(path);
      for(var i = 0, el ; el = arr[i++];){
          iterator(path + '/' + el,dirs);
      }
  }
  return function(dir,cb){
      cb = cb || function(){};
      var dirs = [];

      try{
          iterator(dir,dirs);
          for(var i = 0, el ; el = dirs[i++];){
              fs.rmdirSync(el);//一次性删除所有收集到的目录
          }
          cb()
      }catch(e){//如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
          e.code === 'ENOENT' ? cb() : cb(e);
      }
  };
})()

module.exports = {
  checkFile,
  UnzipToPosition,
  mkdirSync,
  rmdirSync,
}
const fs = require('fs');
const AdmZip = require('adm-zip');

module.exports = {
  mkdirSync(url,mode,cb){
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
  },
  rmdirSync :(function(){
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
  })(),

  UnzipToPosition(from, to) {
    console.log(from, to)
    let unzip = new AdmZip(from);
    unzip.extractAllTo(to, /*overwrite*/true);
  },

  checkInnerChild(filePath, childs = []) {
    let subFiles = fs.readdirSync(filePath);
    return childs.every(item => subFiles.indexOf(item) != -1)
  },

  // afterZip(pathSpace, filename, action) {
  //   let unzip = new AdmZip(pathSpace + '/fornow.zip');
  //   unzip.extractAllTo(pathSpace, /*overwrite*/true);

  //   const checkmsg = this.check(pathSpace+ '/'+ filename.split('.')[0]);
  //   if(checkmsg === true){//文件合格
  //     fs.renameSync(pathSpace+ '/fornow.zip', pathSpace+ '/exportHtml.zip');
  //     this.rmdirSync(pathSpace + '/static');
  //     //重命名
  //     fs.renameSync(pathSpace+ '/'+ filename.split('.')[0], pathSpace+ '/static');
  //     //删除多余文件
  //     this.rmdirSync(pathSpace + '/__MACOSX');
  //   } else {//文件不合格
  //     if(action == 'upload') {
  //       this.rmdirSync(pathSpace);
  //     } else if (action == 'updata'){
  //       this.rmdirSync(pathSpace + '/fornow.zip');
  //       this.rmdirSync(pathSpace+ '/'+ filename.split('.')[0]);
  //     }
  //   }
  //   return checkmsg;
  // },
  // check(filepath) {
  //   let Standard = [ 'assets', 'index.html', 'links', 'preview' ];
  //   let subFiles = fs.readdirSync(filepath);
  //   let result = true;

  //   Standard.forEach((item) => {
  //     if(subFiles.indexOf(item) == -1) {
  //       result = item;
  //     }
  //   });

  //   return result;
  // }
};
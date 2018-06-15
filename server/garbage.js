
// START  读文件，写json做出的尝试，和废弃的代码

const fs = require('fs');
const path = require('path');

let pathSpace = [];
function readCur(filepath) {
    let subFiles = fs.readdirSync(filepath);
    if (subFiles && subFiles.length) { // 目录
        subFiles.forEach(file => {
            // console.log('file: %j', file);
            let subPath = path.resolve(filepath, file);
            if (fs.statSync(subPath).isFile()) {
                const fileExt = subPath.replace(/.+\./, '').toLowerCase();
                const fileArr = subPath.split('/');
                const name = fileArr[fileArr.length - 1];
                if (name == 'index.html' || fileExt == 'zip' || fileExt == 'sketch'){
                    pathSpace.push(subPath);
                }
            } else {
                readCur(subPath);
            }
        });
    }
}

const filepath = './store';

readCur(filepath);

let store = {
  金桔宝: {},
  滴水贷: {},
  预支工资: {}
};

// 解析路径，打包成对象（json数据）,直接返回的配置文件就好，不用打包了
pathSpace.forEach(item => {
  let nameArr = item.split('/');
  const storeIndex = nameArr.indexOf('store');
  nameArr = nameArr.slice(storeIndex + 1);
  if (nameArr.length == 4) {
    var demo = store[nameArr[0]][nameArr[1]] = {};
    demo.html = nameArr.join('/');
  }
   else {
    const fileExt = item.replace(/.+\./, '');
    store[nameArr[0]][nameArr[1]][fileExt] = nameArr.join('/');
  }
});

console.log('store: %j',store);



var target = path.join(__dirname, process.argv[2] || '../');
console.log(target);

function loaddir(target, level, store) {
    // var prefix = new Array(level + 1).join('│  ');
    var dirinfo = fs.readdirSync(target);

    let curfile = store;

    console.log(1,curfile);

    var dirs = [];
    
    var files = [];

    dirinfo.forEach(info=> {
        var stat = fs.statSync(path.join(target, info));
        if (stat.isDirectory()) {
            console.log('info: %j', info);
            curfile[info] = {};
            dirs.push(info);
        } else {
            console.log(2, curfile);
            curfile[info] = 0;
            files.push(info);
        }
    });

    var next = level + 1;
    // console.log(dirs);
    dirs.forEach(dir=> {
        // console.log(`${prefix}├─ ${dir}`);
        loaddir(path.join(target, dir), next);
    });

    var count = files.length - 1;
    files.forEach(file=> {
        if (count--) {
            // console.log(`${prefix}├─ ${file}`);
        } else {
            // console.log(`${prefix}└─ ${file}`);
        }
    });
}

let store = {};

loaddir(filepath, 0, store);
// END  读文件，写json做出的尝试，和废弃的代码



  // 由路径变成json
function pathToJson(path, initJson) {
  console.log(path, initJson);
  let nameArr = path.split('/');
  const storeIndex = nameArr.indexOf('store');
  nameArr = nameArr.slice(storeIndex + 1);
  if (nameArr.length == 4) {
    var demo = initJson[nameArr[0]][nameArr[1]] = {};
    demo.html = nameArr.join('/');
  } else {
    const fileExt = path.replace(/.+\./, '');
    initJson[nameArr[0]][nameArr[1]][fileExt] = nameArr.join('/');
  }
}





``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

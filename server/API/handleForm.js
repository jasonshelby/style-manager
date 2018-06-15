//接受表单，并简单封装成易读的对象
const fsSuper = require('./fsSuper');

let formData = {};

module.exports = {
  func: function (req, res, next) {
    req.on('data',function(data) {
      let thunk = JSON.parse(data);

      thunk.timeId = Date.now();
      thunk.pathSpace = `store/${thunk.type}/${thunk.timeId}`;//创建路径
      formData = thunk;
      console.log('这里是分离中的表单', formData);

      fsSuper.mkdirSync(thunk.pathSpace,0,e => e ? console.log('储存文件创建失败') : console.log('储存文件创建成功'));//按路径添加文件夹
      next();
      res.json('接受并处理表单');
    });
  },
  formData
};
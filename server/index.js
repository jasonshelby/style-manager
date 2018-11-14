const express = require('express');
const app = express();
const homeController = require('./controllers/home-controller');
const fileController = require('./controllers/upload-controller');
const deleteController = require('./controllers/delete-controller');
// const fileController = require('./controllers/updata-controller');

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By',' 3.2.1');
  next();
});

app.use('/store', express.static('./store'));
app.get('/', homeController);
app.post('/uploadFile/', fileController.router.any(), fileController.uploadFile);
app.post('/updataFile/', fileController.router.single('file'), fileController.updataFile);
app.post('/deleteFile/', deleteController);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});





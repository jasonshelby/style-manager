const express = require('express');
const app = express();
const crossDomain = require('./API/crossDomain');
const init = require('./init');
// const uploadFile = require('./uploadFile');
const updataFile = require('./updataFile');
const deleteFile = require('./deleteFile');
const uploadController = require('./controllers/uploadController');


app.use('/store', express.static('./store'));
app.all('*', crossDomain);
app.get('/', init);
// app.post('/uploadFile', uploadFile.upload.single('file'), uploadFile.func);
app.post('/updataFile', updataFile.upload.single('file'), updataFile.func);
app.post('/deleteFile/', deleteFile);
app.post('/uploadFile', uploadController.upload.any(), uploadController.add);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});





const multer = require('multer');
const pathSpace = '';

function parse(files, data) {
  const result = Object.assign({}, JSON.parse(data.detail));
  
  files.forEach(item => {
    const fileName = item.fieldname;
    result[fileName + 'Name'] = item.originalname;
    result[fileName + 'Id'] = item.filename;
    result[fileName + 'Size'] = item.size;
  });
  return result;
}


module.exports = {
  upload : multer({ dest: 'uploads/' }),
  // upload: multer({ storage: multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     console.log('使用的pathSpace', pathSpace);
  //     cb(null, pathSpace);
  //   },
  //   filename: function (req, file, cb) {
  //     const filename = (file.originalname.split('.')[1] == 'zip') ? 'fornow.zip' : 'origin.sketch';
  //     console.log('使用的fileName', filename);
  //     cb(null, filename);
  //   }
  // })}),

  func: (req, res)=> {
    console.log(req.files, req.body)
    const newConfig = parse(req.files, req.body)
    console.log(newConfig)

    res.json('hhh');
  }
};
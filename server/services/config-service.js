const fs = require('fs');
const configDomain = 'http://localhost:3000/';
const json = './store/config.json';

function readConfig (path) {
  const thunk = fs.readFileSync(json, 'utf-8');
  const config = JSON.parse(thunk);
  if (path) {
    const arr = path.split('/');
    return config.files[arr[1]][arr[2]];
  }
  return config;
}

function writeConfig(data) {
  let content = JSON.stringify(data);
  fs.writeFileSync(json, content);
}

function parseFormData (files, data) {
  const result = Object.assign({}, JSON.parse(data.detail));
  
  files.forEach(item => {
    const fileName = item.fieldname;
    result[fileName + 'Name'] = item.originalname;
    result[fileName + 'Size'] = item.size;
  });
  return result;
}

function setConfig(config) {
  config.static = configDomain +config.path+ config.originalZipName
  let figJson = readConfig();

  writeConfig(figJson);
}

module.exports = {
  parseFormData,
  readConfig,
  writeConfig,
  setConfig,
  deleteConfig(path){
    const json = this.readConfig();
    const arr = path.split('/');
    delete json.files[arr[1]][arr[2]];
    return json;
  },
  clear(){
    const json = this.readConfig();
    const types = json.types;
    types.forEach((item) => {
      json.files[item] = {};
    });
    this.writeConfig(json);
  },
  reInit() {
    const json = this.readConfig();
    const types = json.types;
    types.forEach((item) => {
      if (!json.files[item]) {
        json.files[item] = {};
      }
    });
    this.writeConfig(json);
  }
};
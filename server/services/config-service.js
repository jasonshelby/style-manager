const fs = require('fs');
const configDomain = 'http://localhost:3000/';
const json = './store/config.json';

function readConfig (name, type) {
  const thunk = fs.readFileSync(json, 'utf-8');
  const config = JSON.parse(thunk);
  if (name && type) {
    return config.files[type][name];
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
  result.path = `store/${result.type}/${result.name}/`
  result.updataTime = Date.now()

  return result;
}

function updateConfig(newConfig) {
  let globolConfig = readConfig()
  let projectMessage = globolConfig.files[newConfig.type][newConfig.name]
  newConfig.static = configDomain + newConfig.path

  if(projectMessage) {
    //替换
    projectMessage = Object.assign(projectMessage, newConfig);
  } else {
    //添加
    globolConfig.files[newConfig.type][newConfig.name] = newConfig
  }
  writeConfig(globolConfig)

  return globolConfig.files
}

function deleteConfig (type, name) {
  const json = readConfig();
  const project = json.files[type][name]

  delete json.files[type][name]
  writeConfig(json);

  return project;
}


module.exports = {
  parseFormData,
  readConfig,
  writeConfig,
  updateConfig,
  deleteConfig,
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
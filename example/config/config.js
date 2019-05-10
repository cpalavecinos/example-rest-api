const fs = require('fs');
const path = require('path');
let configBuffer = null;
switch (process.env.NODE_ENV) {
  case 'development':
    configBuffer = fs.readFileSync(path.resolve(__dirname, 'config.development.json'), 'utf-8');
    break;	
  case 'production':
    configBuffer = fs.readFileSync(path.resolve(__dirname, 'config.production.json'), 'utf-8');
    break;
  case 'test':
    configBuffer = fs.readFileSync(path.resolve(__dirname, 'config.test.json'), 'utf-8');
    break;
  default:
    configBuffer = fs.readFileSync(path.resolve(__dirname, 'config.development.json'), 'utf-8');
}
let config = JSON.parse(configBuffer);

module.exports = config;
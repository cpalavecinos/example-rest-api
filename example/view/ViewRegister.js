const ViewBase = require('./ViewBase');

module.exports = class ViewRegister extends ViewBase{
    constructor(code, message, fields, token) {
      super(code, message);
      this.fields=fields;
      this.token=token;
    }
  }   

 
  

const ViewBase = require('./ViewBase');

module.exports = class ViewToken extends ViewBase{
    constructor(code, message, token) {
      super(code, message);      
      this.token=token;
    }
 }
const ViewBase = require('./ViewBase');

module.exports = class ViewUser extends ViewBase{
    constructor(code, message, user) {
      super(code, message);      
      this.user=user;
    }
 }
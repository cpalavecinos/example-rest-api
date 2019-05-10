const jwt = require('jsonwebtoken'); 
const config = require('../config/config'); 
let log = require('log4js').getLogger("VerifyToken");
let ViewBase = require('../view/ViewBase');

function verifyToken(req, res, next) {    
  log.info("verifyToken Init");  
  var token = req.headers['x-access-token'];
  if (!token) {
    log.error('No token provided');
    return res.status(403).json(new ViewBase(403, 'No token provided'));
  }
  jwt.verify(token, config.secret, function(err, decoded) {  
    if (err) {
      log.error("Failed to authenticate token "+ err.message);
      return res.status(500).send(new ViewBase(500, 'Failed to authenticate token '+ err.message));       
    }  
    req.userId = decoded.id;
    log.info("verifyToken Ens userid"+  req.userId);  
    next();
  });
}

module.exports = verifyToken;
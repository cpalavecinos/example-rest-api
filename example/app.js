const log4js = require('log4js');
const express = require('express');
const db = require('./db');
const ViewBase = require('./view/ViewBase');

const app = express();
const log = log4js.getLogger("app");

global.__root   = __dirname + '/'; 

app.get('/api', function (req, res) {  
  res.status(200).json({code:200, message:'REST API eorks.'});
});

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

const UserController = require(__root + 'user/UserController');
app.use('/api/users', UserController);

const AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

/// catch 404 and forward to error handler
//https://expressjs.com/en/guide/error-handling.html
app.use(function(req, res, next) {  
  log.error("catch 404 and forward to error handler:");
  const err = new Error('Error request URL not found');
  err.status = 404;
  next(err);
});

// development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    log.error("catch "+ err.status +" : "+ err.message, err);    
    res.status(err.status || 500).json(new ViewBase(err.status || 500, err.message));      
  });
}

// production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
  log.info("catch "+ err.status +" : "+ err.message);    
  res.status(err.status || 500).json(new ViewBase(err.status || 500, err.message));      
});

module.exports = app;
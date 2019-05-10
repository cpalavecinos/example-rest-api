let express = require('express');
let bodyParser = require('body-parser');
let VerifyToken = require('./VerifyToken');
let jwt = require('jsonwebtoken'); 
let bcrypt = require('bcryptjs');
let config = require('../config/config'); 
let User = require('../user/User');
let ViewRegister = require('../view/ViewRegister');
let ViewBase = require('../view/ViewBase');
let ViewToken = require('../view/ViewToken');
let ViewUser = require('../view/ViewUser');
const { check, validationResult } = require('express-validator/check');
let log = require('log4js').getLogger("AuthContorller");

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', function(req, res) {
  log.info("/login Init");  
  User.findOne({ email: req.body.email }, function (err, user) {    
    if (err) {
      log.error('Error on the server');
      return res.status(500).json(new ViewToken(500, 'Error on the server', ''));
    }  
    if (!user) {
      log.error('Not user found');
      return res.status(404).json(new ViewToken(404, 'Not user found', ''));
    }    
    // validar password
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      log.error('Not password valid');
      return res.status(401).json(new ViewToken(401, 'Not password valid', ''));
    }
   
    // create a token
    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: config.expiresIn
    });
    res.status(200).json(new ViewToken(200, 'success',token));
    log.info("/login End");  
  });
});

router.get('/logout', function(req, res) {
  log.info("/logout Init");
  res.status(200).json(new ViewBase(200, 'success'));
  log.info("/logout End");
});

router.post('/register', [
  check('name').exists().not().isEmpty().withMessage('name not null'),
  check('email').exists().not().isEmpty().withMessage('email  not null'),
  check('password').exists().not().isEmpty().withMessage('password not null')  ], function(req, res) {
  
  log.debug("Init /register");
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {    
    return `${param}: ${msg}`;
  };

  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {   
    log.error("'Error in fields validation'.");  
    return res.status(400).json(new ViewRegister(400, 'Error in fields validation',  errors.array({ onlyFirstError: true }) , '')); 
  } 

  User.findOne({ email: req.body.email }, function(err, user) {
    if (user) {        
      log.error('The email address ' + req.body.email + ' exist.');    
      return res.status(401).send(new ViewRegister(401, 'The email address ' + req.body.email + ' exist.',  [] , ''));
    } 
    let hashedPassword = bcrypt.hashSync(req.body.password, 8);
      User.create({name : req.body.name, email : req.body.email, password : hashedPassword}, function (err, user) {
        if (err) { 
          log.error('Error in register user create');    
          return res.status(500).json(new ViewRegister(500, 'Error in register' ,  [] , '')  );
        }
        // create a token
        let token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: config.expiresIn
        });               
        res.status(200).json(new ViewRegister(200, 'Success' ,  [] , token)  );
        log.debug("/register End");   
      });
  });  
});

router.get('/me', VerifyToken, function(req, res, next) {
  log.debug("/me Init"); 
  User.findById(req.userId, { password: 0 }, function (err, user) {        
    if (err) {
      log.error("There was a problem finding the user.");    
      return res.status(500).json(new ViewUser(404, 'There was a problem finding the user.', {}) );
    }  
    if (!user) {
      log.error('Not user found.');    
      return res.status(404).json(new ViewUser(500, 'Not user found.', {}) );    
    }
    res.status(200).json(new ViewUser(200, 'Success.', user )); 
    log.debug("/me End"); 
  });
});

module.exports = router;
let express = require('express');
let bcrypt = require('bcryptjs');
let ViewBase = require('../view/ViewBase');
let ViewUser = require('../view/ViewUser');
let bodyParser = require('body-parser');
let User = require('./User');
let log = require('log4js').getLogger("UserController");
let VerifyToken = require(__root + 'auth/VerifyToken');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

// All users
router.get('/', VerifyToken, function (req, res) {
    log.info("All users Init");
    User.find({}, function (err, users) {
        if (err) {
            log.error("Problem infind all users.");
            return res.status(500).json({"code":500, message:"Problem infind all users.", "users":[]});
        }
        res.status(200).json({"code":200, message:"Success", "users":users});
        log.info("All users End");
    });
});

// Single user
router.get('/:id', function (req, res) {
    log.info("Sinfle user  Init id: "+ req.params.id);
    User.findById(req.params.id, function (err, user) {
        if (err) {
            log.error("There was a problem finding the user.");
            return res.status(500).send(new ViewUser(500,"There was a problem finding the user.", {}));
        }
        if (!user) {
            log.error("No user found.");
            return res.status(404).json(new ViewUser(404, "Not found user", {}));
        }
        res.status(200).json(new ViewUser(200, "Success", user) );
        log.info("Single user End");
    });
});

// delete user
router.delete('/:id', function (req, res) {
    log.info("Delete user Init id: "+ req.params.id);
    User.findByIdAndRemove(req.params.id, function (err, user) {        
        if (err) {
            log.error("There was a problem deleting the user.");
            return res.status(500).json(new ViewUser(404, "There was a problem deleting the user.", {}));            
        }
        if (!user) {
            log.error("No user found.");
            return res.status(404).json(new ViewUser(404, "Not found user", {}));
        }
        res.status(200).json(new ViewUser(200, "User: "+ req.params.id +" was deleted", {}) );        
        log.info("Delete user End");
    });
});

// Cretae a new user
router.post('/', function (req, res) {
    log.info("Create user Init");
    User.findOne({ email: req.body.email }, function(err, user) {
        if (user) {        
          log.error('The email address ' + req.body.email + ' exist.');    
          return res.status(401).send(new ViewUser(401, 'The email address ' + req.body.email + ' exist.',  [] ));
        } 
        let hashedPassword = bcrypt.hashSync(req.body.password, 8);
        User.create({
                name : req.body.name,
                email : req.body.email,
                password : hashedPassword
            }, 
            function (err, user) {
                if (err){
                    log.error("There was a problem adding the information to the database.");
                    return res.status(500).json(new ViewUser(500, "There was a problem adding the information to the database.", null));
                } 
                log.info("Create user End");
                res.status(200).json(new ViewUser(200, "Success", user) );
            });
    });       
});

// Update user
router.put('/:id', function (req, res) {
    log.info("Update user Init id: "+req.params.id);
    User.findOne({ email: req.body.email }, function(err, user) {        
        if (user) {                          
            if(user.id != req.params.id){                 
                log.error('The email address ' + req.body.email + ' exist for other user.');    
                return res.status(401).send(new ViewUser(401, 'The email address ' + req.body.email + ' exist. for other user',  [] ));
            }
        } 
        let hashedPassword = bcrypt.hashSync(req.body.password, 8);
        User.findByIdAndUpdate(req.params.id, 
            {
                name : req.body.name,
                email : req.body.email,
                password : hashedPassword
            }
            , {new: true}, function (err, user) {
            if (err) {
                log.error("There was a problem updating the user.");
                return res.status(500).json(new ViewUser(404,"There was a problem updating the user.", {}));
            }
            if (!user) {
                log.error("No user found.");
                return res.status(404).json(new ViewUser(404, "Not found user", {}));
            }
            res.status(200).json(new ViewUser(200, "User: "+ req.params.id +" was updated", user) );                
            log.info("Update user End");
        });
    });     
});

module.exports = router;
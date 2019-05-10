const mongoose = require('mongoose');
const config = require('./config/config');
let log = require('log4js').getLogger("app ");

// remove mongoose promise warn
mongoose.Promise = global.Promise;

const connectOptions = {
    useMongoClient: true
};

// connect or createConnection for MongoDB URL
  try {
    mongoose.connect(config.mongoURL, connectOptions);
  } catch (err) {
    if (err) {
      log.error(err); 
    }
    mongoose.createConnection(config.mongoURL, connectOptions);
  }

mongoose.connection
  .on('error', err => {
    log.error(err); 
  })
  .once('open', () => {
     log.info('mongoDB runing URL .'+ config.mongoURL);
});
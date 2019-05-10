const app = require('./app');
const port = process.env.PORT || 3000;

/**
 * make a log directory, just in case it isn't there.
 */
try {
  require('fs').mkdirSync('./log');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}

let log4js = require('log4js');
log4js.configure('./config/log4js.json');
let log = log4js.getLogger("server ");

let server = app.listen(port, function() {    
  log.info('NODE_ENV        ' +  process.env.NODE_ENV);
  log.info('SERVICE_PORT    ' +  process.env.PORT);      
}); 
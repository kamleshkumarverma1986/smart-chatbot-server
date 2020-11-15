/**
 * Created by kaverma on 19-Sep-2019.
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const queryType = require('query-types');
const app = express();
const routes = require('./routes/index');
const dbConfig = require('./config/datasource');

/* Application Configuration */
(function applicationConfiguration(app) {
  /* ALLOW CORS , so that client machine can connect with server */
  app.use(function(request, response, next) {
    response.header('Access-Control-Allow-Origin', request.headers.origin);
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    response.header("Access-Control-Allow-Credentials", true);
    if ( request.method == 'OPTIONS' ) {
      response.status(200).send();
    } else {
      next();
    }
  });

  app.disable('x-powered-by');
  app.use(bodyParser.json({limit: "50mb"}));
  app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cookieParser());
  app.use(queryType.middleware()); /* This will convert all string type to integer for query parameters */
}(app));

/* Database configuration */
(function databaseConnection(app) {
  app.set('dbUrl', dbConfig.db[app.get('env')]);
  mongoose.Promise = global.Promise;
  mongoose.connect(app.get('dbUrl'));
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'database connection error:'));
  db.once('open', function() {
    console.log("we're connected with database!");
  });
}(app));

/* RESTFUL API */
app.use('/api/v1', routes);

/* Starting the SERVER */
app.listen(4200, () => console.log('Now server is running on port 4200!'));

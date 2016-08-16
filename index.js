var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var config = require('./config')();
var fs = require('fs');
var join = require('path').join;
var events = require('./events')(config);
var logger = require('morgan');
var nunjucks = require('nunjucks');
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var crypto = require('crypto');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(logger('dev'));

app.set('view engine', 'nunjucks');
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
    noCache: true
});

passport.use(new Strategy(
  function(username, password, cb) {
    cb(null,
      (username === config.username &&
        crypto.createHmac('sha512', config.secret).update(password).digest('hex') === config.hash
      )
    );
  }
));

var db = require('./database/sqlite')(config, function() {
  fs.readdirSync('./routes')
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require('./routes/' + file)(app, config, events, db, passport));

  app.listen(config.port, function () {
    console.log('Bot listening on port ' + config.port);
  });
});

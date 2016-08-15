var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var config = require('./config')();
var fs = require('fs');
var join = require('path').join;
var events = require('./events')(config);
var logger = require('morgan');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(logger('dev'));

var db = require('./database/sqlite')(config, function() {
  fs.readdirSync('./routes')
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require('./routes/' + file)(app, config, events, db));

  app.listen(config.port, function () {
    console.log('Bot listening on port ' + config.port);
  });
});

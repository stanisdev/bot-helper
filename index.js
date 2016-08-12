var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var config = require('./config')();
var routes = require('./routes');
var events = require('./events')(config);

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

routes(app, config, events);

app.listen(config.port, function () {
  console.log('Bot listening on port ' + config.port);
});

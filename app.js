
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');

var app = express();

var nnn = require('./nnn');

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});


app.post('/route', function (req, res) {
  // req.body.locations
  // req.body.categories
  // req.body.start

  var start = JSON.parse(req.body.start);
  var categories = JSON.parse(req.body.categories);
  var locations = JSON.parse(req.body.locations);

  start.name = 'start';

  var model = {
    locations: [start],
    distance: 0,
    categories: {}
  };

  var result = nnn.solve(model, locations, categories);

  res.send(result);
});

module.exports = http.createServer(app);

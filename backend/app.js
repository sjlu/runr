
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');

var app = express();

var nnn = require('nnn');

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.post('/route', function (req, res) {
  // req.body.locations

});

/* 

Steve gives me locations and I calculate the distance to the user and place
them into mongo.  This happens on selection in the interface.

Later, Steve requests 'complete'. The actual computation happens here.  We
use the calculated distances to do a nearest neighbor algorithm.  We might
try it multiple times. We request directions from google maps based on the
lat lons we calculate to be the best 'as the crow flies' path.  We then
choose the fastest out of those we choose and send the waypoints back to
Steve.

*/


/*
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
*/

module.exports = http.createServer(app);

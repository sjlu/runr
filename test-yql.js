var yql = require('yql');
var async = require('async');
var request = require('request');

var latlon = ' and latitude="40.7143528" and longitude="-74.0059731" ';

function get (category, cb) {
  var query = "select * from local.search where query=\"" + category + "\"" + latlon + ";";
  yql.exec(query, function (response) {
    cb(null, response.query.results.Result.map(function (item) {
      item.lat = item.Latitude;
      item.lon = item.Longitude;
      item.category = category;
      item.name = item.Title;
      return item;
    }));
  });
}

async.parallel({
  gas: function (callback) { get('gas', callback); },
  laundry: function (callback) { get('laundry', callback); },
  coffee: function (callback) { get('coffee', callback); },
  'post office': function (callback) { get('post office', callback); }
}, function (err, data) {
  var merged = [];

  for (var v in data) {
    merged = merged.concat(data[v]);
  }

  request.post({
    url: 'http://localhost:8000/route',
    method: 'POST',
    form: {
      locations: JSON.stringify(merged),
      categories: JSON.stringify(['gas', 'laundry', 'coffee', 'post office']),
      start: JSON.stringify({lat: "40.7143528", lon: "74.0059731"})
    }
  }, function (err, data, body) {
    if (err) return console.error(err);

    //console.log(JSON.stringify(JSON.parse(body), false, 2));
  });

});

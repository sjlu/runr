var request = require('request');

var locations = [
  {name: "Laundry Locker", lat: "37.770888", lon: "-122.422287", category:"laundry"},
  {name: "Jack's Laundry", lat: "37.765973", lon: "-122.433382", category:"laundry"},
  {name: "Guerrero Laundry", lat: "37.763255", lon: "-122.424031", category:"laundry"},
  {lat: "37.765871", lon: "-122.410711", "name": "Mikado Sushi", category:"sushi"},
  {lat: "37.771403", lon: "-122.423814", "name": "Sushi Zone", category:"sushi"},
  {lat: "37.764596", lon: "-122.431069", "name": "Daimaru Sushi", category:"sushi"},
  {lat: "37.768387", lon: "-122.420081", name: "Arco", category: "gas"},
  {lat: "37.764742", lon: "-122.424134", name: "Guerrero", category: "gas"},
  {lat: "37.781739", lon: "-122.451458", name: "Shell", category: "gas"}
];

var categories = ['sushi', 'laundry', 'gas'];

request.post({
  url: 'http://localhost:8000/route',
  method: 'POST',
  form: {
    locations: JSON.stringify(locations),
    categories: JSON.stringify(categories),
    start: JSON.stringify({lat: "37.771403", lon: "-122.423814"})
  }
}, function (err, data, body) {
  if (err) return console.error(err);
  console.log(body);

  console.log(JSON.stringify(JSON.parse(body), false, 2));
});

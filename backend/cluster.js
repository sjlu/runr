var cluster = require('cluster');
var app = require('./app');

var workers = {};
var count = require('os').cpus().length * 2;
//var count = 1;

function spawn () {
  var worker = cluster.fork();
  workers[worker.pid] = worker;
  return worker;
}

if (cluster.isMaster) {
  for (var i = 0; i < count; i++) {
    spawn();
  }

  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died. spawning a new process...');
    delete workers[worker.pid];
    spawn();
  });
} else {
  app.listen(process.env.app_port || 8000);
}

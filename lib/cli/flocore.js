'use strict';

var Liftoff = require('liftoff');

function main(parentServicesPath, additionalServices) {

  var liftoff = new Liftoff({
    name: 'flocore',
    moduleName: 'flocore-node',
    configName: 'flocore-node',
    processTitle: 'flocore'
  }).on('require', function (name) {
    console.log('Loading:', name);
  }).on('requireFail', function (name, err) {
    console.log('Unable to load:', name, err);
  }).on('respawn', function (flags, child) {
    console.log('Detected node flags:', flags);
    console.log('Respawned to PID:', child.pid);
  });

  liftoff.launch({
    cwd: process.cwd()
  }, function(env){

    var node;
    if (env.configPath && env.modulePath) {
      node = require(env.modulePath);
      node.cli.main();
    } else {
      node = require('../../');
      node.cli.main(parentServicesPath, additionalServices);
    }

    // Gracefully Shut Down
    process.on('SIGTERM', function () {
      console.log("Shutting down flocore-node")
      node.stop(function() {
        console.log("flocore-node successfully stopped!")
        process.exit(0)
      })
    })

  });

}

module.exports = main;

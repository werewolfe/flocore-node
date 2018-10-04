'use strict';

var index = require('../../');
var log = index.log;
var bcoin = require('fcoin');
var bzmq = require('bzmq');

var Bcoin = function(options) {
  this._config = this._getConfig(options);
};

Bcoin.prototype.start = function(callback) {
  var self = this;
  self._bcoin = bcoin.fullnode(self._config);

  bcoin.set(self._config.network || 'main')
  const walletPlugin = bcoin.wallet.plugin;

  // Make fcoin add the wallet plugin
  self._bcoin.use(walletPlugin)
  // bzmq allows zmq connections to fcoin
  self._bcoin.use(bzmq)
  self._bzmq = self._bcoin.require('zmq')

  log.info('Starting Fcoin full node...');

  self._bcoin.open().then(function() {

    // Startup the wallet plugin
    self._walletdb = self._bcoin.require('walletdb');
    self._walletdb.open().then(function() {

      // Continue bcoin startup
      self._bcoin.connect().then(function() {
        log.info('Waiting for Fcoin to sync');
        self._bcoin.startSync();
        // this will instruct the p2p service to start trying to connect to bcoin right away
        callback();
      });

    })
  });
};

Bcoin.prototype.stop = function() {
  this._bcoin.stopSync();
  this._bcoin.disconnect();
  this._bcoin.close();
};

// --- privates

Bcoin.prototype._getConfig = function(options) {
  var config = {
    db: 'leveldb',
    checkpoints: true,
    network: options.network || 'main',
    listen: true,
    logConsole: true,
    logLevel: 'info',
    port: options.port,
    persistent: true,
    workers: true,
    config: true
  };
  if (options.prefix) {
    config.prefix = options.prefix;
  }
  return config;
};

module.exports = Bcoin;

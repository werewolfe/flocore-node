'use strict';

var createError = require('errno').create;

var FlocoreNodeError = createError('FlocoreNodeError');

var RPCError = createError('RPCError', FlocoreNodeError);

module.exports = {
  Error: FlocoreNodeError,
  RPCError: RPCError
};

'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export flocore-lib', function() {
    var flocore = require('../');
    should.exist(flocore.lib);
    should.exist(flocore.lib.Transaction);
    should.exist(flocore.lib.Block);
  });
});

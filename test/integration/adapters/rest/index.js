var utils = require('utilities')
  , assert = require('assert')
  , fork = require('child_process').fork
  , path = require('path')
  , model = require('../../../../lib')
  , helpers = require('.././helpers')
  , config = require('../../../config')
  , Adapter = require('../../../../lib/adapters/rest').Adapter
  , adapter
  , tests
  , mockServer
  , shared = require('../shared');

tests = {
  'before': function (next) {
    var relations = helpers.fixtures.slice()
      , models = [];
    adapter = new Adapter(config.rest);

    model.adapters = {};
    relations.forEach(function (r) {
      model[r].adapter = adapter;
      models.push({
        ctorName: r
      });
    });

    model.registerDefinitions(models);

    mockServer = fork(path.join(__dirname, '/server'));

    // wait for the mock server to run
    setTimeout(next, 2000);
  }

, 'after': function () {
    // stop the mock server
    mockServer.kill();
  }

, 'beforeEach': function(next) {
    model.Event.adapter.restApi.read('beforeEach', null, next);
  }

, 'afterEach': function(next) {
    model.Event.adapter.restApi.read('afterEach', null, next);
  }

, 'test create adapter': function () {
    assert.ok(adapter instanceof Adapter);
  }


};

// paramifying empty Arrays does not work, so this test fails as no id parameter will be send
var disabled = ['test all with empty id inclusion in query object'];

for (var p in shared) {
  if (p == 'beforeEach' || p == 'afterEach') {
    //tests[p] = shared[p];
  }
  else if(disabled.indexOf(p) === -1) {
    tests[p + ' (Rest)'] = shared[p];
  }
}

module.exports = tests;



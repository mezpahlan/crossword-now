'use strict';

var cfenv = require('cfenv');
var Promise = require('bluebird');
var PouchDB = require('pouchdb');
var express = require('express');
var routes = require('./routes/index');
var app = express();
var appEnv;
var vcap;

try { vcap = require('./.vcap.json'); } catch (e) { }

if (vcap === null) {
    // Running on CF
    appEnv = cfenv.getAppEnv();
} else {
    // Running locally
    appEnv = cfenv.getAppEnv({vcap: vcap});
}

var couchUri = appEnv.getServiceURL('crossword-cloudant').concat('crosswords');
var localDb = new PouchDB('crosswords');
var remoteDb = new PouchDB(couchUri);

app.use('/', routes);

var startServer = function () {
    return new Promise(function(resolve, reject) {
        let server = app.listen(appEnv.port, appEnv.bind, function() {
                                    console.log('Server starting on ' + appEnv.url);

                                });
        resolve(server);
    });
};

// First replicate from remote
// Then set up server
remoteDb.sync(localDb)
        .then(result => console.log(result))
        .then(() => startServer())
        .catch(error => console.log(error));

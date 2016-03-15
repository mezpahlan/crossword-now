'use strict';

var Bluebird = require('bluebird');
var express = require('express');
var Helper = require('./controller/helpers');
var database = require('./model/database');
var routes = require('./routes/index');
var app = express();
var appEnv = Helper.getAppEnv();

app.use('/', routes);

var startServer = function () {
    return new Bluebird(function(resolve, reject) {
        let server = app.listen(appEnv.port, appEnv.bind, function() {
                                    console.log('Server starting on ' + appEnv.url);

                                });
        resolve(server);
    });
};

// First replicate from remote
// Then set up server
database.init()
        .then(result => console.log(result))
        .then(() => startServer())
        .catch(error => console.log(error));

'use strict';

var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var routes = require('./routes/index');
var express = require('express');
var app = express();

app.use('/', routes);

var server = app.listen(appEnv.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Crossword app listening at http://%s:%s', host, port);
});

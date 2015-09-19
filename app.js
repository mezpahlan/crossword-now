'use strict';
require('env2')('./.config.env');
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var data = require('./data.json');
var bodyParser = require('body-parser');
var request = require('request');
var express = require('express');
var app = express();

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// Return a random element from a section of data.json.
var random = function (p) {
    return Math.floor(Math.random() * (data[p].length - 1));
};

var payload = function (xwordType) {
    var index = random(xwordType);
    var xwordQuestion = data.easy[index].question;
    var xwordId = data.easy[index].id;

    return JSON.stringify({
        channel: '@mez',
        attachments: [
            {
                fallback: xwordQuestion + '. id: ' + xwordId,
                text: xwordQuestion,
                fields: [
                    {
                        title: 'id',
                        value: xwordId,
                        short: true
                    }
                ],
                color: '#000'
            }
        ]
    });
};

var webhookResponse = function (xwordType) {
    request({
        url: process.env.WEBHOOK_IN_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload(xwordType)
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    });
};

var easy = function (req, res) {
    webhookResponse('easy');
    res.end();
};

var cryptic = function (req, res) {
    webhookResponse('cryptic');
    res.end();
};

// Routing
app.post('/', function (req, res) {
    var text = req.body.text;
    switch (text) {
        case 'cryptic':
            return cryptic(req, res);
        case 'easy':
        case '':
            return easy(req, res);
        default:
            return res.json({
                text: 'Valid options are `easy` for an easy crossword, `cryptic` for a cryptic crossword or leave blank for an easy crossword.'
            });
    }
});

var server = app.listen(appEnv.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

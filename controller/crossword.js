'use strict';
var data = require('../model/data.json');
var request = require('request');
var helpers = require('./helpers');

var payload = function (xwordType) {
    console.log(data.xwordType);
    var index = helpers.randomFromArray(data[xwordType]);
    var xwordQuestion = data.easy[index].question;
    var xwordId = data.easy[index].id;

    // TODO: Return response to the channel that the command was invoked from. Could just be a case of removing the override.
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

var cryptic = function () {
    webhookResponse('cryptic');
};

var easy = function () {
    webhookResponse('easy');
};

var crossword = function (type) {
    if (type === 'easy') {
        return easy();
    } else if (type === 'cryptic') {
        return cryptic();
    }
};

module.exports = crossword;

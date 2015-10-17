'use strict';
var data = require('../model/data');
var request = require('request');
var helpers = require('./helpers');
var replyTo;

var getData = function (xwordType, callback) {
    data.getCrossword(xwordType, function (crossword) {
        data.getEntry(crossword, function (entry, crosswordNumber) {
            callback(entry, crosswordNumber.toString());
        });
    });
};

var payload = function (randomEntry, crosswordNumber, xwordType) {
    var entryId, xwordClue, xwordId;
    entryId = helpers.hash(randomEntry.id);
    xwordClue = randomEntry.clue;
    xwordId = crosswordNumber.concat(entryId);

    // TODO: Return response to the channel that the command was invoked from. Could just be a case of removing the override.
    return JSON.stringify({
        channel: '#'.concat(replyTo),
        attachments: [
            {
                fallback: xwordClue,
                text: xwordClue,
                fields: [
                    {
                        title: 'type',
                        value: xwordType,
                        short: false
                    },
                    {
                        title: 'id',
                        value: xwordId,
                        short: false
                    }
                ],
                color: '#000'
            }
        ]
    });
};

var webhookResponse = function (randomEntry, crosswordNumber, xwordType) {
    request({
        url: process.env.WEBHOOK_IN_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload(randomEntry, crosswordNumber, xwordType)
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    });
};

var cryptic = function () {
    getData('cryptic', function (entry, crosswordNumber) {
        webhookResponse(entry, crosswordNumber, 'cryptic');
    });
};

var quick = function () {
    getData('quick', function (entry, crosswordNumber) {
        webhookResponse(entry, crosswordNumber, 'quick');
    });
};

var crossword = function (type, channel) {
    replyTo = channel;

    if (type === 'quick') {
        return quick();
    } else if (type === 'cryptic') {
        return cryptic();
    }
};

module.exports = crossword;

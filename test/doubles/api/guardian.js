'use strict';

var fs = require('fs');
var Bluebird = require('bluebird');

function guardianApiDouble (url) {
    let promise;
    let response;

    switch (url) {
        case (url.match(/quick\/14140/) || {}).input:
            response = fs.readFileSync('test/data/quick.html', 'utf8');
            promise = Bluebird.resolve(response.trim());
            break;
        case (url.match(/cryptic\/26670/) || {}).input:
            promise = Bluebird.reject('Test fetching \'next\' id.');
            break;
        case (url.match(/cryptic\/26671/) || {}).input:
            response = fs.readFileSync('test/data/cryptic.html', 'utf8');
            promise = Bluebird.resolve(response.trim());
            break;
        case (url.match(/cryptic\/26672/) || {}).input:
            response = fs.readFileSync('test/data/cryptic.html', 'utf8');
            promise = Bluebird.resolve(response.trim());
            break;
        default:
            promise = Bluebird.reject('Testing error. Case needs to be defined.');
    }

    return promise;
}

module.exports = guardianApiDouble;

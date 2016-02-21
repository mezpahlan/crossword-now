'use strict';

var fs = require('fs');
var Bluebird = require('bluebird');

function guardianApiDouble (url) {
    let promise;

    switch (url) {
        case (url.match(/cryptic\/26670/) || {}).input:
            promise = Bluebird.reject('Test fetching \'next\' id.');

            break;
        case (url.match(/cryptic\/26671/) || {}).input:
            let response = fs.readFileSync('test/data/cryptic.html', 'utf8');
            promise = Bluebird.resolve(response.trim());

            break;
        default:
            promise = Bluebird.reject('Testing error. Case needs to be defined.');
    }

    return promise;
}

module.exports = guardianApiDouble;

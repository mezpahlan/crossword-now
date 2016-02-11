'use strict';

var fs = require('fs');
var Bluebird = require('bluebird');

function guardianApiDouble (id) {
    let promise;

    switch (id) {
        case 'cryptic/2660':
            promise = Bluebird.reject('Test fetching \'next\' id.');

            break;
        case 'cryptic/2661':
            let response = fs.readFileSync('test/data/cryptic.html', 'utf8');
            promise = Bluebird.resolve(response.trim());

            break;
        default:
            promise = Bluebird.reject('Testing error. Case needs to be defined.');
    }

    return promise;
}

module.exports = guardianApiDouble;

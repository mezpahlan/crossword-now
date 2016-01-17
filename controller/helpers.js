'use strict';

var Promise = require('bluebird');

// Return a random number from 0 to n-1
exports.randomInteger = function (n) {
    return Math.floor(Math.random() * n);
};

// Return a random index from an array
exports.randomFromArray = function (p) {
    return Math.floor(Math.random() * (p.length - 1));
};

// Return a hash of a string clue id
exports.hashClueId = function (p) {
    var num, direction;
    num = /\d+/.exec(p)[0];
    direction = /[^-0-9]/.exec(p)[0].toUpperCase();

    let checksum = num.length;

    return num.concat(direction).concat(checksum);
};

// Return a hash of a crossword Id
exports.hashCrosswordId = function (p) {
    let num = /\d+/.exec(p)[0];
    let type = /\w+/.exec(p)[0].charAt(0).toUpperCase();

    return type.concat(num);
};

// Returns a crossword id from a hash
exports.unHash = function (p) {
    let length = p.length;
    let checksum = p.charAt(length - 1);
    let direction = p.charAt(length - 2);
    let clueNum = p.substring(length - 2 - checksum, length - 2);
    let crosswordNum = p.substring(1, length - 2 - checksum);
    let type = p.charAt(0);

    if (type === 'Q') {
        type = 'quick';
    } else if (type === 'C') {
        type = 'cryptic';
    }

    if (direction === 'A') {
        direction = '-across';
    } else if (direction === 'D') {
        direction = '-down';
    }

    return { crossword: type.concat('/').concat(crosswordNum), clue: clueNum.concat(direction), type: type };
};

exports.nextId = function (p) {
    return new Promise(function (resolve, reject) {
        let captureGroups = /(.+)\/(.+)/.exec(p);

        // TODO: Destructuring when node supports it [,x,y]
        let type = captureGroups[1];
        let num = captureGroups[2];

        let newId = type + '/' + (parseInt(num) + 1);
        resolve(newId);
    });
};

exports.getAppEnv = function () {
    let cfenv = require('cfenv');
    let appEnv;
    let vcap;

    try { vcap = require('../.vcap.json'); } catch (e) { }

    if (vcap === null) {
       // Running on CF
       appEnv = cfenv.getAppEnv();
    } else {
        // Running locally
        appEnv = cfenv.getAppEnv({vcap: vcap});
    }

    return appEnv;
};

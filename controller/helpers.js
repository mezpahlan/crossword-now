'use strict';

// Return a random index from an array
exports.randomFromArray = function (p) {
    return Math.floor(Math.random() * (p.length - 1));
};

// Return a hash of a string crossword id
exports.hash = function (p) {
    var num, direction;
    num = /\d+/.exec(p)[0];
    direction = /[^-0-9]/.exec(p)[0].toUpperCase();

    return num.concat(direction);
};

// Returns a crossword id from a hash
exports.unHash = function (p) {
    var num, hash, direction;
    num = /\d+/.exec(p)[0];
    hash = /\D/.exec(p)[0];
    if (hash === 'A') {
        direction = 'across';
    } else if (hash === 'D') {
        direction = 'down';
    }

    return num.concat('-').concat(direction);
};

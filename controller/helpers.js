'use strict';

// Return a random index from an array
exports.randomFromArray = function (p) {
    return Math.floor(Math.random() * (p.length - 1));
};

'use strict';

var Bluebird = require('bluebird');

/**
 * Utility methods for assorted tasks.
 */
class Helpers {

    /**
     * Returns a random number from 0 to n-1.
     *
     * @param {number} n - Any integer number.
     * @returns {number} - A random numer.
     */
    static randomInteger (n) {
        return Math.floor(Math.random() * n);
    }

    /**
     * Return a hash of a clue id.
     *
     * @param {string} p - Clue id.
     * @returns {string} - Hash of the clue id.
     */
    static hashClueId (p) {
        let num = /\d+/.exec(p)[0];
        let direction = /[^-0-9]/.exec(p)[0].toUpperCase();

        let checksum = num.length;

        return num.concat(direction).concat(checksum);
    }

    /**
     * Return a hash of a crossword id.
     *
     * @param {string} p - Crossword id.
     * @returns {string} - Hash of the crossword id.
     */
    static hashCrosswordId (p) {
        let num = /\d+/.exec(p)[0];
        let type = /\w+/.exec(p)[0].charAt(0).toUpperCase();

        return type.concat(num);
    }

    /**
     * Returns a crossword id from a hash.
     *
     * @param {string} p - Combined hash of crossword id and clue id.
     * @returns {Object} - Clue info object.
     */
    static unHash (p) {
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
            direction = 'across';
        } else if (direction === 'D') {
            direction = 'down';
        }

        return { crossword: type.concat('/').concat(crosswordNum), clue: clueNum.concat('-').concat(direction), type: type };
    }

    /**
     * Adds one to the crossword id.
     *
     * @param {string} p - Crossword id.
     * @returns {Promise} - A promise that will resolve to new crossword id.
     */
    static nextId (p) {
        return new Bluebird(function (resolve, reject) {
            let captureGroups = /(.+)\/(.+)/.exec(p);

            // TODO: Destructuring when node supports it [,x,y]
            let type = captureGroups[1];
            let num = captureGroups[2];

            let newId = type + '/' + (parseInt(num) + 1);
            resolve(newId);
        });
    }

    static getAppEnv () {
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
    }
}

module.exports = Helpers;

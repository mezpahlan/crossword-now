'use strict';

var Helpers = require('../../controller/helpers');

describe('Helpers', function () {
    it('should return a hash given a clue id', function () {
        expect(Helpers.hashCrosswordId('cryptic/4321')).toBe('C4321');
        expect(Helpers.hashCrosswordId('quick/1234')).toBe('Q1234');
    });
});

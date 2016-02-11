'use strict';

var mockery = require('mockery');
var Guardian = require('../../../api/guardian');

describe('Guardian', () => {

    beforeAll(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        mockery.registerMock('request-promise', () => {
                    return require('../../../test/doubles/api/guardian');
                });
        });

    afterAll(() => {
        mockery.disable();
        mockery.deregisterAll();
    });

    describe('scrape', () => {
        it('should return a crossword given a valid crossword id', () => {
            // Given
            let expected = require('../../../model/cryptic.json');

            // When
            let resultPromise = Guardian.scrape('cryptic/26671');

            // Then
            resultPromise.then(result => expect(result).toEqual(expected));
        });

        it('should try again with the \'next\' valid crossword id', () => {
            // Given
            let expected = require('../../../model/cryptic.json');

            // When
            let resultPromise = Guardian.scrape('cryptic/26670');

            // Then
            resultPromise.then(result => expect(result).toEqual(expected));
        });
    });
});

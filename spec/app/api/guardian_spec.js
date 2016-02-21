'use strict';

var proxyquire = require('proxyquire');
var rpStub = require('../../../test/doubles/api/guardian');
var Guardian = proxyquire('../../../api/guardian', {'request-promise': rpStub});

describe('Guardian', () => {

    describe('scrape', () => {

        it('should return a crossword given a valid crossword id', (done) => {
            // Given
            let expected = require('../../../model/cryptic.json');

            // When
            let promise = Guardian.scrape('cryptic/26671');

            // Then
            promise
                .then(result => expect(result).toEqual(expected))
                .finally(() => done());
        });

        it('should try again with the \'next\' valid crossword id', (done) => {
            // Given
            let expected = require('../../../model/cryptic.json');

            // When
            let resultPromise = Guardian.scrape('cryptic/26670');

            // Then
            resultPromise
                .then(result => expect(result).toEqual(expected))
                .finally(() => done());
        });
    });
});

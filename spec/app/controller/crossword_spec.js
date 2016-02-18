'use strict';

var Crossword = require('../../../controller/crossword');

describe('Crossword', () => {

    describe('invalidOption', () => {
        it('should return usage instructions', () => {
            // Given
            const expected = 'Valid options are `quick` for a quick crossword, ' +
                             '`cryptic` for a cryptic crossword or leave blank for a quick crossword. ' +
                             'For an answer type `answer/<clue id>`.';

            // When
            let resultPromise = Crossword.invalidOption();

            // Then
            resultPromise.then(result => expect(result).toBe(expected));
        });
    });
});

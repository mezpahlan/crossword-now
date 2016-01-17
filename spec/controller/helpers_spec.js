'use strict';
var sinon = require('sinon');
var Helpers = require('../../controller/helpers');

describe('Helpers', () => {

    describe('randomInteger', () => {
        it('should return a random integer between 0 and argument - 1', () => {
            // Given
            sinon.stub(Math, 'random')
                .onCall(0).returns(0)
                .onCall(1).returns(0.4)
                .onCall(2).returns(0.5)
                .onCall(3).returns(0.6)
                .onCall(4).returns(0.9);

            // When
            let result1 = Helpers.randomInteger(4);
            let result2 = Helpers.randomInteger(4);
            let result3 = Helpers.randomInteger(4);
            let result4 = Helpers.randomInteger(4);
            let result5 = Helpers.randomInteger(4);

            // Then
            expect(result1).toBe(0);
            expect(result2).toBe(1);
            expect(result3).toBe(2);
            expect(result4).toBe(2);
            expect(result5).toBe(3);
        });
    });

    describe('hashClueId', () => {
        it('should return a hash of a clue id', () => {
            // Given

            // When
            let result1 = Helpers.hashClueId('1-across');
            let result2 = Helpers.hashClueId('26-down');

            // Then
            expect(result1).toBe('1A1');
            expect(result2).toBe('26D2');
        });
    });

    describe('hashCrosswordId', () => {
        it('should return a hash of a crossword id', () => {
            // Given

            // When
            let result1 = Helpers.hashCrosswordId('cryptic/4321');
            let result2 = Helpers.hashCrosswordId('quick/1234');

            // Then
            expect(result1).toBe('C4321');
            expect(result2).toBe('Q1234');
        });
    });

    describe('unHash', () => {
        it('should return the crossword id, the clue id, and the type as an object', () => {
            // Given

            // When
            let result1 = Helpers.unHash('C43211A1');
            let result2 = Helpers.unHash('Q123426D2');

            // Then
            expect(result1).toEqual({
                crossword: 'cryptic/4321',
                clue: '1-across',
                type: 'cryptic'
            });
            expect(result2).toEqual({
                crossword: 'quick/1234',
                clue: '26-down',
                type: 'quick'
            });
        });
    });

    describe('nextId', () => {
        it('should return the next id given a crossword id', () => {
            // Given


            // When
            let resultPromise1 = Helpers.nextId('cryptic/4321');
            let resultPromise2 = Helpers.nextId('quick/1234');

            // Then
            resultPromise1.then(result1 => expect(result1).toBe('cryptic/4322'));
            resultPromise2.then(result2 => expect(result2).toBe('quick/1235'));
        });
    });
});

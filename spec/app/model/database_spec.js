'use strict';

var proxyquire = require('proxyquire');
var pouchDBStub = require('../../../test/doubles/npm/pouchdb');
var helperStub = require('../../../test/doubles/controller/helpers');
var Database = proxyquire('../../../model/database', {'pouchdb': pouchDBStub, '../controller/helpers.js': helperStub});

describe('Database', () => {

    describe('filterByType', () => {
        it('should return all the cryptic ids from the database', (done) => {
            // Given
            const expected = { offset: 0, total_rows: 1, rows: [{ id: 'cryptic/26671', key: 'cryptic/26671', value: { rev: 'fake-revision' }}]};

            // When
            let resultPromise = Database.filterByType('cryptic');

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });

        it('should return all the quick ids from the database', (done) => {
            // Given
            const expected = { offset: 0, total_rows: 1, rows: [{ id: 'quick/14139', key: 'quick/14139', value: { rev: 'fake-revision' }}]};

            // When
            let resultPromise = Database.filterByType('quick');

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });

    describe('dbInfo', () => {
        it('should return information from the database as a collection', (done) => {
            // Given
            const expected = [
                                { db_name: 'dbDouble', doc_count: 2, update_seq: 3 },
                                { offset: 0, total_rows: 1, rows: [{ id: 'quick/14139', key: 'quick/14139', value: { rev: 'fake-revision' }}]},
                                { offset: 0, total_rows: 1, rows: [{ id: 'cryptic/26671', key: 'cryptic/26671', value: { rev: 'fake-revision' }}]}
                             ];

            // When
            let resultPromise = Database.dbInfo();

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });

    describe('getClue', () => {
        it('should return a quick clue given an input of \'quick\'', (done) => {
            // Given
            const expected = {
                                id: '23-down',
                                number: 23,
                                humanNumber: '23',
                                clue: 'Wickedness (3)',
                                direction: 'down',
                                length: 3,
                                group: ['23-down'],
                                position: { x: 10, y: 10 },
                                separatorLocations: {},
                                solution: 'SIN',
                                parentId: 'quick/14139'
                             };

            // When
            let resultPromise = Database.getClue('quick');

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });

        xit('should return a cryptic clue given an input of \'cryptic\'', (done) => {
            // Given

            // When
            let resultPromise = Database.getClue('cryptic');

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });
});

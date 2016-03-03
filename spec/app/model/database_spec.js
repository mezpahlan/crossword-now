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

        it('should return a cryptic clue given an input of \'cryptic\'', (done) => {
            // Given
            const expected = {
                                id: '22-down',
                                number: 22,
                                humanNumber: '22',
                                clue: 'See 4',
                                direction: 'down',
                                length: 4,
                                group: ['4-down', '22-down'],
                                position: { x: 14, y: 11 },
                                separatorLocations: { ',': [] },
                                solution: 'TALK',
                                parentId: 'cryptic/26671'
                            };

            // When
            let resultPromise = Database.getClue('cryptic');

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });

    describe('getAnswer', () => {
        it('should get an answer given a crossword and clueId', (done) => {
            // Given
            const expected = {
                                id: '1-across',
                                number: 1,
                                humanNumber: '1',
                                clue: 'Sore head from booze, drunk and awake — what now? (5,2)',
                                direction: 'across',
                                length: 7,
                                group: ['1-across'],
                                position: { x: 0, y: 0 },
                                separatorLocations: { ',': [5] },
                                solution: 'SOBERUP'
                            };

            // When
            let resultPromise = Database.getAnswer('cryptic/26671', '1-across');

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });

    describe('insert', () => {
        it('should insert a crossword into the database', (done) => {
            // Given
            const doc = require('../../../test/data/cryptic.26671.json');
            const expected = {
                               ok: true,
                               id: 'cryptic/26671',
                               rev: 'fake-revision'
                             };

            // When
            let resultPromise = Database.insert(doc, doc.id);

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });

    describe('init', () => {
        it('should intialise the database with all the documents from the remote database', (done) => {
            // Given
            const expected = {
                               doc_write_failures: 0,
                               docs_read: 2,
                               docs_written: 2,
                               end_time: 'fake-timestamp',
                               errors: [],
                               last_seq: 2,
                               ok: true,
                               start_time: 'fake-timestamp',
                               status: 'complete'
                             };

            // When
            let resultPromise = Database.init();

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });

    describe('replicate', () => {
        it('should replicate the localDb to the remoteDb', (done) => {
            // Given
            const expected = {
                               doc_write_failures: 0,
                               docs_read: 2,
                               docs_written: 2,
                               end_time: 'fake-timestamp',
                               errors: [],
                               last_seq: 2,
                               ok: true,
                               start_time: 'fake-timestamp',
                               status: 'complete'
                             };

            // When
            let resultPromise = Database.replicate();

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });
});

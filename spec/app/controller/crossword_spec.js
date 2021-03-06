'use strict';

var proxyquire = require('proxyquire');
var Response = require('../../../model/slack/response');
var Field = require('../../../model/slack/field');
var Attachment = require('../../../model/slack/attachment');
var databaseStub = require('../../../test/doubles/model/database');
var websiteStub = require('../../../test/doubles/api/guardian');
var helpersStub = require('../../../test/doubles/controller/helpers');
var Crossword = proxyquire('../../../controller/crossword', {'../model/database': databaseStub, '../api/guardian': websiteStub, './helpers': helpersStub });

describe('Crossword', () => {

    describe('invalidOption', () => {
        it('should return usage instructions', (done) => {
            // Given
            const expected = new Response('ephemeral', 'Valid options are `quick` for a quick crossword, ' +
                             '`cryptic` for a cryptic crossword. For an answer type `answer/<clue id>`.');

            // When
            let resultPromise = Crossword.invalidOption();

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });

    describe('now', () => {
        it('should return a clue given a type', (done) => {
            // Given
            const clueType = new Field('Type', 'cryptic', true);
            const clueId = new Field('Id', 'C266714D1', true);
            const clueInfo = new Attachment('Clue Info', [clueType, clueId]);
            const attachments = [clueInfo];

            const expected = new Response('in_channel', ' Post-it notes discussion? (6,4)', attachments);

            // When
            let resultPromise = Crossword.now('cryptic');

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });

    describe('info', () => {
       it('should describe the current state of the database', (done) => {
           // Given
           const doubledDbInfo = new Attachment('DB Info', [new Field('Count', 2, true)]);
           const doubledQuickInfo = new Attachment('Quick Info', [new Field('Count', 1, true), new Field('Latest Id', 'quick/14139', true)]);
           const doubledCrypticInfo = new Attachment('Cryptic Info', [new Field('Count', 1, true), new Field('Latest Id', 'cryptic/26671', true)]);
           const attachments = [doubledDbInfo, doubledQuickInfo, doubledCrypticInfo];
           const expected = new Response('ephemeral', 'DB Admin Info', attachments);

           // When
           let resultPromise = Crossword.info();

           // Then
           resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
       });
    });

    describe('add', () => {
        it('should add a single extra crossword of each type to the database', (done) => {
            // Given
            const doubledQuickAdds = new Attachment('Quick Adds', [new Field('Id', 'quick/14140', true)]);
            const doubledCrypticAdds = new Attachment('Cryptic Adds', [new Field('Id', 'cryptic/26672', true)]);
            const attachments = [doubledQuickAdds, doubledCrypticAdds];
            const expected = new Response('ephemeral', 'Successfully added', attachments);

            // When
            let resultPromise = Crossword.add();

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });

        xit('should add multiple crosswords of each type to the database', (done) => {
            // Given
            const doubledQuickAdds = new Attachment('Quick Adds', [new Field('Id', 'quick/14141', true)]);
            const doubledCrypticAdds = new Attachment('Cryptic Adds', [new Field('Id', 'cryptic/26673', true)]);
            const attachments = [doubledQuickAdds, doubledCrypticAdds];
            const expected = new Response('ephemeral', 'Successfully added', attachments);

            // When
            let resultPromise = Crossword.add(2);

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });

    describe('answer', () => {
        it('should return the answer given a clue id', (done) => {
            // Given
            const clue = new Field('Clue', 'Sore head from booze, drunk and awake — what now? (5,2)');
            const answerType = new Field('Type', 'cryptic', true);
            const answerId = new Field('Id', 'C266711A1', true);
            const answerInfo = new Attachment('Answer Info', [clue, answerType, answerId]);
            const attachments = [answerInfo];

            const expected = new Response('ephemeral', 'SOBERUP', attachments);

            // When
            let resultPromise = Crossword.answer('C266711A1');

            // Then
            resultPromise
                .then(result => { expect(result).toEqual(expected); done(); });
        });
    });
});

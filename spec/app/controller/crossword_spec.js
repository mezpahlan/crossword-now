'use strict';

var proxyquire = require('proxyquire');
var Response = require('../../../model/slack/response');
var Field = require('../../../model/slack/field');
var Attachment = require('../../../model/slack/attachment');
var databaseStub = require('../../../test/doubles/model/database');
var Crossword = proxyquire('../../../controller/crossword', {'../model/database': databaseStub });

describe('Crossword', () => {

    describe('invalidOption', () => {
        it('should return usage instructions', (done) => {
            // Given
            const expected = new Response('ephemeral', 'Valid options are `quick` for a quick crossword, ' +
                             '`cryptic` for a cryptic crossword or leave blank for a quick crossword. ' +
                             'For an answer type `answer/<clue id>`.');

            // When
            let resultPromise = Crossword.invalidOption();

            // Then
            resultPromise
                .then(result => expect(result).toEqual(expected))
                .finally(() => done());
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
                .then(result => expect(result).toEqual(expected))
                .finally(() => done());
        });
    });
});

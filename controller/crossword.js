'use strict';

var Bluebird = require('bluebird');
var database = require('../model/database');
var Field = require('../model/slack/field');
var Attachment = require('../model/slack/attachment');
var Response = require('../model/slack/response');
let website = require('../api/guardian');
var helpers = require('./helpers');

var _typeDetails = function (filteredResponse) {
    let count = filteredResponse.rows.length;
    let latest = filteredResponse.rows[count - 1] || { id: 'N/A' };

    return { count: count, latestId: latest.id};
};

var invalidOption = function () {
    return new Bluebird(function(resolve, reject) {
        let response = new Response('ephemeral', 'Valid options are `quick` for a quick crossword, ' +
                                '`cryptic` for a cryptic crossword or leave blank for a quick crossword. ' +
                                'For an answer type `answer/<clue id>`.');
        resolve(response);
    });
};

var now = function (type) {
    let clue = database.getClue(type)
                       .then(clue => {
                           let id = helpers.hashCrosswordId(clue.parentId).concat(helpers.hashClueId(clue.id));
                           let clueType = new Field('Type', type, true);
                           let clueId = new Field('Id', id, true);
                           let clueInfo = new Attachment('Clue Info', [clueType, clueId]);

                           let attachments = [clueInfo];

                           return new Response('in_channel', clue.clue, attachments);
                       });
    return clue;
};

var info = function () {
    let info = database.dbInfo()
                       .then(values => {
                         let count = values[0].doc_count;
                         let dbCount = new Field('Count', count, true);
                         let dbInfo = new Attachment('DB Info', [dbCount]);

                         let quickDetails = _typeDetails(values[1]);
                         let quickCount = new Field('Count', quickDetails.count, true);
                         let quickLatestId = new Field('Latest Id', quickDetails.latestId, true);
                         let quickInfo = new Attachment('Quick Info', [quickCount, quickLatestId]);

                         let crypticDetails = _typeDetails(values[2]);
                         let crypticCount = new Field('Count', crypticDetails.count, true);
                         let crypticLatestId = new Field('Latest Id', crypticDetails.latestId, true);
                         let crypticInfo = new Attachment('Cryptic Info', [crypticCount, crypticLatestId]);

                         let attachments = [dbInfo, quickInfo, crypticInfo];

                         return new Response('ephemeral', 'DB Admin Info', attachments);
                     })
                     .catch(err => console.log(err));
    return info;
};

var add = function (additional) {
    additional = additional || 1;

    let addQuick = database.filterByType('quick')
                           .then(response => {
                                                let details = _typeDetails(response);
                                                let lastId = details.latestId;

                                                // Start from 24 June 1999 if empty DB
                                                lastId = lastId === 'N/A' ? 'quick/9093': lastId;

                                                return helpers.nextId(lastId);
                                             })
                           .then(newId => website.scrape(newId))
                           .then(doc => database.insert(doc, doc.id));

    let addCryptic = database.filterByType('cryptic')
                           .then(response => {
                                                let details = _typeDetails(response);
                                                let lastId = details.latestId;

                                                // Start from 24 June 1999 if empty DB
                                                lastId = lastId === 'N/A' ? 'cryptic/21620' : lastId;

                                                return helpers.nextId(lastId);
                                             })
                           .then(newId => website.scrape(newId))
                           .then(doc => database.insert(doc, doc.id));

    return Bluebird.all([addQuick, addCryptic])
                  .then(values => {
                                    let quickAdd1 = new Field('Id', values[0].id, true);
                                    let quickAdds = new Attachment('Quick Adds', [quickAdd1]);

                                    let crypticAdd1 = new Field('Id', values[1].id, true);
                                    let crypticAdds = new Attachment('Cryptic Adds', [crypticAdd1]);

                                    let attachments = [quickAdds, crypticAdds];

                                    return new Response('ephemeral', 'Successfully added', attachments);
                                  })
                  .catch(err => console.log(err));
};

var answer = function (text) {
    let clueId = /\/(.+)/.exec(text)[1];
    let clueInfo = helpers.unHash(clueId);
    // TODO: Error scenarios
    // TODO: 1) Can't unhash in anyway (crossword, id, type). Handle this in the unhash and send error back
    // TODO: 2) Can unhash but crossword doesn't exist.
    // TODO: 3) Can unhash but clue doesn't exist.
    // TODO: Will we get the same error response back from 2) and 3)?? If so, good.

    // Call the DB for the answer
    let answer = database.getAnswer(clueInfo.crossword, clueInfo.clue)
                         .then(answer => {
                                let clue = new Field('Clue', answer.clue);
                                let answerType = new Field('Type', clueInfo.type, true);
                                let answerId = new Field('Id', clueId, true);
                                let answerInfo = new Attachment('Answer Info', [clue, answerType, answerId]);

                                let attachments = [answerInfo];

                                return new Response('ephemeral', answer.solution, attachments);
                             })
                         .catch(error => console.log('ERROR BLOCK\n' + JSON.parse(error)));
    return answer;
};

module.exports = {invalidOption, now, info, add, answer};

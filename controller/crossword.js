'use strict';

var Promise = require('bluebird');
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
    return new Promise(function(resolve, reject) {
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

    return Promise.all([addQuick, addCryptic])
                  .then(values => {
                                    let quickAdd1 = new Field('Quick', values[0].id, true);
                                    let quickAdds = new Attachment('Cryptic Adds', [quickAdd1]);

                                    let crypticAdd1 = new Field('Id', values[1].id, true);
                                    let crypticAdds = new Attachment('Cryptic Adds', [crypticAdd1]);

                                    let attachments = [quickAdds, crypticAdds];

                                    return new Response('ephemeral', 'Successfully added', attachments);
                                  })
                  .catch(err => console.log(err));
};

var answer = function (text) {
    let clueId = /\/(.+)/.exec(text)[1];
    return new Promise(function(resolve, reject) {
        let response = new Response('ephemeral', clueId);

        resolve(response);
    });
};

module.exports = {invalidOption, now, info, add, answer};

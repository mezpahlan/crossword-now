'use strict';

var PouchDB = require('pouchdb');
var Bluebird = require('bluebird');
var Helper = require('../controller/helpers.js');
var appEnv = Helper.getAppEnv();
var couchUri = appEnv.getServiceURL('crossword-cloudant').concat('crosswords');
var localDb = new PouchDB('crosswords');
var remoteDb = new PouchDB(couchUri);

//
// Private functions
//
var _randomCrosswordId = function (col) {
    let randomIndex = Helper.randomInteger(col.length);
    return col[randomIndex].id;
};

var _getCrossword = function (crosswordId) {
    return localDb.get(crosswordId);
};

var _randomClue = function (doc) {
    var randomIndex = Helper.randomInteger(doc.entries.length);
    return doc.entries[randomIndex];
};

var _clue = function (doc, id) {
    let index = doc.entries.map(x => x.id).indexOf(id);
    return doc.entries[index];
};

//
// Public functions
//
var filterByType = function (type) {
    return localDb.allDocs({startkey: type, endkey: type.concat('\uffff')});
};

var dbInfo = function () {
    return Bluebird.all([localDb.info(), filterByType('quick'), filterByType('cryptic')]);
};

var getClue = function (type) {
    let idx;
    return filterByType(type)
                .then(response => _randomCrosswordId(response.rows))
                .then(crosswordId => {
                    idx = crosswordId;
                    return _getCrossword(crosswordId);
                })
                .then(doc => {
                    let clue = _randomClue(doc);
                    clue.parentId = idx;
                    return clue;
                })
                .catch(err => console.log(err));
};

var getAnswer = function (crossword, id) {
    return _getCrossword(crossword)
                .then(doc => _clue(doc, id))
                .catch(error => console.log(error));
};

var insert = function (doc, id) {
  return localDb.put(doc, id);
};

var init = function () {
    return new Bluebird(function (resolve, reject) {
        localDb.replicate.from(remoteDb)
                .then(result => {
                                    localDb.changes({ since: 'now', live: true, include_docs: true })
                                           .on('change', change => replicate());
                                    resolve(result);
                                })
                .catch(error => reject(error));
    });
};

var replicate = function () {
    return new Bluebird(function (resolve, reject) {
        localDb.replicate.to(remoteDb)
                .then(result => resolve(result))
                .catch(error => reject(error));
    });
};

module.exports = {getClue, getAnswer, dbInfo, filterByType, insert, init, replicate};

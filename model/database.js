'use strict';

var PouchDB = require('pouchdb');
var db = new PouchDB('crosswords');
var Promise = require('bluebird');
var Helper = require('../controller/helpers.js');

//
// Private functions
//
var _randomCrosswordId = function (col) {
    let randomIndex = Helper.random(col.length);
    return col[randomIndex].id;
};

var _getCrossword = function (crosswordId) {
    return db.get(crosswordId);
};

var _randomClue = function (doc) {
    var randomIndex = Helper.random(doc.entries.length);
    return doc.entries[randomIndex];
};

//
// Public functions
//
var filterByType = function (type) {
    return db.allDocs({startkey: type, endkey: type.concat('\uffff')});
};

var dbInfo = function () {
    return Promise.all([db.info(), filterByType('quick'), filterByType('cryptic')]);
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

var insert = function (doc, id) {
  return db.put(doc, id);
};

module.exports = {getClue, dbInfo, filterByType, insert};

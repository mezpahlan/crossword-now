'use strict';

var PouchDB = require('pouchdb');
var Bluebird = require('bluebird');
var Helper = require('../controller/helpers.js');
var appEnv = Helper.getAppEnv();
var couchUri = appEnv.getServiceURL('crossword-cloudant').concat('crosswords');
var localDb = new PouchDB('crosswords');
var remoteDb = new PouchDB(couchUri);

class Database {

    static filterByType (type) {
        return localDb.allDocs({startkey: type, endkey: type.concat('\uffff')});
    }

    static dbInfo () {
        return Bluebird.all([localDb.info(), this.filterByType('quick'), this.filterByType('cryptic')]);
    }

    static getClue (type) {
        let idx;
        return this.filterByType(type)
                    .then(response => this._randomCrosswordId(response.rows))
                    .then(crosswordId => {
                        idx = crosswordId;
                        return this._getCrossword(crosswordId);
                    })
                    .then(doc => {
                        let clue = this._randomClue(doc);
                        clue.parentId = idx;
                        return clue;
                    })
                    .catch(err => console.log(err));
    }

    static getAnswer (crossword, id) {
        return this._getCrossword(crossword)
                    .then(doc => this._clue(doc, id))
                    .catch(error => console.log(error));
    }

    static insert (doc, id) {
      return localDb.put(doc, id);
    }

    static init () {
        return new Bluebird(function (resolve, reject) {
            localDb.replicate.from(remoteDb)
                    .then(result => {
                                        localDb.changes({ since: 'now', live: true, include_docs: true })
                                               .on('change', change => this.replicate());
                                        resolve(result);
                                    })
                    .catch(error => reject(error));
        });
    }

    static replicate () {
        return new Bluebird(function (resolve, reject) {
            localDb.replicate.to(remoteDb)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
        });
    }

    static _randomCrosswordId (col) {
        let randomIndex = Helper.randomInteger(col.length);
        return col[randomIndex].id;
    }

    static _getCrossword (crosswordId) {
        return localDb.get(crosswordId);
    }

    static _randomClue (doc) {
        var randomIndex = Helper.randomInteger(doc.entries.length);
        return doc.entries[randomIndex];
    }

    static _clue (doc, id) {
        let index = doc.entries.map(x => x.id).indexOf(id);
        return doc.entries[index];
    }
}

module.exports = Database;

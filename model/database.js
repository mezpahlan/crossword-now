'use strict';

var PouchDB = require('pouchdb');
var Bluebird = require('bluebird');
var Helper = require('../controller/helpers.js');
var appEnv = Helper.getAppEnv();
var couchUri = appEnv.getServiceURL('crossword-cloudant').concat('crosswords');
var localDb = new PouchDB('crosswords');
var remoteDb = new PouchDB(couchUri);

/**
 * Methods for interacting with the local database (PouchDB) and remote database (CouchDB)
 */
class Database {

    /**
     * Returns an array of crossword information given a type
     *
     * @param {string} type The type of crossword to fetch
     * @returns {Promise} Array of crossword information
     */
    static filterByType (type) {
        return localDb.allDocs({startkey: type, endkey: type.concat('\uffff')});
    }

    /**
     * Returns information about the current state of the database
     *
     * @returns {Promise} Array database information, quick information, cryptic information
     */
    static dbInfo () {
        return Bluebird.all([localDb.info(), this.filterByType('quick'), this.filterByType('cryptic')]);
    }

    /**
     * Returns a randomd clue given a type of crossword
     *
     * @param {string} type The type of crossword
     * @returns {Promise} Random clue
     */
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

    /**
     * Returns an answer given a crossword and a clue id
     *
     * @param {string} crossword The id of the crossword to fetch
     * @param {string} id The clue id from the crossword
     * @returns {Promise} Requested clue
     */
    static getAnswer (crossword, id) {
        return this._getCrossword(crossword)
                    .then(doc => this._clue(doc, id))
                    .catch(error => console.log(error));
    }

    /**
     * Inserts a crossword document into the local database
     *
     * @param {crossword} doc A crossword
     * @param {string} id The document id
     * @returns {Promise} Result message of the operation
     */
    static insert (doc, id) {
      return localDb.put(doc, id);
    }

    /**
     * Initialises the database. Only to be used at start up
     *
     * @returns {Promise} Result message of the operation
     */
    static init () {
        const me = this;
        return new Bluebird(function (resolve, reject) {
            localDb.replicate.from(remoteDb)
                   .then(result => {
                                       localDb.changes({ since: 'now', live: true, include_docs: true })
                                              .on('change', change => me.replicate());
                                       resolve(result);
                                   })
                   .catch(error => reject(error));
        });
    }

    /**
     * Replicates the local database to the remote database
     *
     * @returns {Promise} Result message of the operation
     */
    static replicate () {
        return new Bluebird(function (resolve, reject) {
            localDb.replicate.to(remoteDb)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
        });
    }

    /**
     * Returns a random crossword id from the database
     *
     * @private
     * @param {array} crosswordCollection A collection of crosswords from the database
     * @returns {string} The id for the randomly selected crossword
     */
    static _randomCrosswordId (crosswordCollection) {
        let randomIndex = Helper.randomInteger(crosswordCollection.length);
        return crosswordCollection[randomIndex].id;
    }

    /**
     * Fetches a given crossword from the database
     *
     * @private
     * @param {string} crosswordId Id of crossword to be fetched
     * @returns {crossword} The given crossword
     */
    static _getCrossword (crosswordId) {
        return localDb.get(crosswordId);
    }

    /**
     * Returns a random clue given a document representing a crossword
     *
     * @private
     * @param {crossword} doc A crossword containing clues
     * @returns {clue} A random clue from the input crossword
     */
    static _randomClue (doc) {
        var randomIndex = Helper.randomInteger(doc.entries.length);
        return doc.entries[randomIndex];
    }

    /**
     * Returns a specific clue from a specific crossword
     *
     * @private
     * @param {crossword} doc A crossword containing clues
     * @returns {clue} A random clue from the input crossword
     */
    static _clue (doc, id) {
        let index = doc.entries.map(x => x.id).indexOf(id);
        return doc.entries[index];
    }
}

module.exports = Database;

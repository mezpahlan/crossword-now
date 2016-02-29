'use strict';

var Bluebird = require('bluebird');

function allDocsDouble (options) {
    const cryptic = { offset: 0, total_rows: 1, rows: [{ id: 'cryptic/26671', key: 'cryptic/26671', value: { rev: 'fake-revision' }}]};
    const quick = { offset: 0, total_rows: 1, rows: [{ id: 'quick/14139', key: 'quick/14139', value: { rev: 'fake-revision' }}]};

    switch (options.startkey) {
        case 'cryptic':
            return Bluebird.resolve(cryptic);
        case 'quick':
            return Bluebird.resolve(quick);
        default:
            throw new RangeError('Testing error. Case needs to be defined');
    }
}

function infoDouble () {
    return Bluebird.resolve({ db_name: 'dbDouble', doc_count: 2, update_seq: 3 });
}

function PouchDBDouble () {
    this.allDocs = allDocsDouble;
    this.info = infoDouble;
}

module.exports = PouchDBDouble;

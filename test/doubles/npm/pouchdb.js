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

function PouchDBDouble () {
    this.allDocs = allDocsDouble;
}

module.exports = PouchDBDouble;

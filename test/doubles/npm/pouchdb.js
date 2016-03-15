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

function getDouble (crosswordId) {
    let crossword;

    switch (crosswordId) {
        case 'cryptic/26671':
           crossword = require('../../data/cryptic.26671.json');
            break;
        case 'quick/14139':
            crossword = require('../../data/quick.14139.json');
            break;
        default:
           throw new RangeError('Testing error. Case needs to be defined');
    }

    crossword._id = crosswordId;
    crossword._rev = 'fake-revision';

    return Bluebird.resolve(crossword);
}

function putDouble (doc, docId) {
    return Bluebird.resolve({ ok: true, id: docId, rev: 'fake-revision' });
}

// TODO: The from and to Doubles are the same. I know this is ok for tests but is
// there a more accurate way to do this?
function fromDouble () {
    const success = {
                      doc_write_failures: 0,
                      docs_read: 2,
                      docs_written: 2,
                      end_time: 'fake-timestamp',
                      errors: [],
                      last_seq: 2,
                      ok: true,
                      start_time: 'fake-timestamp',
                      status: 'complete'
                    };

    return Bluebird.resolve(success);
}

function toDouble () {
    const success = {
                      doc_write_failures: 0,
                      docs_read: 2,
                      docs_written: 2,
                      end_time: 'fake-timestamp',
                      errors: [],
                      last_seq: 2,
                      ok: true,
                      start_time: 'fake-timestamp',
                      status: 'complete'
                    };

    return Bluebird.resolve(success);
}

function changesDouble () {
    return { on: onDouble };
}

function onDouble () {
    // Do nothing for now
}

function PouchDBDouble () {
    this.allDocs = allDocsDouble;
    this.info = infoDouble;
    this.get = getDouble;
    this.put = putDouble;
    this.replicate = { from: fromDouble, to: toDouble };
    this.changes = changesDouble;
}

module.exports = PouchDBDouble;

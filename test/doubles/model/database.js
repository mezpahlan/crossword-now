'use strict';

var Bluebird = require('bluebird');

function getClueDouble () {
    const clue = {
                    parentId: 'cryptic/26671',
                    id: '4-down',
                    number: 4,
                    humanNumber: '4, 22',
                    clue: ' Post-it notes discussion? (6,4)',
                    direction: 'down',
                    length: 6,
                    group: ['4-down', '22-down'],
                    position: { 'x': 6, 'y': 0 },
                    separatorLocations: { ',': [6] },
                    solution: 'PILLOW'
                 };

    return Bluebird.resolve(clue);
}

function dbInfoDouble () {
    const info = [
                    { doc_count: 2 },
                    { rows: [ { id: 'quick/14139' } ] },
                    { rows: [ { id: 'cryptic/26671' } ] }
                 ];

    return Bluebird.resolve(info);

}

function filterByTypeDouble (type) {
    switch (type) {
        case 'quick':
            return Bluebird.resolve({ rows: [ { id: 'quick/14139' } ] });
        case 'cryptic':
           return Bluebird.resolve({ rows: [ { id: 'cryptic/26671' } ] });
        default:
            throw new RangeError('Invalid type. Must be one of quick or cryptic');
    }
}

function insertDouble (doc, id) {
    return Bluebird.resolve({ ok: true, id: id, rev: 'fake_revision' });
}

function getAnswerDouble (crossword, clueId) {
    // TODO: Maybe drive this via the already saved JSON file using a requires?
    return Bluebird.resolve({
        id: '1-across',
        number: 1,
        humanNumber: '1',
        clue: 'Sore head from booze, drunk and awake — what now? (5,2)',
        direction: 'across',
        length: 7,
        group: ['1-across'],
        position: {
            x: 0,
            y: 0
        },
        separatorLocations: {
            ',': [5]
        },
        solution: 'SOBERUP'
    });
}

module.exports = { getClue: getClueDouble, dbInfo: dbInfoDouble, filterByType: filterByTypeDouble, insert: insertDouble, getAnswer: getAnswerDouble};

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

module.exports = { getClue: getClueDouble };

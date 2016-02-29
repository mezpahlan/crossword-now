'use strict';

function nextIdDouble (id) {
    switch (id) {
        case 'quick/14139':
            return 'quick/14140';
        case 'cryptic/26669':
            return 'cryptic/26670';
        case 'cryptic/26671':
            return 'cryptic/26672';
        case 'cryptic/26672':
            return 'cryptic/26673';
        default:
            throw new RangeError('Testing error. Case needs to be defined');
    }
}

function unHashDouble (clueId) {
    switch (clueId) {
        case 'C266711A1':
            return { crossword: 'cryptic/26672', clue: '1-across', type: 'cryptic' };
        default:
            throw new RangeError('Testing error. Case needs to be defined');
    }
}

function randomIntegerDouble (size) {
    return size - 1; // Always return the last element in the collection given a size
}

module.exports = { nextId: nextIdDouble, unHash: unHashDouble, randomInteger: randomIntegerDouble };

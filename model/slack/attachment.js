'use strict';

class Attachment {
    constructor (title, fields) {
        let fallback = title + (!fields || fields.length === 0 ? '' : ' - ' + fields.reduce(this._constructFallback, ''));

        this.title = title;
        this.color = '#000';
        this.fields = fields;
        this.fallback =  fallback;
    }

    _constructFallback (prev, curr, index, array) {
        prev += curr.title + ': ' + curr.value + ', ';
        return (index === array.length - 1) ? prev.slice(0, -2) : prev;
    }
}

module.exports = Attachment;

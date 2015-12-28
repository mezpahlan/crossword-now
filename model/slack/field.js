'use strict';

class Field {
    constructor (title, value, short) {
        this.title = title;
        this.value = value;
        this.short = short || false;
    }
}

module.exports = Field;

'use strict';

/**
 * A Field is added to an {@link Attachment} and represents a single piece of ancillary information.
 */
class Field {
    /**
     * Instantiate a new Field.
     *
     * @param {string} title - The title for the field
     * @param {string} value - The value for the field. Treat as KVP with {@link Field.title}.
     * @param {boolean} [short = false] - Indicates whether this Field can be considered for shortening by Slack.
     */
    constructor (title, value, short) {
        this.title = title;
        this.value = value;
        this.short = short || false;
    }
}

module.exports = Field;

'use strict';

/**
 * An Attachment is an optional extra to the response sent back to Slack.
 * It should contain enriching information to the main response text.
 */
class Attachment {
    /**
     * Instantiate a new Attachment.
     *
     * @param {string} title - The title of the attachment.
     * @param {array} fields - Array of [Fields]{@link Field}.
     */
    constructor (title, fields) {
        let fallback = title + (!fields || fields.length === 0 ? '' : ' - ' + fields.reduce(this._constructFallback, ''));

        this.title = title;
        this.color = '#000';
        this.fields = fields;
        this.fallback =  fallback;
    }

    /**
     * Creates a single lined fallback text for readers that cannot display Fields.
     *
     * @param {string} prev - The value previously returned in the last invocation of the callback, or initialValue, if supplied.
     * @param {string} curr - The current element being processed in the array.
     * @param {number} index - The index of the current element being processed in the array.
     * @param {array} array - The array [reduce]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce} was called upon.
     * @return {string} The fallback text.
     */
    _constructFallback (prev, curr, index, array) {
        prev += curr.title + ': ' + curr.value + ', ';
        return (index === array.length - 1) ? prev.slice(0, -2) : prev;
    }
}

module.exports = Attachment;

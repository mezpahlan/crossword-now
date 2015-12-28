'use strict';

class Response {
    constructor (responseType, text, attachments) {
        // Response can be ephemeral or in_channel
        this.response_type = responseType;
        this.text = text;
        this.attachments = attachments;

    }
}

module.exports = Response;

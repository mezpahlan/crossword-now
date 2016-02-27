'use strict';

var express = require('express');
var crossword = require('../controller/crossword');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.urlencoded({
    extended: false
}));

// Routing
router.post('/', function (req, res) {
    var text = req.body.text || 'invalidOption';

    switch (text) {
        case 'admin/info':
            crossword.info()
                     .then(response => res.send(response));
            break;
        case 'admin/add':
            crossword.add()
                     .then(response => res.send(response));
            break;
        case (text.match(/^answer\/./) || {}).input:
            // Help me Hacky-Wan Kenobi... you're my only hope!
            const clueId = /^answer\/(.+)/.exec(text)[1];
            crossword.answer(clueId)
                     .then(response => res.send(response));
            break;
        case 'cryptic':
            crossword.now('cryptic')
                     .then(response => res.send(response));
            break;
        case 'quick':
        case '':
            crossword.now('quick')
                     .then(response => res.send(response));
            break;
        default:
            crossword.invalidOption()
                     .then(response => res.send(response));
    }
});

module.exports = router;

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
    var text = req.body.text;
    res.end();

    switch (text) {
        case 'cryptic':
            return crossword('cryptic');
        case 'quick':
        case '':
            return crossword('quick');
        default:
            return res.json({
                text: 'Valid options are `quick` for a quick crossword, `cryptic` for a cryptic crossword or leave blank for a quick crossword.'
            });
    }
});

module.exports = router;

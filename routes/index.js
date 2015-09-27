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
        case 'easy':
        case '':
            return crossword('easy');
        default:
            return res.json({
                text: 'Valid options are `easy` for an easy crossword, `cryptic` for a cryptic crossword or leave blank for an easy crossword.'
            });
    }
});

module.exports = router;

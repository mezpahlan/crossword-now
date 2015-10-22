'use strict';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var helpers = require('../controller/helpers');
var url = process.env.MONGODB_URL;

exports.getEntry = function (crossword, callback) {
    var index = helpers.random(crossword.entries.length);
    var entry = crossword.entries[index];
    callback(entry, crossword.number);
};

exports.getCrossword = function (xwordType, callback) {

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection('crosswords');

        var cursor = collection.find({crosswordType: xwordType});

        cursor.count().then(function (count) {
            var random = helpers.random(count);

            cursor.skip(random).limit(1).toArray().then(function (documents) {
                db.close();
                callback(documents[0]);
            });
        });
    });
};

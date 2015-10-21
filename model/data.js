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

        collection.find({crosswordType: xwordType}).count().then(function (count) {
            var random = helpers.random(count);

            var cursor = collection.find({crosswordType: xwordType}).limit(1).skip(random);

            cursor.toArray().then(function (documents) {
                db.close();
                callback(documents[0]);
            });
        });
    });
};

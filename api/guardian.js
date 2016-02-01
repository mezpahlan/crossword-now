'use strict';

var rp = require('request-promise');
var cheerio = require('cheerio');
var Helper = require('../controller/helpers');

/**
 * Methods for accessing crosswords provided by The Guardian.
 */
class Guardian {
    /**
     * Scrapes the website for crossword data.
     *
     * @param {string} id - The unique crossword identification.
     * @returns {Promise} - Resolves with a JSON document representing the crossword or rejects with a retry of the next available id.
     */
    static scrape (id) {

        const BASE_URL = 'http://www.theguardian.com/crosswords/';

        return rp(BASE_URL.concat(id))
                .then(html   => {
                    let $ = cheerio.load(html);
                    let crosswordData = $('.js-crossword').attr('data-crossword-data');

                    return JSON.parse(crosswordData);
                })
                .catch(err => {
                                  return Helper.nextId(id)
                                        .then(nextId => {
                                                            return Guardian.scrape(nextId);
                                                        });
                              });
    }
}

module.exports = Guardian;

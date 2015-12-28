'use strict';

var rp = require('request-promise');
var cheerio = require('cheerio');
var Helper = require('../controller/helpers');

class Guardian {
    constructor () {}

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

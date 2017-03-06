
"use strict";

const Alexa = require('alexa-sdk');
const xml2js = require('xml2js');
const request = require('sync-request');
const Article = require('./article');
const Words = require('./word');

const urls = ['http://www.wsj.com/xml/rss/3_7085.xml',
// 'http://rssfeeds.usatoday.com/usatoday-NewsTopStories',
// 'http://feeds.chron.com/houstonchronicle/topheadlines',
// 'http://online.wsj.com/xml/rss/3_7198.xml',
// 'http://www.sfgate.com/rss/collectionRss/News-Category-RSS-Feeds-14708.php',
'http://feeds.cbsnews.com/CBSNewsMain?format=xml'
];

exports.handler = function(event, context, callback) {
  // context.callbackWaitsForEmptyEventLoop = false;
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'NewSession': function() {
    this.emit(':ask', '<speak>Welcome to super hot.</speak>');
  },
  'SuperHotKeywordIntent': function() {

  },
  'SuperHotArticleIntent': function() {

  }
};
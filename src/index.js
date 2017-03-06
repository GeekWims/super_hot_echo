
"use strict";

const Alexa = require('alexa-sdk');
const xml2js = require('xml2js');
const request = require('sync-request');
const Article = require('./article');
const Words = require('./word');

const urls = ['http://www.wsj.com/xml/rss/3_7085.xml',
'http://rssfeeds.usatoday.com/usatoday-NewsTopStories',
'http://feeds.chron.com/houstonchronicle/topheadlines',
'http://online.wsj.com/xml/rss/3_7198.xml',
'http://www.sfgate.com/rss/collectionRss/News-Category-RSS-Feeds-14708.php',
'http://feeds.cbsnews.com/CBSNewsMain?format=xml'
];

var parser = new xml2js.Parser();
var words = new Words.Words();
var articles = [];
var top = null;

exports.handler = function(event, context, callback) {
  // context.callbackWaitsForEmptyEventLoop = false;
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'SuperHotKeywordIntent': function() {
    var top_n_number = parseInt(this.event.request.intent.slots.number.value);

    if (!top_n_number) {
      top_n_number = 5;
    }

    for (var i in urls) {
      var url = urls[i];
      var response = request('GET', url);

      parser.parseString(response.body, function(err, result) {
        for (var i in result.rss.channel[0].item) {
          var item = result.rss.channel[0].item[i];
          var article = new Article.Article();
          article.setupFormItem(item);
          articles.push(article);
          words.parseArticle(article);
        }
      });

      top = words.getTopN(top_n_number);

      var output = "<speak>";
      for (var i in top) {
        output += top[i].word + "<break time='3ms'/>";
      }
      output += " Which number do you want?</speak>";

      this.emit(':tell', output);
      // this.emit(':ask', output, 'Can you say again?');
  },
  'SuperHotArticleIntent': function() {

  },
  'AMAZON.HelpIntent': function() {
    var message = 'I will help you.';
    this.emit(':tell', message);
  },
  'AMAZON.YesIntent': function() {
    this.emit(':tell', 'Yes.');
  },
  'AMAZON.NoIntent': function() {
    console.log("NOINTENT");
    this.emit(':tell', 'Ok, see you next time!');
  },
  "AMAZON.StopIntent": function() {
    console.log("STOPINTENT");
    this.emit(':tell', "Goodbye!");
  },
  "AMAZON.CancelIntent": function() {
    console.log("CANCELINTENT");
    this.emit(':tell', "Goodbye!");
  },
  'SessionEndedRequest': function () {
    console.log("SESSIONENDEDREQUEST");
    //this.attributes['endedSessionCount'] += 1;
    this.emit(':tell', "Goodbye!");
  },
  'Unhandled': function() {
    console.log("UNHANDLED");
    this.emit(':tell', 'unhandled exception');
  }
};
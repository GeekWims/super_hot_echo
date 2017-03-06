
"use strict";

const Alexa = require('alexa-sdk');
// const xml2js = require('xml2js');
// const request = require('sync-request');
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
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'HelloWorldIntent': function () {
    this.emit(':tell', 'Parsing news articles');

    var url = 'http://www.wsj.com/xml/rss/3_7085.xml';
    var parser = new xml2js.Parser();
    var reponse = request('POST', url);
    var articles = [];

    parser.parseString(reponse.body, function(err, result) {
      for (var i in result.rss.channel[0].item) {
        var item = result.rss.channel[0].item[i];
        var article = new Article.Article();
        article.setupFormItem(item);
        articles.push(article);
        // words.parseArticle(article);
      }
    });

    var top = words.getTopN(10)[0];

    this.emit(':tell', 'Completed!');
    // this.emit(':tell', top.word + " is hottest keyword");
    this.emit(':tell', 'and this is related articles');

    for (var i in articles) {
      var article = articles[i];
      this.emit(':tell', article.title);
    }
  },
  'StartIntent' : function() {
    // this.emit(':tell', 'Getting data from server');
    this.emit('GetDataIntent');
  },
  'GetDataIntent': function() {
    var request = require('sync-request');
    var responses = [];

    for (var i in urls) {
      responses.push(request('GET', url));
    }

    this.attributes['responses'] = responses;
    this.emit(':tell', 'gotcha');
    this.emit(':saveState', true);
  },
  'XMLParsingIntent' : function () {
    var xml2js = require('xml2js');
    var parser = new xml2js.Parser();
    var articles = [];

    parser.parseString(reponse.body, function(err, result) {
      for (var i in result.rss.channel[0].item) {
        var item = result.rss.channel[0].item[i];
        var article = new Article.Article();
        article.setupFormItem(item);
        articles.push(article);
        // words.parseArticle(article);
      }
    });

    this.attributes['articles'] = articles;
    this.emit(':saveState', true);
  },
  'ArticleParsingIntent' : function () {
    var articles = this.attributes['articles'];
    var words = new Words.Words();

    for (var i in articles) {
      words.parseArticle(articles[i]);
    }

    this.attributes['words'] = words;
    this.emit(':saveState', true);
  },
  'TopNIntent' : function() {
    var words = this.attributes['words'];

    this.attributes['top_article'] = words.getTopN(10)[0];
    this.emit(':saveState', true);
  },
  'TellIntent' : function() {

    for (var i in articles) {
      var article = articles[i];
      this.emit(':tell', article.title);
    }

    this.emit(':tell', 'Parsing news articles');
  }
};
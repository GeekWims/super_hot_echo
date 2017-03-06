
"use strict";

const xml2js = require('xml2js');
const request = require('sync-request');
const Article = require('./article');
const Words = require('./word');

var urls = ['http://www.wsj.com/xml/rss/3_7085.xml',
              // 'http://rssfeeds.usatoday.com/usatoday-NewsTopStories',
              // 'http://feeds.chron.com/houstonchronicle/topheadlines',
              // 'http://online.wsj.com/xml/rss/3_7198.xml',
              // 'http://www.sfgate.com/rss/collectionRss/News-Category-RSS-Feeds-14708.php',
              'http://feeds.cbsnews.com/CBSNewsMain?format=xml'
            ];
var parser = new xml2js.Parser();
var words = new Words.Words();
var articles = [];

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
}

var top = words.getTopN(10)[0];

console.log("-----------------");
console.log(top.word);
for (var i in top.articles) {
  var article = top.articles[i];
  console.log(article.title);
}
console.log("---------------------");
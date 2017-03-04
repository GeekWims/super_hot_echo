
"use strict";

const xml2js = require('xml2js');
const request = require('sync-request');
const Article = require('./article');
const Words = require('./word');

var urls = ['http://www.wsj.com/xml/rss/3_7085.xml',
              'https://news.google.com/news?cf=all&ned=us&hl=en&topic=h&num=3&output=rss',
              // 'https://news.google.com/news?ned=us&hl=en&topic=po&output=rss',
              'https://news.google.com/news?ned=us&hl=en&topic=w&output=rss',
            ];
var parser = new xml2js.Parser();
var words = new Words.Words();

for (var i in urls) {
  var url = urls[i];
  var reponse = request('GET', url);

  parser.parseString(reponse.body, function(err, result) {
    for (var i in result.rss.channel[0].item) {
      var item = result.rss.channel[0].item[i];
      var article = new Article.Article();
      article.setupFormItem(item);
      words.parseArticle(article);
    }
  });
}

var top = words.getTopN(10)[0];

console.log("-----------------");
console.log(top.word);
console.log(top.articles);
console.log("---------------------");
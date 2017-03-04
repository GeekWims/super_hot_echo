
"use strict";

const http = require('http');
const request = require('request');
const Article = require('./article');
const Words = require('./word');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  var total_sentances = "";
  var words = new Words.Words();

  try {
    var xml2js = require('xml2js');
    var request = require('request');

    var url = 'http://www.wsj.com/xml/rss/3_7085.xml';
    var parser = new xml2js.Parser();
    request(url, function(error, response, body) {

      var articles = [];
      parser.parseString(body, function(err, result) {
        for (var i in result.rss.channel[0].item) {
          var item = result.rss.channel[0].item[i];
          var article = new Article.Article();
          article.setupFormItem(item);
          articles.push(article);
          words.parseArticle(article);
        }
      });

      console.log(words);
      res.end(JSON.stringify(articles));
    });
  } catch (ex) {
    console.log(ex);
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

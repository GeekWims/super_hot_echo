
"use strict";

const xml2js = require('xml2js');
const request = require('request');

functin parse(urls) {
  var total_sentances = "";
  var words = new Words.Words();

  for (var i in urls) {
    try {
      var url = urls[i];
      var parser = new xml2js.Parser();

      request(url, function(error, response, body) {
        parser.parseString(body, function(err, result) {
          for (var i in result.rss.channel[0].item) {
            var item = result.rss.channel[0].item[i];
            var article = new Article.Article();
            article.setupFormItem(item);
            words.parseArticle(article);
          }
        });

        var topN = words.getTopN(5);
        console.log(topN);
      });
    } catch (ex) {
      console.log(ex);
    }
  }
}

exports.RSSParser = {
  parse: parse
};
const http = require('http');
const request = require('request');
const Article = require('./article');
const Words = require('./word');
const Dictionary = require('./dictionary');

const hostname = '127.0.0.1';
const port = 3000;

const dict = new Dictionary.Dictionary("dic.txt");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  if(req.url === '/favicon.ico') {
      console.log('Favicon was requested');
      return;
  }

  var total_sentances = "";
  var words = new Words.Words();
  words.setDict(dict);

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

      var topN = words.getTopN(5);
      console.log(topN);
      res.end(JSON.stringify(topN));
    });
  } catch (ex) {
    console.log(ex);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

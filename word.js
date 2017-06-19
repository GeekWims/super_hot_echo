
"use strict";

var pos = require('pos');

class Word {
  constructor(word, article) {
    this.count = 1;
    this.word = word;
    this.articles = [];
    this.articles.push(article);
  }

  addArticle(article) {
    this.articles.push(article);
    this.count++;
  }
}

class Words {
  constructor() {
    this.list = new Map();
  }

  getWords(target_sentance) {

    var output = [];
    var words = new pos.Lexer().lex(target_sentance);
    var tagger = new pos.Tagger();
    var taggedWords = tagger.tag(words);

    for (var i in taggedWords) {
        var taggedWord = taggedWords[i];
        var word = taggedWord[0];
        var tag = taggedWord[1];

        if (tag == "NN" || tag == "NNP" || tag == "NNPS") {
          output.push(word);
        }
    }

    return output;
  }

  parseArticle(article) {
    var sentance = article.title.trim().replace(/(<([^>]+)>)/gi, "");;
    var words = this.getWords(sentance);

    for (var i in words) {
      var word = words[i];
      var hasOne = this.list.get(word);

      if (hasOne instanceof Word) {
        hasOne.addArticle(article);
      } else {
        this.list.set(word, new Word(word, article));
      }
    }
  }

  getTopN(number) {
    var tmpArr = [];

    // map을 array로 변환
    this.list.forEach(function(value, key, map) {
      tmpArr.push(value);
    });

    tmpArr.sort(function(a, b) {
      return b.count - a.count;
    });

    return tmpArr.slice(0, number);
  }
}

exports.Words = Words;

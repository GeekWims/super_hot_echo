
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
    this.dict = [];
  }

  setDict(dict) {
    this.dict = dict;
  }

  getWords(target_sentance) {
    const WHITESPACE = 0;
    const WORD = 1;
    const WORD_END = 2;

    var flag = WHITESPACE;
    var words = [];
    var aWord = "";

    // 마지막 단어를 검사하기 위해 공백을 추가해줌.
    target_sentance = target_sentance.concat(' ');
    for (var i = 0; i < target_sentance.length; i++) {
      var char = target_sentance.charAt(i);

      // 문자와 숫자인 확인한 후 경우에 맞는 flag를 설정
      if (('a' <= char && char <= 'z') || ('0' <= char && char <= '9')) {
        flag = WORD;
      } else {
        if (flag == WORD) flag = WORD_END;
        else flag = WHITESPACE;
      }

      // flag에 따른 작업.
      switch (flag) {
        case WHITESPACE:
          break;
        case WORD :
          aWord = aWord.concat(char);
          break;
        case WORD_END :
          if (aWord.length < 3 || this.dict.has(aWord)) {
            break;
          }
          words.push(aWord);
          aWord = "";
          break;
        default:
      }
    }

    return words;
  }

  parseArticle(article) {
    var sentance = article.description.trim();
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

    return tmpArr.slice(0, number - 1);
  }
}

exports.Words = Words;

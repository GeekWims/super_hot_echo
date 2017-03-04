const fs = require('fs');


class Dictionary {
  constructor(dict_file) {
    var text = fs.readFileSync(dict_file, 'utf8');
    this.dict = text.split(' ');
  }

  has(word) {
    return this.dict.includes(word);
  }
}

exports.Dictionary = Dictionary;

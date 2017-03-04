
class Article {
  constructor() {
    this.title = "";
    this.link = "";
    this.description = "";
  }

  setupFormItem(item) {
    this.title = item.title[0].toLowerCase();
    this.link = item.link[0];
    this.description = item.description[0].toLowerCase();;
  }
}

exports.Article = Article;

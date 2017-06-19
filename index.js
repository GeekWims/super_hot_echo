
"use strict";

const Alexa = require('alexa-sdk');
const xml2js = require('xml2js');
const request = require('sync-request');
const Article = require('./article');
const Words = require('./simpleWord');

const urls = ['http://www.wsj.com/xml/rss/3_7085.xml',
// 'http://rssfeeds.usatoday.com/usatoday-NewsTopStories',
// 'http://feeds.chron.com/houstonchronicle/topheadlines',
'http://online.wsj.com/xml/rss/3_7198.xml',
// 'http://www.sfgate.com/rss/collectionRss/News-Category-RSS-Feeds-14708.php',
'http://feeds.cbsnews.com/CBSNewsMain?format=xml'
];

var parser = new xml2js.Parser();
var words = new Words.Words();
var articles = [];
var top = null;
var states = {
  WORD_MODE: '_WORD_MODE',
  ARTICLE_MODE: '_ARTICLE_MODE'
}

var appId = 'amzn1.ask.skill.922be0b7-40cd-48d4-9998-4166f579cf12'; //'amzn1.echo-sdk-ams.app.your-skill-id';

exports.handler = function(event, context, callback) {
  // context.callbackWaitsForEmptyEventLoop = false;
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers, wordHandler, articleHandlers);
  alexa.appId = appId;
  alexa.execute();
};

var handlers = {
  'NewSession': function() {
    console.log(this.attributes);
    if(Object.keys(this.attributes).length === 0) {
      this.attributes['topWords'] = [];
      this.attributes['endedSessionCount'] = 0;
    }

    this.handler.state = states.WORD_MODE;
    this.emit(':ask', 'Welcome to super hot news');
  },
  'AMAZON.HelpIntent': function() {
    var message = 'I will help you.';
    this.emit(':tell', message);
  },
  'AMAZON.YesIntent': function() {
    this.emit(':tell', 'Yes.');
  },
  'AMAZON.NoIntent': function() {
    console.log("NOINTENT");
    this.emit(':tell', 'Ok, see you next time!');
  },
  "AMAZON.StopIntent": function() {
    console.log("STOPINTENT");
    this.emit(':tell', "Goodbye!");
  },
  "AMAZON.CancelIntent": function() {
    console.log("CANCELINTENT");
    this.emit(':tell', "Goodbye!");
  },
  'SessionEndedRequest': function () {
    console.log("SESSIONENDEDREQUEST");
    //this.attributes['endedSessionCount'] += 1;
    this.emit(':tell', "Goodbye!");
  },
  'Unhandled': function() {
    console.log("UNHANDLED");
    this.emit(':tell', 'unhandled exception');
  }
};

var wordHandler = Alexa.CreateStateHandler(states.WORD_MODE, {
  'NewSession': function () {
    this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },
  'SuperHotKeywordIntent': function() {
    console.log('In SuperHotKeywordIntent');
    var top_n_number = parseInt(this.event.request.intent.slots.number.value);
    console.log('Getted top_n_number' + top_n_number);

    if (!top_n_number) {
      top_n_number = 5;
    }

    console.log('Pass value check of top_n_number : ' + top_n_number);

    for (var i in urls) {
      var url = urls[i];
      var response = request('GET', url);

      parser.parseString(response.body, function(err, result) {
        if (result == null) {
          this.emit(":tell", "Can not read rss info");
          return;
        }

        for (var i in result.rss.channel[0].item) {
          var item = result.rss.channel[0].item[i];
          var article = new Article.Article();
          article.setupFormItem(item);
          articles.push(article);
          words.parseArticle(article);
        }
      });
    }

    console.log('Getting data is finished : ' + words);

    top = words.getTopN(top_n_number);

    console.log('Getting top N is finished : ' + JSON.stringify(top));

    this.attributes["topWords"] = top;

    console.log('Setting topWords is finished');

    var output = "";
    for (var i in top) {
      output += (parseInt(i) + 1) + ". " + top[i].word + "<break time='300ms'/>";
    }

    output += " Which number do you want?";

    console.log('Generating output is finished : ' + output);

    // this.emit(':tell', output);
    console.log('setting state will start' + this.handler.state);
    this.handler.state = states.ARTICLE_MODE;
    console.log('setting state is finished' + this.handler.state);

    console.log(this.handler.response);
    this.emit(':ask', output, 'Can you say again?');
    console.log(this.handler.response);
  },
  'AMAZON.HelpIntent': function() {
    var message = 'I will help you.';
    this.emit(':tell', message);
  },
  'AMAZON.YesIntent': function() {
    this.emit(':tell', 'Yes.');
  },
  'AMAZON.NoIntent': function() {
    console.log("NOINTENT");
    this.emit(':tell', 'Ok, see you next time!');
  },
  "AMAZON.StopIntent": function() {
    console.log("STOPINTENT");
    this.emit(':tell', "Goodbye!");
  },
  "AMAZON.CancelIntent": function() {
    console.log("CANCELINTENT");
    this.emit(':tell', "Goodbye!");
  },
  'SessionEndedRequest': function () {
    console.log("SESSIONENDEDREQUEST");
    //this.attributes['endedSessionCount'] += 1;
    this.emit(':tell', "Goodbye!");
  },
  'Unhandled': function() {
    console.log("UNHANDLED");
    this.emit(':tell', 'unhandled exception');
  }
});

var articleHandlers = Alexa.CreateStateHandler(states.ARTICLE_MODE, {
  'NewSession': function () {
  },
  'SuperHotArticleIntent': function() {
    var word_number = 0;
    var slots = this.event.request.intent.slots;

    if (slots && slots.word_number) {
      word_number = parseInt(this.event.request.intent.slots.word_number.value) - 1;
      this.attributes['word_number'] = word_number;
    } else if (this.attributes['word_number'] !== undefined) {
      word_number = this.attributes['word_number'];
    } else {
      this.emit('Unhandled');
    }

    var top = this.attributes["topWords"];
    if (word_number < 0) {
      this.emit(':ask', 'it is lower than 0. speak again.');
    } else if (word_number > top.length) {
      this.emit(':ask', 'it is higher than suggested number. speak again.');
    } else {
		console.log("word_number : " + word_number);
      var selected = top[word_number];
      var left_number = selected.titles.length;
      var titles = [];

      for (var i = 0; i < 5 && selected != null; i++) {
        var tmp = selected.pop();

        if (!tmp) break;
        titles.push("title : " + tmp.title + "<break time='400ms'/> content : ");
      }

      var output = "There is " + left_number + " Articles about " + selected.word + "<break time='400ms'/>";
      for (var i in titles) {
        output += (parseInt(i) + 1) + ". " + titles[i] + "<break time='400ms'/>";
      }

      if (selected.titles.length == 0) {
        output += 'no more articles about ' + selected.word + "... <break time='400ms'/> See you next time!";
        this.emit(':tell', output);
      } else {
        output += ' Do you want more articles? ';
        this.emit(':ask', output);
      }
    }
  },
  'AMAZON.HelpIntent': function() {
    var message = 'I will help you.';
    this.emit(':tell', message);
  },
  'AMAZON.YesIntent': function() {
    this.emitWithState('SuperHotArticleIntent');
  },
  'AMAZON.NoIntent': function() {
    console.log("NOINTENT");
    this.emit(':tell', 'Ok, see you next time!');
  },
  "AMAZON.StopIntent": function() {
    console.log("STOPINTENT");
    this.emit(':tell', "Goodbye!");
  },
  "AMAZON.CancelIntent": function() {
    console.log("CANCELINTENT");
    this.emit(':tell', "Goodbye!");
  },
  'SessionEndedRequest': function () {
    console.log("SESSIONENDEDREQUEST");
    this.attributes['endedSessionCount'] += 1;
    this.emit(':tell', "Goodbye!");
  },
  'Unhandled': function() {
    console.log("UNHANDLED");
    this.emit(':tell', 'unhandled exception');
  },
  'NoMore': function() {
    console.log("NoMore");
    this.emit(':tell', 'no more articles... See you next time!');
  }
});


"use strict";

const Alexa = require('alexa-sdk');
const xml2js = require('xml2js');
const request = require('sync-request');
const Article = require('./article');
const Words = require('./word');

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
    'HelloWorldIntent': function () {
      var url = 'http://www.wsj.com/xml/rss/3_7085.xml';
      var parser = new xml2js.Parser();
      var reponse = request('POST', url);
      this.emit(':tell', 'Hello World!');
    }
};
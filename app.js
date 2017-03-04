
"use strict";

const http = require('http');
const request = require('request');
const Article = require('./article');
const Words = require('./word');
const Dictionary = require('./dictionary');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  if(req.url === '/favicon.ico') {
      console.log('Favicon was requested');
      return;
  }

  res.end(JSON.stringify(topN));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

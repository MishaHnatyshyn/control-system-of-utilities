'use strict';
const fs = require('fs');
const url = require('url');
const stat = require('node-static');
const db = require('./db');
const insertData = require('./insertData');
const getData = require('./getData');

const fileServer = new stat.Server('../public/', {
  cache: 3600,
  gzip: true
});

const route = (req,res) => {
  const data = url.parse(req.url, true).query;
  const path = url.parse(req.url, true).pathname;

  if (Object.keys(data).length) {

    if (req.method == 'POST') {

      insertData.insert(data, db);
      res.end();
    }
    if (req.method == 'GET') {
      getData.getOne(data, db, (response) => {
        res.end(response);
      });
    }
  } else {

    if (path.indexOf('styles') || path.indexOf('scripts')) {

      req.addListener('end', function () {
        fileServer.serve(req, res);
      }).resume();
    }
    if (path === '/' || path === '/home') {
      res.end(fs.readFileSync('../public/views/index.html'));
    }
  }
};

module.exports.route = route;

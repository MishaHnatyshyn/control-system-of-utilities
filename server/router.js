'use strict';
const fs = require('fs');
const url = require('url');
const stat = require('node-static');
const db = require('./db');
const insert = require('./insertData');

const fileServer = new stat.Server('../public/', {
  cache: 3600,
  gzip: true
});

const route = (req,res) => {
  const data = url.parse(req.url, true).query;
  const path = url.parse(req.url, true).pathname;

  if (path === '/' || path === 'home'){
    res.end(fs.readFileSync('../public/views/index.html'));
  }

  if (req.method == 'POST'){
    insert.add(data, db);
    res.end();
  }

  if (path.indexOf('styles') || path.indexOf('scripts')){
    req.addListener( 'end', function () {
      fileServer.serve( req, res );
    } ).resume();
  }

};

module.exports.route = route;
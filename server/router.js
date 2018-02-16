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

      if (req.headers.cause === 'get-one')
      getData.getOne(data, db, (response) => {
        res.end(response);
      });
      else if (req.headers.cause === 'get-many')
      getData.getMany(data, db, (response) => {
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
    if (path === '/cabinet'){
        res.end(fs.readFileSync('../public/views/cabinet.html'));
    }
    if (path === '/current-month'){
        res.end(fs.readFileSync('../public/views/current-month.html'));
    }
    if (path === '/statistics'){
        res.end(fs.readFileSync('../public/views/statistics.html'));
    }
    if (path === '/gas' || path === '/electricity' || path === '/garbage' || path === '/canalization' || path === '/kvartplata'){
        let response = fs.readFileSync('../public/views/category.html','utf8');
        const catName = path.replace('/', '')[0].toUpperCase() + path.replace('/', '').slice(1);
        response = response.replace('***CATEGORY_NAME***', catName);
        response = response.replace('***CATEGORY_NAME***', catName);
        response = response.replace('***PATH***',path);
        response = response.replace('***PATH***',path);
        res.end(response);
    }
  }
};

module.exports.route = route;

'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const insertData = require('./insertData');
const db = require('./db');
const url = require('url');
const getData = require('./getData');

/*router.get('/', (req, res)=>{
  res.end(fs.readFileSync('public/views/index.html'));
});*/

router.get('/cabinet', (req, res)=>{
  res.end(fs.readFileSync('public/views/cabinet.html'));
});

router.get('/current-month', (req, res)=>{
  res.end(fs.readFileSync('public/views/current-month.html'));
});

router.get('/statistics', (req, res)=>{
  res.end(fs.readFileSync('public/views/statistics.html'));
});

router.get('/gas', (req, res)=>{
  let response = fs.readFileSync('public/views/category.html','utf8');
  response = response.replace('***CATEGORY_NAME***', 'gas');
  response = response.replace('***CATEGORY_NAME***', 'gas');
  response = response.replace('***PATH***','/gas');
  response = response.replace('***PATH***','/gas');
  res.end(response);
});

router.get('/electricity', (req, res)=>{
  let response = fs.readFileSync('public/views/category.html','utf8');
  response = response.replace('***CATEGORY_NAME***', 'electricity');
  response = response.replace('***CATEGORY_NAME***', 'electricity');
  response = response.replace('***PATH***','/electricity');
  response = response.replace('***PATH***','/electricity');
  res.end(response);
});

router.get('/garbage', (req, res)=>{
  let response = fs.readFileSync('public/views/category.html','utf8');
  response = response.replace('***CATEGORY_NAME***', 'garbage');
  response = response.replace('***CATEGORY_NAME***', 'garbage');
  response = response.replace('***PATH***','/garbage');
  response = response.replace('***PATH***','/garbage');
  res.end(response);
});

router.get('/canalization', (req, res)=>{
  let response = fs.readFileSync('public/views/category.html','utf8');
  response = response.replace('***CATEGORY_NAME***', 'canalization');
  response = response.replace('***CATEGORY_NAME***', 'canalization');
  response = response.replace('***PATH***','/canalization');
  response = response.replace('***PATH***','/canalization');
  res.end(response);
});

router.get('/kvartplata', (req, res)=>{
  let response = fs.readFileSync('public/views/category.html','utf8');
  response = response.replace('***CATEGORY_NAME***', 'kvartplata');
  response = response.replace('***CATEGORY_NAME***', 'kvartplata');
  response = response.replace('***PATH***','/kvartplata');
  response = response.replace('***PATH***','/kvartplata');
  res.end(response);
});

router.get('/get-one',(req, res)=>{
  const data = url.parse(req.url, true).query;
  getData.getOne(data, db, (response) => {
    res.end(response);
  });
});

router.get('/get-many',(req, res)=>{
  const data = url.parse(req.url, true).query;
  getData.getMany(data, db, (response) => {
    res.end(response);
  });
});

router.post('/insert', (req, res)=>{
  const data = url.parse(req.url, true).query;
  insertData.insert(data, db);
  res.end();
});

module.exports = router;

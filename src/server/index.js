'use strict';
const http = require('http');
const router = require('./router');
const db = require('./db');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
app.use('/', router);

app.listen(8080, ()=>{
  console.log('Server running');
  db.dbConnect();
});

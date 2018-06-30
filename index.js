'use strict';
const http = require('http');
const router = require('./server/router');
const db = require('./server/db');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use('/', router);

app.listen(8080, ()=>{
    console.log('Server running');
    db.dbConnect();
});

'use strict';
const http = require('http');
const router = require('./router');
const db =require('./db');

const server = http.createServer();
const port = 8080;

server.on('request', function (req, res) {
    router.route(req,res);
});

server.listen(port, function () {
    console.log('Server running');
    db.dbConnect();
});

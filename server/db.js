'use strict';
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost/mydb";
// const url = "mongodb://admin:admin@172.30.78.118/chatdb";
let mydb;

const dbConnect = () => {
    MongoClient.connect(url, function (err, database) {
        mydb = database.db('mydb');
        console.log('data base connected!');
        module.exports.mydb = mydb;
    });
};


module.exports.dbConnect = dbConnect;

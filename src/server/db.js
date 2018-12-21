'use strict';
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://admin123:admin123@ds127704.mlab.com:27704/ucs';
// const url = "mongodb://admin:admin@172.30.78.118/chatdb";
let mydb;

const dbConnect = () => {
  MongoClient.connect(url, {useNewUrlParser: true},function (err, database) {
    mydb = database.db('ucs');
    console.log('data base connected!');
    module.exports.mydb = mydb;
  });
};


module.exports.dbConnect = dbConnect;

'use strict';

const getOne = (query, db, callback) => {
  db.mydb.collection(query.data.replace(/"/g, '')).find({}).toArray((err, result)=>{
    callback(JSON.stringify(result));
  });
};

const getMany = (query, db, callback) => {

};

module.exports.getOne = getOne;
module.exports.getMany = getMany;
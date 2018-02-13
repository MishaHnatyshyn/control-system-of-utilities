'use strict';

const getOne = (request, db, callback) => {
  const data = JSON.parse(request.data);
  const query = {};
  for (let key in data.query){
      query[key] = data.query[key];
  }

  db.mydb.collection(data.category).find(query).toArray((err, result) => {
      callback(JSON.stringify(result));
  });
};

const getMany = (query, db, callback) => {

};

module.exports.getOne = getOne;
module.exports.getMany = getMany;
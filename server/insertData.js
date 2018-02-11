'use strict';

const add = (data, db) => {
  const info = JSON.parse(data.data);
  const obj = {};

  if(info.prev && info.curr){
    obj.previous_value = info.prev;
    obj.current_value = info.curr;
  }
  obj.cost = info.cost;
  obj.sum = info.sum;
  obj.month = info.month;
  obj.time_of_record = new Date();
  obj.user = 'user1';
  obj.personal_account = '0000';
  db.mydb.collection(info.target).insertOne(obj);
};

module.exports.add = add;
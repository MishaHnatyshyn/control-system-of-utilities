'use strict';

const insert = (data, db) => {
  const info = JSON.parse(data.data);

  for (let key in info){
    let obj = {};
    if (key === 'month') continue;

    if(info[key].prev && info[key].curr){
      obj.previous_value = info[key].prev;
      obj.current_value = info[key].curr;
    }
    obj.cost = info[key].cost;
    obj.sum = info[key].sum;
    obj.month = info.month;
    obj.time_of_record = new Date();
    obj.user = 'user1';
    obj.personal_account = '0000';
    db.mydb.collection(key).insertOne(obj);
  }
};

module.exports.insert = insert;
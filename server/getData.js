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

const getMany = (request, db, callback) => {
    const data = JSON.parse(request.data);
    const query = {};

    for (let key in data.query){
        query[key] = data.query[key];
    }
    reqursiveGetForYear(db,{},{},0,data.targets,query.month, query.year, (answer) => {callback(JSON.stringify(answer))})

};

const reqursiveGet = (db, obj ,index, targets, query, callback) => {
    db.mydb.collection(targets[index]).find(query).toArray((err, result) => {
        obj[ targets[index] ] = result;
        if (index < targets.length-1) reqursiveGet(db, obj,index+1,targets,query,callback);
        else {
            callback(obj)
        }
    });
};

const reqursiveGetForYear = (db, obj1, obj2 ,index, targets,month, year, callback) => {
    const query = {};
    const temp = {year: year};
    if(month.length === 1) temp.month = month[0];
    for (let key in temp){
        query[key] = temp[key];
    }

    reqursiveGet(db,obj1,0,targets,query, (answer) => {

        for (let index=0;index<answer.gas.length;index++){
            obj2[answer.gas[index].month] = {};

            for(let key in answer){
                if (answer.gas[index].month === answer[key][index].month)
                obj2[answer.gas[index].month][key] = answer[key][index];
            }

        }
        callback(obj2);
    });

};




module.exports.getOne = getOne;
module.exports.getMany = getMany;
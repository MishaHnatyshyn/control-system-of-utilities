'use strict';

const postData = (target) => {

  const data = {};
  data[target] = {};
  data[target].sum = document.getElementById('sum-'+target).value.replace(' грн.','');
  data[target].cost = document.getElementById('cost-'+target).value;
  data.month = document.getElementById('month').value;
  data.year = document.getElementById('year').value;
  data.is_paid = document.getElementById('is_paid-'+target).checked;
  if(target !== 'garbage' && target !== 'kvartplata'){
    data[target].prev = document.getElementById('value-befor-'+ target).value;
    data[target].curr = document.getElementById('value-now-'+ target).value;
  }
  document.getElementById('addTo'+target).reset();
  request(data,'POST');
};

const postDataMany = () => {
  const targetList = ['gas','electricity','water','garbage','kvartplata','canalization'];
  const targets = [];
  const data = {};

  for(let i = 0; i < targetList.length;i++){
    let add = false;
    const obj = {};
    obj.sum = document.getElementById('sum-'+targetList[i]).value.replace(' грн.','');
    obj.cost = document.getElementById('cost-'+targetList[i]).value;
    obj.is_paid = document.getElementById('is_paid-'+targetList[i]).checked;

    if(obj.sum  !== '' && obj.cost !== '')add = true;

    if(targetList[i] !== 'garbage' && targetList[i] !== 'kvartplata'){
      obj.prev = document.getElementById('value-befor-'+ targetList[i]).value;
      obj.curr = document.getElementById('value-now-'+ targetList[i]).value;
      if(!obj.prev || !obj.curr)add = false;
    }

    if (add) {
      data[targetList[i]] = obj;
    }
    document.getElementById('addTo'+targetList[i]).reset();
  }

  if (Object.keys(data).length) {
    data.month = document.getElementById('month').value;
    data.year = document.getElementById('year').value;
    request(data,'POST');
  }

};

const request = (data, method, header, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (method === 'POST')alert('Дані успішно додано');
      else callback(JSON.parse(this.responseText));
    }
  };
  xhr.open(method, '?data='+JSON.stringify(data), true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  if (method === 'GET')xhr.setRequestHeader('cause', header);
  xhr.send();
};
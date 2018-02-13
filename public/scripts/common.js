'use strict';

let workArea;

const navOpen = (path) => {
  workArea = document.getElementById('work-area');

  if (path === '/statistics') {
    workArea.innerHTML =
            `    <button onclick="statistic('last-month')">Statistic for last month</button><br>
                 <button onclick="statistic('month')">Statistic for:</button><br>
                 <button onclick="statistic('this-year')">Statistic this last year</button><br>
                 <button onclick="statistic('last-year')">Statistic for last year</button>  `;
  } else if(path === '/currentMonth'){
    workArea.innerHTML = addFormGenerate();
  }else
    workArea.innerHTML =

        `   
    <h2>${path.replace('/','')}</h2>
    <button onclick="add('${path}')">Add new values</button><br>
             <button onclick="statistic('${path}')">Look statistic</button>  `;


};

const getBlock = (id) => {
  return document.getElementById(id);
};

const add = (path) => {
  const target = path.replace('/','');
  workArea.innerHTML = addFormGenerate([target]);
};

const calculate = (target) => {
  let valBefor;
  let valNow;
  const cost = document.getElementById('cost-' + target).value;

  if(target !== 'garbage' && target !== 'kvartplata'){
    valBefor = document.getElementById('value-befor-' + target).value;
    valNow = document.getElementById('value-now-' + target).value;
    if (valBefor || valNow || cost){
      const sum = (valNow - valBefor) * cost;
      document.getElementById('sum-' + target).value = sum + ' грн.';
    }
  } else if(cost) document.getElementById('sum-' + target).value = cost + ' грн.';



};

const statistic = (path) => {
  const obj = {};

    const target = path.replace('/','');
    obj.category = target;
    obj.query = {};
    workArea.innerHTML = `
  <div id="filters">
    <form id="form-filter" onchange="filter('${target}')">
        <label for="month">Статистика за:</label>
        ${monthSelector.replace('id="month">', 'id="month" onchange=""><option value="all">За весь період</option>')}
        <label for="onlyPaied">Тільки неоплачені рахунки:</label>
        
    <input id="onlyPaied" type="checkbox" name="onlyPaied" value="false" onchange="">
    </form>
  </div>
  <div id="table"></div>
  `;

  request(obj, 'GET', (data)=>{
    displayTable(data, target);
  });
};

const filter = (path) => {
    const obj = {};
    obj.query = {};

    const target = path.replace('/','');
    obj.category = target;
    const userMonth = document.getElementById('month').value;
    const userIsPaied = document.getElementById('onlyPaied').checked;
    if (userIsPaied ) obj.query.is_paied = !userIsPaied;
    if (userMonth !== 'all') obj.query.month = userMonth;
    console.log(obj.query);

    request(obj, 'GET', (data)=>{
        displayTable(data, target);
    });
};


const addFormGenerate = (target =  ['gas','electricity','water','garbage','kvartplata','canalization']) => {

  let result = '';
  if (target.length > 1)result += monthSelector;
  for (let i = 0; i < target.length;i++){
    result += `<div id="month${target[i]}">
    <h2>${target[i]}</h2>
    <form id = "addTo${target[i]}" onkeyup="calculate('${target[i]}') ">`;


    if(target[i] !== 'garbage' && target[i] !== 'kvartplata'){
      result += `<div id="value-befor-container-${target[i]}">
        <label for="value-befor-${target[i]}">Попередній показник:</label>
        <input type="text" name="value-befor-${target[i]}" id="value-befor-${target[i]}"><br>
    </div>
    <div id="value-now-container-${target[i]}">
        <label for="value-now-${target[i]}">Поточний показник:</label>
        <input type="text" name="value-now-${target[i]}" id="value-now-${target[i]}"><br>
    </div>`;
    }

    result += `<label for="cost-${target[i]}">Тариф:</label>
    <input type="text" name="cost-${target[i]}" id="cost-${target[i]}"><br>
    
    <label for="sum-${target[i]}">Сума</label>
    <input type="text" name="sum-${target[i]}" id="sum-${target[i]}" readonly style="border: none"><br>
    <label for="is_paied-${target[i]}">Оплачено</label>
    <input type="checkbox" name="is_paied-${target[i]}" id="is_paied-${target[i]}"><br>

`;

    if (target.length === 1) result += monthSelector +
        `<input type="button" value="Відправити" onclick="postData('${target[i]}')">`;

    result += '</form>';
  }
  if (target.length > 1) result += '<br><button onclick="postDataMany()">Add all values</button>';
  return result;
};

const postData = (target) => {

  const data = {};
  data[target] = {};
  data[target].sum = document.getElementById('sum-'+target).value.replace(' грн.','');
  data[target].cost = document.getElementById('cost-'+target).value;
  data.month = document.getElementById('month').value;
  data.is_paied = document.getElementById('is_paied-'+target).checked;
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
    request(data,'POST');
  }
};

const request = (data, method, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (method === 'POST')alert('Дані успішно додано');
      else callback(JSON.parse(this.responseText));
    }
  };
  xhr.open(method, '?data='+JSON.stringify(data), true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
};

const displayTable = (data, target) => {
  let tableHTML = document.getElementById('table');
  if (data.length === 0) {
      tableHTML.innerHTML = '<br><h3>Данних немає</h3>';
    return;
  }
  let long = true;
  if (target === 'garbage' || target === 'canalization') long = false;
  let table = `
  <br><br> 
  <table style="width:100%">
  <tr>
  <th>Mісяць</th>`;

  table += long ? `
  <th>Попередній показник</th>
  <th>Поточний показник</th>
  <th>Використано</th>` :'';

  table += ` 
  <th>Тариф</th>
  <th>Ціна</th>
  <th>Оплачено</th>
  </tr>`;

  for (let i =0 ; i<data.length;i++){
    table += ` <tr>
    <td>${data[i].month}</td>`;

    table += long ? `
    <td>${data[i].previous_value}</td>
    <td>${data[i].current_value}</td> 
    <td>${data[i].current_value - data[i].previous_value}</td>` :'';

    table += `
    <td>${data[i].cost}</td>
    <td>${data[i].sum} грн.</td> 
    <td>${data[i].is_paied}</td>
    </tr>`;

  }
  table += '</table>';


    tableHTML.innerHTML = table;
};

const monthSelector = `
<select name="month" id="month">
<option value="January">Січень</option>
<option value="February">Лютий</option>
<option value="March">Березень</option>
<option value="April">Квітень</option>
<option value="May">Травень</option>
<option value="June">Червень</option>
<option value="July">Липень</option>
<option value="August">Серпень</option>
<option value="September">Вересень</option>
<option value="October">Жовтень</option>
<option value="November">Листопад</option>
<option value="December">Гудень</option>
</select><br>
`
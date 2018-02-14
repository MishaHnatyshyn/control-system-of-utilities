'use strict';

let workArea;

const navOpen = (path) => {
  workArea = document.getElementById('work-area');

  if (path === '/statistics') {
    workArea.innerHTML =
            `    <button onclick="globalStatistic('last-month')">Statistic for last month</button><br>
                 <button onclick="globalStatistic('month')">Statistic for:</button>${monthSelector.replace('<br>','') + yearSelector}
                 <button onclick="globalStatistic('this-year')">Statistic for this year</button><br>
                 <button onclick="globalStatistic('last-year')">Statistic for last year</button>  
                 <div id="table"></div>`;
      document.getElementById('month').value = monthList[getLastMonth()]
      document.getElementById('year').value = new Date().getFullYear()
  } else if(path === '/currentMonth'){
    workArea.innerHTML = addFormGenerate();
      document.getElementById('month').value = monthList[getLastMonth()]
      document.getElementById('year').value = new Date().getFullYear()
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

  request(obj, 'GET','get-one', (data)=>{
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
    if (userIsPaied ) obj.query.is_paid = !userIsPaied;
    if (userMonth !== 'all') obj.query.month = userMonth;

    request(obj, 'GET','get-one', (data)=>{
        displayTable(data, target);
    });
};


const addFormGenerate = (target =  ['gas','electricity','water','garbage','kvartplata','canalization']) => {

  let result = '';
  if (target.length > 1)result += monthSelector + yearSelector;

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
    <label for="is_paid-${target[i]}">Оплачено</label>
    <input type="checkbox" name="is_paid-${target[i]}" id="is_paid-${target[i]}"><br>
    <div id="table"></div>

`;

    if (target.length === 1) result += monthSelector + yearSelector +
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

let graphData = [];
const displayTable = (data, target) => {
    graphData = [];
    graphData.push(['Month', 'Sum',]);
  let tableHTML = document.getElementById('table');
  if (data.length === 0) {
      tableHTML.innerHTML = '<br><h3>Данних немає</h3>';
    return;
  }
  let long = true;
  if (target === 'garbage' || target === 'kvartplata') long = false;
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
    <td>${data[i].month + ' ' +data[i].year}</td>`;

    table += long ? `
    <td>${data[i].previous_value}</td>
    <td>${data[i].current_value}</td> 
    <td>${data[i].current_value - data[i].previous_value}</td>` :'';

    table += `
    <td>${data[i].cost}</td>
    <td>${data[i].sum} грн.</td> 
    <td>${data[i].is_paid}</td>
    </tr>`;
    graphData.push([data[i].month + ' ' +data[i].year, parseInt(data[i].sum)])

  }

  table += '</table><div id="curve_chart" style="width: 900px; height: 500px"></div>';


    tableHTML.innerHTML = table;
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(genrateGraphGategory);

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
`;

const yearSelector = `
<select name="year" id="year">
<option value="2010">2010</option>
<option value="2011">2011</option>
<option value="2012">2012</option>
<option value="2013">2013</option>
<option value="2014">2014</option>
<option value="2015">2015</option>
<option value="2016">2016</option>
<option value="2017">2017</option>
<option value="2018">2018</option>
<option value="2019">2019</option>
<option value="2020">2020</option>
<option value="2021">2021</option>
<option value="2022">2022</option>
<option value="2023">2023</option>
</select><br>
`;

const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const globalStatistic = (cause) => {

  const obj = {
      'last-month': {month: [monthList[getLastMonth()]] , year: '' + getYearOfLastMonth() },
      'month': {month: [document.getElementById('month').value], year:document.getElementById('year').value},
      'year': {year: ''},
      'this-year': {month: monthList, year: '' + new Date().getFullYear()},
      'last-year': {month: monthList, year:new Date().getFullYear() - 1 + ''}
  };
  request({
      targets : [
        'gas',
        'electricity',
        'water',
        'canalization',
        'kvartplata',
        'garbage'],
      query : obj[cause]
  },'GET','get-many',(result)=>{displayTableGlobal(result)} )
};

const displayTableGlobal = (data) => {
    let tableHTML = document.getElementById('table');
    let table ='';

    if (Object.keys(data).length === 0) {
        tableHTML.innerHTML = '<h3>Данних немає</h3>';
        return;
    }
    else table =`<h2>${data[Object.keys(data)[0]].gas.year}</h2>`
    for (let keykey in data) {

        table += `
        <table>
        <tr>
        <th>${keykey}</th>
        </tr>
        <tr>
        <td></td>
        <td>Попередній показник:</td>
        <td>Наступний показник:</td>
        <td>Використано:</td>
        <td>Тариф:</td>
        <td>Сума:</td>
        <td>Оплачено:</td>
        </tr>
        `;

        for (let key in data[keykey]) {

            let long = true;
            if (key === 'garbage' || key === 'kvartplata') long = false;
            table += `
        <tr>
        <td>${key}</td>`;

            table += long ? `
    <td>${data[keykey][key].previous_value}</td>
    <td>${data[keykey][key].current_value}</td> 
    <td>${data[keykey][key].current_value - data[keykey][key].previous_value}</td>` : '<td></td><td></td><td></td>';

            table += `
    <td>${data[keykey][key].cost}</td>
    <td>${data[keykey][key].sum} грн.</td> 
    <td>${data[keykey][key].is_paid}</td>
    </tr>
      `;
        }
        table += '</table>';
    }
    tableHTML.innerHTML = table;

};

const getLastMonth = () => {
  const date = new Date();
  let lastMonth = date.getMonth() - 1;
  if (lastMonth === -1) return 11;
  return lastMonth;
};

const getYearOfLastMonth = () => {
  const date = new Date();
  return (date.getMonth() - 1 >= 0) ? date.getFullYear():date.getFullYear()-1;
};

function genrateGraphGategory (){
    // graphData.reverse()
    const data = google.visualization.arrayToDataTable(graphData);

    const options = {
        title: 'Graph Display',
        legend: { position: 'right' },
        hAxis: {title: 'Month'},
        vAxis: {title: 'Sum, грн.'}
    };

    const chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);

};

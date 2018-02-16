'use strict';

let workArea;
let graphData = [];
const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function setLocation(curLoc,title){
    history.pushState(null, title, curLoc);
}

const navOpen = (path) => {
    let category = path.replace('/', '');
    category = category[0].toUpperCase() + category.slice(1);
    document.title = category;
  workArea = getBlock('work-area');
    setLocation(path,category);
  if (path === '/statistics') {
    workArea.innerHTML =
            `   <div class="addForm">
                <ul>
                <li onclick="globalStatistic('last-month')">Statistic for last month</li>
                <li><div><span style="height: 100%" onclick="globalStatistic('month')">Statistic for:</span>${monthSelector.replace('<br>', '')}${yearSelector}</div> </li>
                <li onclick="globalStatistic('this-year')">Statistic for this year</li>
                <li onclick="globalStatistic('last-year')">Statistic for last year</li>
                <li style="float: right" onclick="location.href = '/cabinet'">Персональний кабінет</li>
                </ul>  
                 </div>
                 <div id="table"></div>`;
    getBlock('month').value = monthList[getLastMonth()];
    getBlock('year').value = new Date().getFullYear();

  } else if (path === '/current-month') {
    workArea.innerHTML = addFormGenerate();
    getBlock('month').value = monthList[getLastMonth()];
    getBlock('year').value = new Date().getFullYear();
      // history.pushState(null, null, '/current-month');
  } else {
      // history.pushState(null, null, path);

    workArea.innerHTML =
        `  <div class="addForm"> 
    <ul>
    <li id="categoryName">${category}</li>
    <li onclick="add('${path}')">Add new values</li>
    <li onclick="statistic('${path}')">Look statistic</li>
    <li style="float: right" onclick="location.href = '/cabinet'">Персональний кабінет</li>
    </ul>
    
    </div>`;
  }

};

const getBlock = (id) => {
  return document.getElementById(id);
};

const add = (path) => {
    workArea = getBlock('work-area');
  const target = path.replace('/','');
  let category = path.replace('/', '');
  category = category[0].toUpperCase() + category.slice(1);
  workArea.innerHTML =
        `  <div class="addForm"> 
    <ul>
    <li id="categoryName">${category}</li>
    <li onclick="add('${path}')">Add new values</li>
    <li onclick="statistic('${path}')">Look statistic</li>
    <li style="float: right" onclick="location.href = '/cabinet'">Персональний кабінет</li>
</ul>
    
    </div>`;

  workArea.innerHTML += addFormGenerate([target]);
};

const calculate = (target) => {
  let valBefor;
  let valNow;
  const cost = getBlock('cost-' + target).value;

  if(target !== 'garbage' && target !== 'kvartplata'){
    valBefor = getBlock('value-befor-' + target).value;
    valNow = getBlock('value-now-' + target).value;
    if (valBefor || valNow || cost){
      const sum = (valNow - valBefor) * cost;
      getBlock('sum-' + target).value = sum + ' грн.';
    }
  } else if(cost) getBlock('sum-' + target).value = cost + ' грн.';



};

const statistic = (path) => {
    workArea = getBlock('work-area');
  const obj = {};
  let category = path.replace('/', '');
  category = category[0].toUpperCase() + category.slice(1);

  const target = path.replace('/','');
  obj.category = target;
  obj.query = {};

  workArea.innerHTML = `
<div class="addForm"> 
    <ul>
    <li id="categoryName">${category}</li>
    <li onclick="add('${path}')">Add new values</li>
    <li onclick="statistic('${path}')">Look statistic</li>
    <li style="float: right" onclick="location.href = '/cabinet'">Персональний кабінет</li>
</ul>
    
    </div>
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
  const userMonth = getBlock('month').value;
  const userIsPaied = getBlock('onlyPaied').checked;
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




const globalStatistic = (cause) => {

  const obj = {
    'last-month': {month: [monthList[getLastMonth()]] , year: '' + getYearOfLastMonth() },
    'month': {month: [getBlock('month').value], year:getBlock('year').value},
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
  },'GET','get-many',(result)=>{displayTableGlobal(result);} );
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
  const data = google.visualization.arrayToDataTable(graphData);

  const options = {
    title: 'Graph Display',
    legend: { position: 'right' },
    hAxis: {title: 'Month'},
    vAxis: {title: 'Sum, грн.'}
  };

  const chart = new google.visualization.LineChart(getBlock('curve_chart'));
  chart.draw(data, options);

}

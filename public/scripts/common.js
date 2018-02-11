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

};

const addFormGenerate = (target =  ['gas','electricity','water','garbage','kvartplata','canalization']) => {

  let result = '';

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
    <input type="text" name="sum-${target[i]}" id="sum-${target[i]}" readonly style="border: none"><br>`;

    if (target.length === 1) result += `
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
<input type="button" value="Відправити" onclick="postData('${target[i]}')">`;

    result += '</form>';
  }
  if (target.length > 1) result += '<br><button>Add all values</button>';
  return result;
};

const postData = (target) => {

  const data = {};
  data.target = target;
  data.sum = document.getElementById('sum-'+target).value.replace(' грн.','');
  data.cost = document.getElementById('cost-'+target).value;
  data.month = document.getElementById('month').value;
  if(target !== 'garbage' && target !== 'kvartplata'){
    data.prev = document.getElementById('value-befor-'+ target).value;
    data.curr = document.getElementById('value-now-'+ target).value;
  }
  document.getElementById('addTo'+target).reset();
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
    }
  };
  xhr.open('POST', '?data='+JSON.stringify(data), true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
};
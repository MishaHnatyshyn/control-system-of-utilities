'use strict';

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
  <table>
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
    graphData.push([data[i].month + ' ' +data[i].year, parseInt(data[i].sum)]);

  }

  table += '</table><div id="curve_chart" style="width: 900px; height: 500px"></div>';


  tableHTML.innerHTML = table;
  google.charts.load('current', {'packages': ['corechart']});
  google.charts.setOnLoadCallback(genrateGraphGategory);

};


const displayTableGlobal = (data) => {
  graphData = [];
  graphData.push(['Month', 'Sum',]);
  let tableHTML = document.getElementById('table');
  let table ='';


  let sum = 0;
  if (Object.keys(data).length === 0) {
    tableHTML.innerHTML = '<h3>Данних немає</h3>';
    return;
  }
  else table =`<h2 id="yearDisplay">${data[Object.keys(data)[0]].gas.year}</h2>`;
  for (let keykey in data) {

    table += `
      <table>
        <tr>
        <th style="font-size: larger;color: black;text-shadow: none">${keykey}</th>
        <th>Попередній показник:</th>
        <th>Наступний показник:</th>
        <th>Використано:</th>
        <th>Тариф:</th>
        <th>Оплачено:</th>
        <th>Сума:</th>
        </tr>
      `;

    for (let key in data[keykey]) {
      sum +=parseInt(data[keykey][key].sum);
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
        <td>${data[keykey][key].is_paid}</td>
        <td>${data[keykey][key].sum} грн.</td> 
        </tr>
      `;
    }

    table += `    
      <tr id="last">
      <td>Всього:</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>${sum + ' грн.'}</td>
      </tr>
      </table>`;
    graphData.push([keykey, sum,]);
  }

  table += '<div id="curve_chart" style="width: 900px; height: 500px"></div>';

  tableHTML.innerHTML = table;
  if (Object.keys(data).length > 1) {
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(genrateGraphGategory);
  }
};

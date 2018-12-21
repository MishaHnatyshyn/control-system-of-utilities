import React, { Component } from 'react';


export default class MonthOfPayment extends Component{
    render(){
      this.months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
      this.year =[];
      for(let i = 2015;i<2126;i++){this.year.push(<option value="Year" key ={i}>{i + ''}</option>)};
      return(
         <div>
           <select>{this.months.map((month)=><option value={month} key = {month}>{month}</option>)}</select>
           <select>{this.year}</select>
         </div>
        )
    }
    
}
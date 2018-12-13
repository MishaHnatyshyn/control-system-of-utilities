import React, { Component } from 'react';
import NavBar from './NavBar';
import Main from './Main';


export default class App extends Component{
  render() {
      this.billsArray =
          [{categoryName: 'gas', title: 'Газ'},
              {categoryName: 'electricity', title: 'Електроенергія'},
              {categoryName: 'waterSupply', title: 'Водопостачання'},
              {categoryName: 'sewage', title: 'Каналізація'},
              {categoryName: 'rent', title: 'Квартплата'},
              {categoryName: 'removalOfGarbage', title: 'Вивіз сміття'}];
      return <div>
              <div>Hello world</div>
              <Main bills = {this.billsArray}/>
              <NavBar bills = {this.billsArray}/>
           </div>
  }
}

const billsArray =
    [{categoryName: 'gas', title: 'Газ'},
        {categoryName: 'electricity', title: 'Електроенергія'},
        {categoryName: 'waterSupply', title: 'Водопостачання'},
        {categoryName: 'sewage', title: 'Каналізація'},
        {categoryName: 'rent', title: 'Квартплата'},
        {categoryName: 'removalOfGarbage', title: 'Вивіз сміття'}];
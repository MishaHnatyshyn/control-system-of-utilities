import React, { Component } from 'react';
import NavBar from './NavBar';
import Main from './Main';
import 'bootstrap/dist/css/bootstrap.css'
import Header from "./Header";

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
                 <Header/>
                  <div className = 'row'>
                    <NavBar bills = {this.billsArray} />
                    <Main bills = {this.billsArray} />
                  </div>
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
import React, { Component } from 'react';

export default class Header extends Component{
 render(){
     return(
         <nav className="navbar navbar-inverse">
             <div className="container-fluid">
                 <div className="navbar-header">
                     <a className="navbar-brand page-header" href="#">Комуналка Live</a>
                 </div>
                 <ul className="nav navbar-nav navbar-right">
                     <li><a href="#"><span className="glyphicon glyphicon-user"></span>Реєстрація</a></li>
                     <li><a href="#"><span className="glyphicon glyphicon-log-in"></span>Вхід</a></li>
                 </ul>
             </div>
         </nav>
     )
 }
}
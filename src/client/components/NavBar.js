import React, { Component } from 'react';
import Bills from './Bills';
import OneBill from './OneBill';
import {Link} from "react-router-dom"

export default class NavBar extends React.Component{
    render(){

        const {bills} = this.props;
        return (
            <nav className = 'col-sm-3 '>
                <ul className = 'list-group'>
                    <li className="list-group-item"><Link to='/bills'>Поточний місяць</Link></li>
                    <li className="list-group-item"><Link to='/gas'>{bills[0].title}</Link></li>
                    <li className="list-group-item"><Link to='/electricity'>{bills[1].title}</Link></li>
                    <li className="list-group-item"><Link to='/waterSupply'>{bills[2].title}</Link></li>
                    <li className="list-group-item"><Link to='/sewage'>{bills[3].title}</Link></li>
                    <li className="list-group-item"><Link to='/rent'>{bills[4].title}</Link></li>
                    <li className="list-group-item"><Link to='/removalOfGarbage'>{bills[5].title}</Link></li>
                </ul>
            </nav>
        )
    }
}
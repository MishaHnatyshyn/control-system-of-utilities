import React, { Component } from 'react';
import OneBill from './OneBill';


export default class Bills extends Component {
    render(){
        return(
            <div className = 'main row'>{this.props.bills.map((bill)=>
                <OneBill bill = {bill} key = {bill.categoryName} />)}
            </div>
        )
    }
}
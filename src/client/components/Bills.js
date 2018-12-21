import React, { Component } from 'react';
import OneBill from './OneBill';


export default class Bills extends Component {
    render(){
        return(
            <div className = 'd-flex flex-row bd-highlight justify-content-md-between align-content-start flex-wrap'>{this.props.bills.map((bill)=>
                <OneBill  bill = {bill} key = {bill.categoryName} />)}
            </div>
        )
    }
}
import React, { Component } from 'react';
import MonthOfPayment from './MonthOfPayment'

export default class OneBill extends Component {
    constructor(props){
        super(props);
        this.state = {year: '2020', month: 'Квітень',priviuseValue: '',currentValue: '', costEach: '', sumCost: '', paid: false};
    }
    handleMonthChange = (e) => {this.setState({month:e.target.value})};
    handleYearChange = (e) => {this.setState({year:e.target.value})};
    handlePriviuseValue = (e) => {this.setState({priviuseValue: +e.target.value}, this.handleSumCost)};
    handleCurrentValue = (e) => {this.setState({currentValue: +e.target.value}, this.handleSumCost)};
    handleCostEach = (e) => {this.setState({costEach: +e.target.value}, this.handleSumCost)};
    handlePaid = (e) => {this.setState({paid: e.target.checked})};
    handleSumCost = () => {if (!this.state.currentValue || !this.state.costEach) return;
                           this.setState((prevState)=>( {sumCost: (prevState.currentValue - prevState.priviuseValue)* prevState.costEach}))};

    sendData = () => {fetch(`insert?data=${JSON.stringify({[this.props.bill.categoryName]: this.state})}`, {method: "POST"})};


    render() {
        const {bill} = this.props;
        this.months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
        this.years =[];
        for(let i = 2015;i<2126;i++){this.years.push(i + '')};
        return(
            <div className = 'my-4 border border-secondary '>
                <div>
                    <span>Вибрати місяць оплати: </span><select value={this.state.month} onChange={this.handleMonthChange}>{this.months.map((month)=><option value={month} key = {month}>{month}</option>)}</select>
                    <select value={this.state.year} onChange={this.handleYearChange}>{this.years.map((year)=><option value={year} key = {year}>{year}</option>)}</select>
                </div>
            <div className="border border-secondary my-2 p-4">
              <h1>{bill.title}</h1>
              <table className= 'card-text'>
              <tbody>
                {bill.categoryName !== 'removalOfGarbage' &&
                bill.categoryName !== 'rent' ?
                    (
                        <tr className = 'valueInput'>
                            <td>Попередній показник:</td>
                            <td><input type='number'
                                       value = {this.priviuseValue}
                                       onChange = {this.handlePriviuseValue}
                                       className = 'all-inputs'/>
                            </td>
                        </tr> ) : null }
                <tr className = 'valueInput'>
                    <td>Поточний показник:</td>
                    <td><input type='number'
                               value = {this.currentValue}
                               onChange = {this.handleCurrentValue}
                               className = 'all-inputs' />
                    </td>
                </tr>

                <tr className = 'costInput'>
                    <td>Тариф:</td>
                    <td><input type='number'
                               value = {this.costEach}
                               onChange = {this.handleCostEach}
                               className = 'all-inputs' />
                    </td>
                </tr>
                <tr className = 'costInput'>
                    <td>Сума:</td>
                    <td>{this.state.sumCost}</td>
                </tr>
                <tr>
                    <td>Оплачено</td>
                    <td><input type='checkBox'
                               checked = {this.paid}
                               onChange={this.handlePaid}
                               className = 'all-inputs' />
                    </td>
                </tr>
                </tbody>
            </table>
          </div>
          <input type = 'button' className = ' btn-primary ' value= 'Додати' onClick ={this.sendData}/>
        </div>
        );
    }
}
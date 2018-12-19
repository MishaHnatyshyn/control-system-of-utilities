import React, { Component } from 'react';


export default class OneBill extends Component {
    constructor(props){
        super(props);
        this.state = {year: 'year', month: 'month',priviuseValue: '',currentValue: '', costEach: '', sumCost: '',paid: false};
    }
    handlePriviuseValue = (e) => {this.setState({priviuseValue: +e.target.value});this.handleSumCost()};
    handleCurrentValue = (e) => {this.setState({currentValue: +e.target.value});this.handleSumCost()};
    handleCostEach = (e) => {this.setState({costEach: +e.target.value}); this.handleSumCost()};
    handlePaid = (e) => {this.setState({paid: e.target.checked}); };
    handleSumCost = () => {if (!this.state.priviuseValue || !this.state.currentValue || !this.state.costEach) return;
                           this.setState((prevState)=>({sumCost: (prevState.currentValue - prevState.priviuseValue)* prevState.costEach}))};
    render() {
        const {bill} = this.props;
        return(
          <div className="jumbotron col-sm-6">
              <h1>{bill.title}</h1>
              <table>
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
                               onChange = {this.handleCurrentValue && this.handleSumCost}
                               className = 'all-inputs' />
                    </td>
                </tr>

                <tr className = 'costInput'>
                    <td>Тариф:</td>
                    <td><input type='number'
                               value = {this.costEach}
                               onChange = {this.handleCostEach && this.handleSumCost}
                               className = 'all-inputs' />
                    </td>
                </tr>
                <tr className = 'costInput'>
                    <td>Сума:</td>
                    <td>{this.sumCost}</td>
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
        );
    }
}
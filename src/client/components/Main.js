import React, { Component } from 'react';
import Bills from './Bills';
import OneBill from './OneBill';
import MonthOfPayment from './MonthOfPayment'
import {Route, Switch} from "react-router-dom"

export default class Main extends Component {
    render(){

        return(
            <main className = 'col-sm-9'>

                <Switch >
                    <Route exact path = '/Bills' render={(props) =>
                        (<Bills {...props} bills={this.props.bills}/>)}/>
                    <Route path = '/gas' render={(props) => (<OneBill {...props} bill={this.props.bills[0]}/>)}/>
                    <Route path = '/electricity' render={(props) => (<OneBill {...props} bill={this.props.bills[1]}/>)}/>
                    <Route path = '/waterSupply' render={(props) => (<OneBill {...props} bill={this.props.bills[2]}/>)}/>
                    <Route path = '/sewage' render={(props) => (<OneBill {...props} bill={this.props.bills[3]}/>)}/>
                    <Route path = '/rent' render={(props) => (<OneBill {...props} bill={this.props.bills[4]}/>)}/>
                    <Route path = '/removalOfGarbage' render={(props) => (<OneBill {...props} bill={this.props.bills[5]}/>)}/>
                </Switch>

            </main>
        )
    }
}
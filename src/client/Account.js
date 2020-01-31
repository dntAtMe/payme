import React, { Component } from 'react';
import './common.css';
import history from './history';
import Home from './Home';
import {
    Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

  import Payment from './Account/Payment';
  import History from './Account/History';

export default class Account extends Component {

    render() {
        return (
            <Router history={history}>
            <div>
            <nav className="main">
                <ul>
                <li>
                    <Link to="/account/create">Create Account</Link>
                </li>
                <li>
                    <Link to="/account/payment">Payment</Link>
                </li>
                <li>
                    <Link to="/account/history">History</Link>
                </li>
                </ul>
            </nav>

            <Switch>
            <Route path="/account/payment" component={Payment} />
            <Route path="/account/history" component={History} />
            </Switch>
            </div>
        </Router>          
        );
    }
}
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

export default class Accounts extends Component {
    state = {accounts: [], succeded: true};


    componentDidMount() {
        console.log(this.props.token)
        const ret = fetch('/api/accounts', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': this.props.token,
            }
          })
        .then((response) => {console.log(response); return response.json(); })
        .then((json) => { console.log(json); this.setState({accounts: json}); })
        .catch((err) => console.log(err));

        console.log('ret: ' + ret);
        if (ret != -1)
        {
            console.log(ret);
        }
        else
        {
            console.log(ret);
        }
        console.log(this.state.accounts)
    }

    render() {
        let arr = [];
        for (let i in this.state.accounts) {
            arr.push(
                <li>
                <Link to={{pathname: '/account/' + this.state.accounts[i].id, id: this.state.accounts[i].id, number: this.state.accounts[i].number }} >Account {this.state.accounts[i].number} Balance: {this.state.accounts[i].amount}</Link>
                </li>
            );
        }

        console.log(arr);
        console.log(this.state.accounts.size);
        return (
            <Router history={history}>
            <div>
            <nav className="main">
                <ul>
                { }
                <li>
                    <Link to="/accounts/create">Create Account</Link>
                </li>
                {arr}
                </ul>
            </nav>

            <Switch>
            <Route path="/accounts/payment" component={Payment} />
            <Route path="/accounts/history" component={History} />
            </Switch>
            </div>
        </Router>          
        );
    }
}
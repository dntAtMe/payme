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
    state = {
        id: -1
    };

    componentDidMount() {
        this.setState({
            id: this.props.match.params.id,
            number: this.props.location.number
            
        });
    }

    render() {
        console.log(this.props.location.id);
        console.log(this.props.location.number);
        return (
            <Router history={history}>
            <div>
            <nav className="main">
                <ul>
                <li>
                    <Link to={{ pathname: "payment"}}>Payment</Link>
                </li>
                <li>
                    <Link to={{ pathname:  "history"}}>History</Link>
                </li>
                </ul>
            </nav>

            <Switch>
                <Route
                    path='/account/history'
                    render={(props) => <History {...props} token={this.props.token} id={this.state.id} number={this.state.number}/>}
                />            
                <Route
                    path='/account/payment'
                    render={(props) => <Payment {...props} token={this.props.token} id={this.state.id} number={this.state.number} />}
                />
            </Switch>
            </div>
        </Router>          
        );
    }
}
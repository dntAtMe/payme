import React, { Component } from 'react';
import '../common.css';
import history from '../history';

export default class History extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.fetchHistory = this.fetchHistory.bind(this);
        this.onChargeback = this.onChargeback.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);

        this.state = {
            payments: [],
            showIncome: false,
            search: ''
        };
    }


    fetchHistory() {
        console.log(this.props.token)
        console.log(this.props.id)
        let link = '/api/payments' + ( this.state.search === '' ? '' : 'f');
        if (this.state.showIncome) {
            link = '/api/incomes' + ( this.state.search === '' ? '' : 'f');
        }
        const ret = fetch(link, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': this.props.token,
            },
            body: JSON.stringify({
                account: this.props.id,
                filter: this.state.search
            })
          })
        .then((response) => {console.log(response); return response.json(); })
        .then((json) => { console.log(json); this.setState({payments: json}); })
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
        console.log(this.state.payments)
    }

    componentDidMount() {
        
        this.fetchHistory();
    }

    onChargeback(e) {
        const paymentId = e.target.id;
        console.log(e.target)
        console.log(this.props.token)
        console.log(this.props.id)
        const ret = fetch('/api/chargeback', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': this.props.token,
            },
            body: JSON.stringify({
                source: this.props.id,
                payment: paymentId
            })
          })
        .then((response) => {console.log(response); return response.json(); })
        .then((json) => { console.log(json); this.setState({test: 'b'}); })
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

    }

    onSearchChange(e) {
        console.log(this.props.token)
        console.log(this.props.id)
        let link = '/api/payments' + ( e.target.value === '' ? '' : 'f');
        if (this.state.showIncome) {
            link = '/api/incomes' + ( e.target.value === '' ? '' : 'f');
        }
        const ret = fetch(link, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': this.props.token,
            },
            body: JSON.stringify({
                account: this.props.id,
                filter: e.target.value
            })
          })
        .then((response) => {console.log(response); return response.json(); })
        .then((json) => { console.log(json); this.setState({payments: json}); })
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
        console.log(this.state.payments)
        this.setState({search: e.target.value}); 

    }

    onClick() {
        var income = !this.state.showIncome;
        console.log(this.props.token)
        console.log(this.props.id)
        let link = '/api/payments' + ( this.state.search === '' ? '' : 'f');
        if (this.state.showIncome) {
            link = '/api/incomes' + ( this.state.search === '' ? '' : 'f');
        }
        const ret = fetch(link, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': this.props.token,
            },
            body: JSON.stringify({
                account: this.props.id,
                filter: this.state.search
            })
          })
        .then((response) => {console.log(response); return response.json(); })
        .then((json) => { console.log(json); this.setState({payments: json}); })
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
        console.log(this.state.payments)
        this.setState({
            showIncome: income
        });
    }

    render() {
        let arr = []
        for (let payment in this.state.payments) {
            const pm = this.state.payments[payment];
            console.log(pm)
            arr.push(
                <li>
                    {pm.account_from} {pm.account_to} {pm.title} {pm.amount} {pm.status} {pm.date.slice(0,10)} {pm.status === 'Done' ? <button id={''+pm.id} onClick={this.onChargeback}>Chargeback</button> : <div />}
                </li>
            );
        }
        return (
            <div className="main">
                <input type="text" name="search" value={this.state.search} onChange={this.onSearchChange} />
                <button onClick={this.onClick}>{this.state.showIncome ? 'Outcome' : 'Income'}</button>
                <ul>
                    {arr}
                </ul>
            </div>
        );
    }
}
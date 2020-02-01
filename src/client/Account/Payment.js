import React, { Component } from 'react';
import '../common.css';
import history from '../history';
import MultiSelect from "@khanacademy/react-multi-select";

let errorHappened = false;

export default class Payment extends Component {
    constructor(props) {
        super(props);


        this.handleAccFChange = this.handleAccFChange.bind(this);
        this.handleAccTChange = this.handleAccTChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChoice = this.onChoice.bind(this);
    }
    state = {
        acc_from: this.props.number,
        title: '',
        numbers: [],
        selected: []
    };

    handleAccFChange(event) {
        this.setState({acc_from: event.target.value});
    }

    handleAccTChange(event) {
        this.setState({acc_to: event.target.value});
    }

    handleAmountChange(event) {
        this.setState({amount: event.target.value});
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value});
    }

    onChoice(e) {
        console.log(e.target.val)
    }


    onSubmit() {
        errorHappened = false;
        console.log("ok")

        console.log(this.props.token)
        console.log(this.props.number)
        console.log(this.props.id)
        const ret = fetch('/api/payment', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': this.props.token,
            },
            body: JSON.stringify({
                source : this.state.acc_from, 
                amount : this.state.amount, 
                title : this.state.title,
                array : this.state.selected.join(',')
            })
          })
        .then((response) => {console.log(response); return response.json(); })
        .then((json) => { console.log(json); this.setState({payments: json}); })
        .catch((err) => {console.log(err); errorHappened = true; });


        console.log('ret: ' + errorHappened);
        if (ret != -1)
        {
            console.log(ret);
        }
        else
        {
            console.log(ret);
        }
    }

    componentDidMount() {
        const ret = fetch('/api/allaccounts', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': this.props.token,
            },
            body: JSON.stringify({
                account: this.props.number
            })
          })
        .then((response) => {console.log(response); return response.json(); })
        .then((json) => { console.log(json); this.setState({numbers: json}); })
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

    render() {
        let proper = []
        for (let number in this.state.numbers) {
            proper.push({label: this.state.numbers[number].number, value: this.state.numbers[number].number})
        }
        console.log(this.state.selected)
        console.log(this.state.numbers)
        return (
            <div className='main'>
                <input type="text" name="acc_from" value={this.state.acc_from} disabled />
                <MultiSelect
                options={proper}
                selected={this.state.selected}
                onSelectedChanged={selected => this.setState({selected})}
                />
                <input type="text" name="amount" value={this.state.amount} onChange={this.handleAmountChange} />
                <input type="text" name="title" value={this.state.title} onChange={this.handleTitleChange} />
                <button onClick={() => this.onSubmit()}>Pay</button>
                {(errorHappened ? <div>Try again!</div> : <div/>)}
            </div>
        );
    }
}
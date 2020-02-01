import React, { Component } from 'react';
import './app.css';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePass = this.handlePass.bind(this);
    }

    handleEmail(e) {
        this.setState({email: event.target.value});
    }

    handlePass(e) {
        this.setState({password: event.target.value});
    }
    
    state = {
        email: '',
        password: ''
    }

    render() {
        return (
            <div className='main'>
                <input type="text" name="email" value={this.state.remail} onChange={this.handleEmail} />
                <input type="password" name="password" value={this.state.password} onChange={this.handlePass} />
                
                <button onClick={() => this.props.onLogin(this.state.email, this.state.password)}>Login</button>
            </div>
        )
    }
}
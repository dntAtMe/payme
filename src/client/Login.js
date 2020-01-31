import React, { Component } from 'react';


export default class Login extends Component {

    render() {
        return (
            <div>
                <input></input>
                <input></input>
                <button onClick={() => this.props.onLogin('admin@admin.com', 'admin')}>Login</button>
            </div>
        )
    }
}
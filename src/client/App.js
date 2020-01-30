import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';

const onLoginPressed = async (email, password) => {
  let token = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    })
  })
    .then((response) => response.json())
    .then((json) => {return json.token});
    console.log(token);

  await fetch('/api/protected', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    }
  })
    .then((response) => response.json())
    .then((json) => console.log(json));

}

export default class App extends Component {
  state = { username: null, email: "admin@admin", password: "admin" };

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    const { username } = this.state;
    return (
      <div>
        <input></input>
        <input></input>
        <button onClick={() => onLoginPressed(this.state.email, this.state.password)}>Login</button>
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
        <img src={ReactImage} alt="react" />
      </div>
    );
  }
}

import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import Login from './Login';
import Home from './Home';
import Account from './Account';

import {
  Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import history from './history';

const PrivateRoute = ({ component: Component, isLoggedIn: IsLoggedIn, ...rest }) => (
  <Route {...rest} render={(props) => (
    IsLoggedIn 
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)

export default class App extends Component {
  state = { isLoggedIn: false };

  onLoginPressed = async (email, password) => {
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
      this.setState({token: 'Bearer ' + token})
  
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

  constructor(props) {
    super(props);

    this.loginHandler = this.loginHandler.bind(this);
  }

  loginHandler(isLoggedIn) {
    this.setState({
      isLoggedIn: isLoggedIn
    });
    history.push('/account');
  }

  componentDidMount() {
    //fetch('/api/getUsername')
    //  .then(res => res.json())
    //  .then(user => this.setState({ username: user.username }));
  }

  render() {
    return (
      <Router history={history}>
        <div>
          <nav className="sidenav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
              { this.state.isLoggedIn ? 
                <Link to="/logout">Logout</Link>
                :
                <Link to="/login">Login</Link>
              }
              </li>
              { this.state.isLoggedIn ? 
                <li>
                  <Link to="/account">Account</Link>
                </li>
                : <div />
              }
            </ul>
          </nav>

          <Switch>
            <Route path="/login">
              <Login onLogin={this.onLoginPressed} />
            </Route>
            <PrivateRoute path="/account" component={Account} isLoggedIn={this.state.isLoggedIn} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>  
    );
  }
}


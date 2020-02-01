import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import Login from './Login';
import Home from './Home';
import Accounts from './Accounts';
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
      : <Redirect to='/' />
  )} />
)

export default class App extends Component {
  state = { isLoggedIn: false, token: '', isAdmin: 0};

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
      .then((response) => { if (response.status != 401) return response.json(); })
      .then((json) => {return json.token});
    this.setState({
      token: 'Bearer ' + token,
      isLoggedIn: true
    });
    console.log(this.state.token);

    console.log(this.props.token)
    const ret = fetch('/api/privileges', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.token,
        }
      })
    .then((response) => {console.log(response); return response.json(); })
    .then((json) => { console.log(json); this.setState({isAdmin: json}); })
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
    console.log("isAdmin: " + this.state.isAdmin);
    history.push('/');

  }

  onSaveBackup() {
    console.log(this.state.token)
    const ret = fetch('/api/savebackup', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.token,
        }
      })
    .then((response) => {console.log(response); return response.json(); })
    .then((json) => { console.log(json);  })
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

  onLoadBackup() {
    console.log(this.state.token)
    const ret = fetch('/api/loadbackup', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.token,
        }
      })
    .then((response) => {console.log(response); return response.json(); })
    .then((json) => { console.log(json);  })
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

  constructor(props) {
    super(props);

    this.onLoadBackup = this.onLoadBackup.bind(this);
    this.onSaveBackup = this.onSaveBackup.bind(this);
  }

  componentDidMount() {
    
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
                { this.state.isLoggedIn ? 
                               <li>
                               <Link to="/accounts">Accounts</Link>              </li>
                  : <div />
                }

              { this.state.isLoggedIn ? 
            <div><button onClick={this.onSaveBackup}>Save Backup</button>
            <button onClick={this.onLoadBackup}>Load Backup</button></div>
                :
                <li><Link to="/login">Login</Link></li>
              }

            </ul>
          </nav>

          <Switch>
            <Route path="/login">
              <Login onLogin={this.onLoginPressed} />
            </Route>
            <Route
              path='/accounts'
              render={(props) => <Accounts {...props} token={this.state.token} />}
            />
            <Route
              path='/account/:id'
              render={(props) => <Account {...props} token={this.state.token} />}
            />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>  
    );
  }
}


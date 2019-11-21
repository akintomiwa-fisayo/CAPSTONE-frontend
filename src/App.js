/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import SignIn from './components/SignIn';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionUser: false,
    };

    this.startUserSession = this.startUserSession.bind(this);
  }

  startUserSession(sessionUser) {
    this.setState(() => ({ sessionUser }));
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route
              path="/signin"
              render={(props) => <SignIn {...props} startUserSession={this.startUserSession} />}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

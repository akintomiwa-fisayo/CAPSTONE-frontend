import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import CreateUser from './CreateUser';
import Feed from './Feed';
import lib from '../js/lib';
import '../css/maincontentblock.css';

class MainContentBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageComp: '',
    };
    this.pageSwitch = this.pageSwitch.bind(this);
  }

  pageSwitch(page) {
    this.setState(() => ({ pageComp: page }));
  }

  render() {
    const { pageComp } = this.state;

    const userName = `${this.props.sessionUser.firstName} ${this.props.sessionUser.lastName}`;
    return (
      <main id="mainContentBlock" data-comp={pageComp}>
        <div id="contentHeader">
          <h1 className="page">{lib.sepCamelWord(this.state.pageComp)}</h1>
          <div className="user-info">
            <h3 className="name">{userName}</h3>
            <div className="passport">
              <img src={this.props.sessionUser.passportUrl} alt={userName} />
            </div>
          </div>
        </div>
        <div className="container">
          <Route
            path="/create-user"
            render={(props) => (<CreateUser {...props} pageSwitch={this.pageSwitch} />)}
          />
          <Route
            path="/feed"
            render={(props) => <Feed {...props} pageSwitch={this.pageSwitch} />}
          />
          <Route
            path="/"
            exact
            render={(props) => <Feed {...props} pageSwitch={this.pageSwitch} />}
          />
        </div>
      </main>
    );
  }
}

MainContentBlock.propTypes = {
  history: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
};
export default MainContentBlock;

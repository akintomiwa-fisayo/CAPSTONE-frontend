import React from 'react';
import PropTypes from 'prop-types';
import NavBlock from './NavBlock';
import MainContentBlock from './MainContentBlock';
import UpdatesBlock from './UpdatesBlock';
import lib from '../js/lib';
import '../css/home.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionUser: {},
      loading: true,
    };
    this.getUser = this.getUser.bind(this);
    this.getSessionUser = this.getSessionUser.bind(this);
    this.getSessionUser();
  }

  getSessionUser() {
    const sessionUserId = localStorage.getItem('sessionUserId');
    this.getUser(sessionUserId).then((user) => {
      this.setState(() => ({ sessionUser: user, loading: false }));
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getUser(userId) {
    // Fetch user's details
    const errorHandler = ({ message: error }) => {
      if (error === 'Unauthorized') {
        const { history } = this.props;
        history.push('/signin');
      } else {
        lib.popMessage(
          navigator.onLine
            ? 'oops! there was a server error'
            : "can't connect to serve because you are offline, will retry in 5 seconds",
        );
        setTimeout(() => {
          lib.popMessage('retrying to connect to server');
          this.getUser(userId);
        }, 5000);
      }
    };

    return new Promise((resolve) => {
      const sessionUserToken = localStorage.getItem('sessionUserToken');
      if (!lib.isEmpty(userId) && !lib.isEmpty(sessionUserToken)) {
        fetch(`https://akintomiwa-capstone-backend.herokuapp.com/users/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionUserToken}`,
          },
        }).then((res) => res.json()).then((res) => {
          if (res.status === 'success') {
            const { data: user } = res;
            resolve(user);
          } else errorHandler(res.error);
        }).catch(({ error }) => { errorHandler(error); });
      } else errorHandler(new Error('Unauthorized'));
    });
  }

  render() {
    if (this.state.loading === false) {
      return (
        <div id="pageContent" data-page="application">
          <NavBlock {...this.props} sessionUser={this.state.sessionUser} />
          <MainContentBlock
            {...this.props}
            sessionUser={this.state.sessionUser}
            getUser={this.getUser}
          />
          <UpdatesBlock />
        </div>
      );
    }
    return (<div id="pageContent" className="loading" data-page="application" />);
  }
}
Home.propTypes = {
  history: PropTypes.object.isRequired,
};
export default Home;

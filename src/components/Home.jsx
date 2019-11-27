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

    this._isMounted = false;
    this.getUser = this.getUser.bind(this);
    this.fetchRequest = this.fetchRequest.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const sessionUserId = localStorage.getItem('sessionUserId');
    this.getUser(sessionUserId).then((user) => {
      if (this._isMounted) {
        this.setState(() => ({ sessionUser: user, loading: false }));
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
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
          } else errorHandler(new Error(res.error));
        }).catch((error) => {
          errorHandler(error);
        });
      } else errorHandler(new Error('Unauthorized'));
    });
  }

  fetchRequest(params = {
    method: 'GET',
    body: {},
    headers: {},
  }) {
    return new Promise((resolve, reject) => {
      // make custom fetch request
      /* params{
            endpoint : String,
            method: String,
            headers : Object
          }
           */
      const sessionUserToken = localStorage.getItem('sessionUserToken');
      const retry = () => {
        setTimeout(() => {
          lib.popMessage('retrying to connect to server');
          this.fetchRequest(params).then(resolve).catch(reject);
        }, 5000);
      };
      const errorHandler = (error) => {
        const { message: errorText, status } = error;
        if (errorText === 'Unauthorized') {
          const { history } = this.props;
          history.push('/signin');
        } else if (status === 500) {
          lib.popMessage('oops! there was a server error');
          retry();
        } else if (!navigator.onLine) {
          lib.popMessage("can't connect to serve because you are offline, will retry in 5 seconds");
          retry();
        } else {
          reject(error);
        }
      };

      if (!lib.isEmpty(sessionUserToken)) {
        let fetchResponse = null;
        fetch(params.endpoint, {
          method: params.method,
          body: params.body,
          headers: {
            ...params.headers,
            Authorization: `Bearer ${sessionUserToken}`,
          },
        }).then((res) => {
          fetchResponse = res;
          return res.json();
        }).then((res) => {
          if (res.status === 'success') {
            const { data } = res;
            resolve(data);
          } else {
            const error = new Error(fetchResponse.statusText);
            error.status = fetchResponse.status;
            error.body = res.error;
            errorHandler(error);
          }
        }).catch((error) => {
          errorHandler(error);
        });
      } else {
        const error = new Error('Unauthorized');
        error.status = 401;
        errorHandler(error);
      }
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
            fetchRequest={this.fetchRequest}
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

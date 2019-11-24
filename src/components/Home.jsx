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
      loading: false,
    };

    // Fetch user's details
    const sessionUserToken = localStorage.getItem('sessionUserToken');
    const sessionUserId = localStorage.getItem('sessionUserId');
    const { history } = this.props;
    try {
      if (!lib.isEmpty(sessionUserId) && !lib.isEmpty(sessionUserToken)) {
        fetch(`https://akintomiwa-capstone-backend.herokuapp.com/users/${sessionUserId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionUserToken}`,
          },
        }).then((res) => {
          if (res.status === 200) return res.json();
          throw new Error(res.status);
        }).then(({ data: user }) => {
          // update user's details
          this.setState(() => ({ sessionUser: user, loading: false }));
        }).catch(() => {
          // if (navigator.onLine){
          history.push('/signin');
          // }
        });
      } else throw Error;
    } catch (error) {
      // history.push('/signin');
    }
  }

  render() {
    return (
      <div id="pageContent" className={this.state.loading === true ? 'loading' : ''} data-page="application">
        <NavBlock {...this.props} sessionUser={this.state.sessionUser} />
        <MainContentBlock {...this.props} sessionUser={this.state.sessionUser} />
        <UpdatesBlock />
      </div>
    );
  }
}
Home.propTypes = {
  history: PropTypes.object.isRequired,
};
export default Home;

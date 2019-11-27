/* eslint-disable react/no-unused-state */
import React from 'react';
import PropTypes from 'prop-types';
import '../css/feed.css';
import Post from './Post';

class UserGifs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gifs: [],
      loading: true,
    };

    this._isMounted = false;
    this.fetchRequest = this.props.fetchRequest;
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.mountProfileView('gifs');
    this.fetchRequest({
      endpoint: `https://akintomiwa-capstone-backend.herokuapp.com/users/${this.props.sessionUser.id}/gifs`,
    }).then((gifs) => {
      if (this._isMounted) {
        this.setState(() => ({ gifs, loading: false }));
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.loading) {
      return (<div><span className="loader fa fa-spinner fa-spin" /></div>);
    }

    const gifs = [];
    const gifsArr = this.state.gifs;
    for (let i = 0; i < gifsArr.length; i += 1) {
      gifs.push(<Post {...this.props} post={{ ...gifsArr[i], type: 'gif' }} key={gifsArr[i].id} />);
    }

    return (
      <div>{gifs}</div>
    );
  }
}
UserGifs.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
  mountProfileView: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
};

export default UserGifs;

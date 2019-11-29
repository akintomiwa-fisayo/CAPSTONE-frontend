import React from 'react';
import '../css/error.css';
import PropTypes from 'prop-types';

class Error extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <div id="errorPage">
        <span role="img" className="icon">😕</span>
        <h1>4** Error</h1>
        <p>This page those not exist or you don't have access to it</p>
        <button
          type="button"
          className="btn"
          onClick={() => {
            history.push('/feed');
          }}
        >Go back feed
        </button>
      </div>
    );
  }
}

Error.propTypes = {
  history: PropTypes.object.isRequired,
};
export default Error;

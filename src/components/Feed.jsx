import React from 'react';
import PropTypes from 'prop-types';
import SharePost from './SharePost';
import Posts from './Posts';
import lib from '../js/lib';
import '../css/feed.css';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.props.pageSwitch('feed');
    console.log(props);
  }

  render() {
    return (
      <div id="feedPosts">
        <SharePost />
        <Posts />
      </div>
    );
  }
}
Feed.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
};

export default Feed;

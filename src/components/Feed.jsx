/* eslint-disable react/no-unused-state */
import PropTypes from 'prop-types';
import React from 'react';
import '../css/feed.css';
import lib from '../js/lib';
import Posts from './Posts';
import SharePost from './SharePost';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };

    this._isMounted = false;
    this.setPosts = this.setPosts.bind(this);
    this.registerPost = this.registerPost.bind(this);
    this.getPosts = this.getPosts.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.pageSwitch('feed');
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setPosts(posts) {
    this.setState(() => ({ posts }));
  }

  getPosts() {
    return this.state.posts;
  }

  registerPost(pst) {
    this.props.getPost(pst).then((Post) => {
      if (this._isMounted) {
        this.setState((prevState) => {
          const post = { ...Post, type: pst.type, isNew: true };
          const { posts } = prevState;
          posts.unshift(post);
          return { posts };
        });
      }
    }).catch((error) => {
      if (error === 'Unauthorized') {
        const { history } = this.props;
        history.push('/signin');
      } else {
        lib.popMessage(
          navigator.onLine
            ? "can't connect to serve because you are offline, will retry in 5 seconds"
            : 'oops! there was a server error',
        );
        setTimeout(() => {
          lib.popMessage('retrying to connect to server');
          if (this._isMounted) this.registerPost();
        }, 5000);
      }
    });
  }

  render() {
    return (
      <div id="feedPosts">
        <SharePost {...this.props} registerPost={this.registerPost} />
        <Posts
          {...this.props}
          setPosts={this.setPosts}
          getPosts={this.getPosts}
        />
      </div>
    );
  }
}
Feed.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
};

export default Feed;

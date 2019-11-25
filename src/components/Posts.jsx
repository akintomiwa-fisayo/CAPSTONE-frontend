import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post';
import lib from '../js/lib';
import '../css/posts.css';
import '../css/post.css';

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };

    const getPosts = () => {
      // Get all posts
      const sessionUserToken = localStorage.getItem('sessionUserToken');
      const sessionUserId = localStorage.getItem('sessionUserId');
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
            getPosts();
          }, 5000);
        }
      };

      if (!lib.isEmpty(sessionUserId) && !lib.isEmpty(sessionUserToken)) {
        fetch('https://akintomiwa-capstone-backend.herokuapp.com/feed', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionUserToken}`,
          },
        }).then((res) => res.json()).then((res) => {
          if (res.status === 'success') {
            // save posts
            const { data: posts } = res;
            this.props.setPosts(posts);
            this.setState(() => ({ loading: false }));
          } else errorHandler(res.error);
        }).catch((error) => { errorHandler(error); });
      } else errorHandler(new Error('Unauthorized'));
    };

    getPosts();
  }

  render() {
    const posts = [];
    const postsArr = this.props.getPosts();
    for (let i = 0; i < postsArr.length; i += 1) {
      posts.push(<Post
        post={postsArr[i]}
        key={postsArr[i].id}
        getUser={this.props.getUser}
      />);
    }

    return (
      <div id="posts" className={this.state.loading ? 'loading' : ''}>
        {posts}
      </div>
    );
  }
}

Posts.propTypes = {
  history: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  setPosts: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
};


export default Posts;

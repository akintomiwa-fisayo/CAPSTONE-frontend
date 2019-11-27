import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post';
import lib from '../js/lib';
import '../css/posts.css';


class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    console.log('    this._isMounted is     ', this._isMounted);
    const fetchPosts = () => {
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
            fetchPosts();
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
          if (this._isMounted === true) {
            if (res.status === 'success') {
            // save posts
              const { data: posts } = res;
              this.props.setPosts(posts);
              this.setState(() => ({ loading: false }));
            } else errorHandler(new Error(res.error));
          }
        }).catch((error) => { errorHandler(error); });
      } else errorHandler(new Error('Unauthorized'));
    };

    fetchPosts();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const posts = [];
    if (this._isMounted === true) {
      const postsArr = this.props.getPosts();
      for (let i = 0; i < postsArr.length; i += 1) {
        posts.push(<Post
          {...this.props}
          post={postsArr[i]}
          key={postsArr[i].id}
        />);
      }
      return (
        <div id="posts" className={this.state.loading ? 'loading' : ''}>
          {posts}
        </div>
      );
    }
    return (<div />);
  }
}

Posts.propTypes = {
  history: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  setPosts: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
};


export default Posts;

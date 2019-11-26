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
    this.setPosts = this.setPosts.bind(this);
    this.registerPost = this.registerPost.bind(this);
    this.Posts = this.Posts.bind(this);
    this.getPost = this.getPost.bind(this);

    this.props.pageSwitch('feed');
  }

  // eslint-disable-next-line class-methods-use-this
  getPost(pst) {
    // Get a specific post
    const sessionUserToken = localStorage.getItem('sessionUserToken');
    const post = {
      id: pst.type === 'gif' ? pst.gifId : pst.articleId,
      endpoint: pst.type === 'gif' ? 'gifs' : 'articles',
    };

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
          this.getPost(pst);
        }, 5000);
      }
    };

    return new Promise((resolve) => {
      if (!lib.isEmpty(sessionUserToken)) {
        fetch(`https://akintomiwa-capstone-backend.herokuapp.com/${post.endpoint}/${post.id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionUserToken}`,
          },
        }).then((res) => res.json()).then((res) => {
          if (res.status === 'success') {
            const { data: Post } = res;
            resolve(Post);
          } else errorHandler(new Error(res.error));
        }).catch(({ error }) => { errorHandler(error); });
      } else errorHandler(new Error('Unauthorized'));
    });
  }

  setPosts(posts) {
    this.setState(() => ({ posts }));
  }

  Posts() {
    const This = this;
    return ({
      getById: (id) => {
        let post = null;
        for (let i = 0; i < This.state.posts.length; i += 1) {
          post = This.state.posts[i];
          if (post.id === id) {
            return { post, index: i };
          }
        }
        return false;
      },
      getAll() {
        return This.state.posts;
      },
    });
  }

  registerPost(pst) {
    this.getPost(pst).then((Post) => {
      this.setState((prevState) => {
        const post = { ...Post, type: pst.type, isNew: true };
        const { posts } = prevState;
        posts.unshift(post);
        return { posts };
      });
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
          this.registerPost();
        }, 5000);
      }
    });
  }

  render() {
    return (
      <div id="feedPosts">
        <SharePost history={this.props.history} registerPost={this.registerPost} />
        <Posts
          {...this.props}
          setPosts={this.setPosts}
          getPosts={() => this.Posts().getAll()}
        />
      </div>
    );
  }
}
Feed.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
};

export default Feed;

import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post';
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

    const fetchPosts = () => {
      // Get all posts
      const { fetchRequest } = this.props;
      fetchRequest({
        endpoint: 'https://akintomiwa-capstone-backend.herokuapp.com/feed',
      }).then((posts) => {
        if (this._isMounted === true) {
          // save posts
          this.props.setPosts(posts);
          this.setState(() => ({ loading: false }));
        }
      });
    };
    fetchPosts();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const posts = [];
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
}

Posts.propTypes = {
  history: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  setPosts: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
};


export default Posts;

import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';

/*  const articlePost = {
  id: 112,
  createdOn: '2019-11-24T15:14:27.390Z',
  authorId: 1035,
  title: 'the title ',
  article: 'the content',
  type: 'article',
};
const gifPost = {
  id: 104,
  createdOn: '2019-11-24T04:51:15.524Z',
  authorId: 1035,
  title: 'senior web developer',
  url: 'https://res.cloudinary.com/capstone-backend/image/upload/v1574571074/xmgm4og246uwjq0g4bgd.gif',
  type: 'gif',
}; */


class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        ...this.props.post,
        author: null,
        dateTimeRef: '',
      },
    };

    this.getAuthor = this.getAuthor.bind(this);
    this.getAuthor();
  }

  componentDidUpdate() {
    // Update post's reference time
    setInterval(() => {
      this.setState((prevState) => ({
        post: {
          ...prevState.post,
          dateTimeRef: lib.getRelativeTime(prevState.post.createdOn),
        },
      }));
    }, 60000); // 60 seconds (1 min)

    // unfocus new post
    if (this.state.post.isNew && this.state.post.isNew === true) {
      setTimeout(() => {
        this.setState((prevState) => ({
          post: {
            ...prevState.post,
            isNew: false,
          },
        }));
      }, 5000);
    }
  }


  getAuthor() {
    this.props.getUser(`${this.state.post.authorId}`).then((user) => {
      this.setState((prevState) => ({
        post: {
          ...prevState.post,
          author: user,
          dateTimeRef: lib.getRelativeTime(prevState.post.createdOn),
        },
      }));
    });
  }

  render() {
    const { post } = this.state;
    if (post.author !== null) {
      const content = post.type === 'gif' ? <img className="item" src={post.url} alt="" /> : <div className="item">{post.article}</div>;
      return (
        <div
          className={`post ${post.isNew && post.isNew === true ? 'new' : ''}`}
          id={post.id}
          data-type={post.type}
        >
          <div className="head">
            <div className="user-image">
              <a href="/">
                <img
                  src={post.author.passportUrl}
                  alt={`${post.author.firstName} ${post.author.lastName}`}
                />
              </a>
            </div>
            <div>
              <a
                href="/"
                className="user-name"
                title=""
              >{`${post.author.firstName} ${post.author.lastName}`}
              </a>
              <p
                className="date-time"
                data-timestamp={post.createdOn}
                title={lib.getRelativeTime(post.createdOn, false)}
              >{post.dateTimeRef}
              </p>
            </div>
            <span className="more-action">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </span>
          </div>

          <div className="body">
            <div className="title">{post.title}</div>
            <div className="content">
              {content}
            </div>
          </div>
          <button type="button" className="add-comment">
            <span className="far fa-comment-dots icon" />
          comments
          </button>
        </div>
      );
    }
    return (<div />);
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  // history: PropTypes.object.isRequired,
};

export default Post;

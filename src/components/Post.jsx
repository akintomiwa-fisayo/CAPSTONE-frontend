import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';
import AddComment from './AddComment';
import Comment from './Comment';
import '../css/post.css';


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
        userComment: '',
      },
    };

    this._isMounted = false;
    this.updatePostDateTimeRef = null;
    this.getAuthor = this.getAuthor.bind(this);
    this.viewPost = this.viewPost.bind(this);
    this.registerComment = this.registerComment.bind(this);
  }


  componentDidMount() {
    this._isMounted = true;
    // Update post's reference time
    this.getAuthor().then(() => {
      this.updatePostDateTimeRef = setInterval(() => {
        if (this._isMounted) {
          this.setState((prevState) => ({
            post: {
              ...prevState.post,
              dateTimeRef: lib.getRelativeTime(prevState.post.createdOn),
            },
          }));
        }
      }, 60000); // 60 seconds (1 min)

      // unfocus new post
      if (this.state.post.isNew && this.state.post.isNew === true) {
        setTimeout(() => {
          if (this._isMounted) {
            this.setState((prevState) => ({
              post: {
                ...prevState.post,
                isNew: false,
              },
            }));
          }
        }, 5000);
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.updatePostDateTimeRef);
  }

  getAuthor() {
    return new Promise((resolve) => {
      this.props.getUser(`${this.state.post.authorId}`).then((user) => {
        if (this._isMounted) {
          this.setState((prevState) => ({
            post: {
              ...prevState.post,
              author: user,
              dateTimeRef: lib.getRelativeTime(prevState.post.createdOn),
            },
          }));
          resolve();
        }
      });
    });
  }

  registerComment(comment) {
    this.setState((prevState) => ({
      post: {
        ...prevState.post,
        comments: [
          ...prevState.post.comments,
          comment,
        ],
      },
    }));
  }

  viewPost() {
    const { getCurrentPage } = this.props;
    const { post } = this.state;
    if (getCurrentPage() !== 'post') this.props.history.push(`/post/${post.type}/${post.id}`);
  }

  render() {
    const currentPage = this.props.getCurrentPage();

    let comments = null;
    if (currentPage === 'post') {
      const commentsArr = this.state.post.comments;
      comments = [];

      for (let i = 0; i < commentsArr.length; i += 1) {
        comments.push(<Comment
          {...this.props}
          comment={commentsArr[i]}
          key={commentsArr[i].commentId}
        />);
      }
    } else {
      comments = (
        <button type="button" className="view-comment" title="view comments">
          <span className="far fa-comment-dots icon" />
          comments
        </button>
      );
    }
    const { post } = this.state;
    if (post.author !== null) {
      const content = post.type === 'gif' ? <img className="item" src={post.url} alt="" /> : <div className="item">{post.article}</div>;
      return (
        <div
          className={`post ${post.isNew && post.isNew === true ? 'new' : ''} ${currentPage === 'post' ? 'view' : ''}`}
          id={post.id}
          data-type={post.type}
        >
          <div onClick={this.viewPost}>
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
            {comments}
          </div>
          <AddComment {...this.props} registerComment={this.registerComment} />
        </div>
      );
    }
    return (<div />);
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  getCurrentPage: PropTypes.func.isRequired,

};

export default Post;

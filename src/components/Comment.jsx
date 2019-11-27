import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';
import '../css/comment.css';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.comment,
      author: false,
      dateTimeRef: lib.getRelativeTime(this.props.comment.createdOn),
    };
    this._isMounted = false;
    this.updateCommentDatetimeRef = null;
  }

  componentDidMount() {
    this._isMounted = true;

    // Get comment author
    this.props.getUser(`${this.state.authorId}`).then((user) => {
      if (this._isMounted) {
        this.setState((prevState) => ({
          ...prevState,
          author: user,
        }));
        // Update comments's reference time
        this.updateCommentDatetimeRef = setInterval(() => {
          if (this._isMounted) {
            this.setState((prevState) => ({
              ...prevState.post,
              dateTimeRef: lib.getRelativeTime(prevState.createdOn),
            }));
          }
        }, 60000); // 60 seconds (1 min)
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.updateCommentDatetimeRef);
  }

  render() {
    if (this.state.author !== false) {
      return (
        <div className="post-comment" id={this.state.commentId}>
          <div>
            <div className="user-image">
              <a href="/">
                <img
                  src={this.state.author.passportUrl}
                  alt={`${this.state.author.firstName} ${this.state.author.lastName}`}
                />
              </a>
            </div>
            <div className="comment-details-container">
              <div className="comment-details">
                <div>
                  <span className="author-name">{`${this.state.author.firstName} ${this.state.author.lastName}`}</span>
                  <span className="content">{this.state.comment}</span>
                </div>
                <span className="more-action">
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </span>
              </div>
            </div>
          </div>
          <div>
            <div>
              <span title={lib.getRelativeTime(this.state.createdOn, false)}>
                {this.state.dateTimeRef}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div />
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
};
export default Comment;

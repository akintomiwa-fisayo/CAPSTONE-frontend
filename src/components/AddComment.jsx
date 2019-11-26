import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';


const defaultState = {
  comment: '',
  isfocused: false,
  submitting: false,
};

class AddComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;

    this.onCommentInput = this.onCommentInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.submitComment = this.submitComment.bind(this);
  }

  onCommentInput(event) {
    const { value } = event.target;
    this.setState(() => ({ comment: value }));
  }

  onFocus() {
    this.setState(() => ({
      isfocused: true,
    }));
  }

  onBlur() {
    this.setState(() => ({
      isfocused: false,
    }));
  }

  submitComment() {
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
          this.submitComment();
        }, 5000);
      }
    };

    if (!lib.isEmpty(this.state.comment)) {
      this.setState(() => ({ submitting: true }));
      const { post } = this.props;
      const path = post.type === 'gif' ? 'gifs' : 'articles';

      fetch(`https://akintomiwa-capstone-backend.herokuapp.com/${path}/${post.id}/comment`, {
        method: 'POST',
        body: `{
          "comment":"${this.state.comment}"
        }`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('sessionUserToken')}`,
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json()).then((res) => {
        if (res.status === 'success') {
          // save this.state
          this.setState(() => (defaultState));
          lib.popMessage('Comment created successfully');
        } else errorHandler(new Error(res.error));
      }).catch((error) => { errorHandler(error); })
        .finally(() => {
          this.setState(() => ({ submitting: false }));
        });
    }
  }


  render() {
    return (
      <div className={`add-comment ${this.state.submitting ? 'disabled' : ''}`}>
        <div className="user-image">
          <a href="/">
            <img
              src={this.props.sessionUser.passportUrl}
              alt={`${this.props.sessionUser.firstName} ${this.props.sessionUser.lastName}`}
            />
          </a>
        </div>
        <div className={`comment-input ${this.state.isfocused ? 'focused' : ''}`}>
          <input
            type="text"
            className="comment form-element"
            placeholder="input comment here"
            value={this.state.comment}
            onChange={this.onCommentInput}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
          <span className={`fas ${this.state.submitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'} icon submit-comment`} onClick={this.submitComment} />
        </div>
      </div>
    );
  }
}

AddComment.propTypes = {
  post: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default AddComment;

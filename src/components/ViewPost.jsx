import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';
import Post from './Post';

class ViewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: false,
    };

    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    this.props.pageSwitch('post', true);
    console.log('params are :', this.props.match.params);
    let pst = {
      type: this.props.match.params.type,
    };
    if (pst.type === 'gif') {
      pst.gifId = this.props.match.params.id;
    } else if (pst.type === 'article') {
      pst.articleId = this.props.match.params.id;
    } else {
      pst = false;
      lib.popMessage('remember to put error handler here TOO', 20000);
    }

    if (pst) {
      this.props.getPost(pst).then((postInfo) => {
        console.log('the gotten post is ', postInfo);
        if (this._isMounted) {
          console.log('view post and mounted is ', this._isMounted);
          this.setState(() => ({
            post: postInfo,
          }));
        }
      }).catch((error) => {
        if (error.status === 404) {
        // Call Error handler for when post is not foud
          console.log('we caughting the wewyrey', error.status);
          lib.popMessage('remember to put error handler here', 20000);
        } else {
          this.props.history.push('/');
          lib.popMessage('sorry we couldn\'t your request please try again');
        }
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    console.log(this.props);
    if (this.state.post === false) {
      return (<div style={{ textAlign: 'center', fontSize: '1.6em' }}><span className="fa fa-spinner fa-spin" /></div>
      );
    }
    return (
      <div>
        <Post {...this.props} post={{ ...this.state.post, type: this.props.match.params.type }} />
      </div>
    );
  }
}
ViewPost.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
export default ViewPost;

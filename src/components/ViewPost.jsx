import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import lib from '../js/lib';
import Post from './Post';
import PostEdit from './PostEdit';

class ViewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: false,
    };

    this._isMounted = false;
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

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
        if (this._isMounted) {
          this.setState(() => ({
            post: postInfo,
          }));
        }
      }).catch((error) => {
        if (error.status === 404) {
        // Call Error handler for when post is not foud
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

  onDelete() {
    lib.popMessage(`${this.props.match.params.type} deleted successfully`);
    const { history } = this.props;
    if (history.length > 2) {
      history.goBack();
    } else {
      history.push('/feed');
    }
  }

  render() {
    const url = this.props.match.path;
    if (this.state.post === false) {
      return (<div><span className="fa fa-spinner fa-spin loader" /></div>
      );
    }
    return (
      <div>
        <Switch>
          <Route
            path={`${url}/edit`}
            render={(props) => (
              <PostEdit
                {...this.props}
                {...props}
                post={{ ...this.state.post, type: this.props.match.params.type }}
              />
            )}
          />
          <Route
            path={`${url}/`}
            render={(props) => (
              <Post
                {...this.props}
                {...props}
                post={{ ...this.state.post, type: this.props.match.params.type }}
                onDelete={this.onDelete}
                preview
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}
ViewPost.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};
export default ViewPost;

/* eslint-disable react/no-unused-state */
import React from 'react';
import PropTypes from 'prop-types';
import '../css/feed.css';
import Post from './Post';

class UserArticles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
    };

    this._isMounted = false;
    this.fetchRequest = this.props.fetchRequest;
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.mountProfileView('articles');
    this.fetchRequest({
      endpoint: `https://akintomiwa-capstone-backend.herokuapp.com/users/${this.props.sessionUser.id}/articles`,
    }).then((articles) => {
      if (this._isMounted) {
        this.setState(() => ({ articles, loading: false }));
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.loading) {
      return (<div><span className="loader fa fa-spinner fa-spin" /></div>);
    }

    const articles = [];
    const articlesArr = this.state.articles;
    for (let i = 0; i < articlesArr.length; i += 1) {
      articles.push(<Post {...this.props} post={{ ...articlesArr[i], type: 'article' }} key={articlesArr[i].id} />);
    }

    return (
      <div>{articles}</div>
    );
  }
}
UserArticles.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
  mountProfileView: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  sessionUser: PropTypes.object.isRequired,
};

export default UserArticles;

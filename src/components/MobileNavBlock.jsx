import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../css/mobilenavblock.css';
import ChangePassword from './ChangePassword';
import UpdatesBlock from './UpdatesBlock';


class MobileNavBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMoreOptions: false,
      showNoticeBoard: false,
    };

    this.updatesBlock = false;
    this.changePasswordDialog = false;
    this.revealChangePassword = this.revealChangePassword.bind(this);
    this.hideChangePassword = this.hideChangePassword.bind(this);
    this.revealNoticeBoard = this.revealNoticeBoard.bind(this);
    this.hideNoticeBoard = this.hideNoticeBoard.bind(this);
    this.toogleMoreOptions = this.toogleMoreOptions.bind(this);
    this.blurMoreOptions = this.blurMoreOptions.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  signOut() {
    localStorage.removeItem('sessionUserToken');
    localStorage.removeItem('sessionUserId');
    this.props.history.push('/signin');
  }


  // eslint-disable-next-line class-methods-use-this
  revealChangePassword() {
    this.changePasswordDialog = (
      <div className="change-password-holder">
        <span className="cancel fas fa-times" onClick={this.hideChangePassword} />
        <ChangePassword {...this.props} />
      </div>
    );
    this.setState(() => ({
      showChangePassword: true,
      showMoreOptions: false,
    }));
  }

  hideChangePassword() {
    this.setState(() => ({
      showChangePassword: false,
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  revealNoticeBoard() {
    const headerHeight = document.querySelector('#contentHeader').offsetHeight;
    const mobileNavHeight = document.querySelector('#mobileNavBlock').offsetHeight;
    const h = headerHeight + mobileNavHeight;
    this.updatesBlock = (
      <UpdatesBlock
        styles={{
          height: `calc(100vh - ${h}px)`,
          top: headerHeight,
          display: 'block',
        }}
        preview
        onCancel={this.hideNoticeBoard}
      />
    );
    this.setState(() => ({
      showNoticeBoard: true,
      showMoreOptions: false,
    }));
  }

  hideNoticeBoard() {
    this.setState(() => ({
      showNoticeBoard: false,
    }));
  }

  toogleMoreOptions() {
    this.setState((prevState) => ({
      showMoreOptions: !prevState.showMoreOptions,
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  focusMoreOptions(moreOptions) {
    if (moreOptions) moreOptions.focus();
  }

  blurMoreOptions() {
    this.setState(() => ({
      showMoreOptions: false,
    }));
  }

  render() {
    const { sessionUser } = this.props;
    let createUser = '';
    let reports = '';
    if (sessionUser.isAdmin) {
      createUser = (
        <NavLink className="link" to="/create-user">
          <span className="icon fa fa-user-plus" />
        </NavLink>
      );

      reports = (
        <NavLink className="link" to="/reports">
          <span className="icon fa fa-bug" />
        </NavLink>
      );
    }

    const moreOptions = this.state.showMoreOptions ? (
      <button
        type="button"
        className="more-options"
        ref={this.focusMoreOptions}
        onBlur={this.blurMoreOptions}
      >
        <div className="option" onClick={this.revealNoticeBoard}>
          notice board
        </div>
        <div className="option" onClick={this.revealChangePassword}>
          change password
        </div>
        <div className="option" onClick={this.signOut}>
          sign out
        </div>
      </button>
    ) : '';
    const noticeBoard = this.state.showNoticeBoard ? this.updatesBlock : '';
    const changePassword = this.state.showChangePassword ? this.changePasswordDialog : '';
    return (
      <div id="mobileNavBlock">
        <div className="links">
          {createUser}
          {reports}
          <NavLink
            className="link"
            to="/feeds"
            isActive={(match, location) => {
              if (!match) {
                if (['', '/'].indexOf(location.pathname.toLowerCase()) !== -1) {
                  return true;
                }
                return false;
              }
              return true;
            }}
          >
            <span className="icon fas fa-layer-group" />
          </NavLink>
          <NavLink className="link" to="/profile">
            <span className="icon fa fa-user-circle" />
          </NavLink>
          <div className="link" onClick={this.toogleMoreOptions}>
            <span className="icon fas fa-ellipsis-h" />
          </div>
        </div>
        {moreOptions}
        {noticeBoard}
        {changePassword}
      </div>
    );
  }
}

MobileNavBlock.propTypes = {
  sessionUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default MobileNavBlock;

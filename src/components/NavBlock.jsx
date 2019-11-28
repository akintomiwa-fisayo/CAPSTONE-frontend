import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/navblock.css';
import ChangePassword from './ChangePassword';


class NavBlock extends React.Component {
  render() {
    return (
      <div id="navBlock">
        <span id="siteLogo">ignite</span>
        <div className="links">
          <NavLink className="link" to="/create-user">
            <span className="icon fa fa-user-plus" />
            create user
          </NavLink>
          <NavLink className="link" to="/reports">
            <span className="icon fa fa-bug" />
            reports
          </NavLink>
          <NavLink className="link" to="/feed">
            <span className="icon fa fa-spinner" />
            feed
          </NavLink>
          <NavLink className="link" to="/profile">
            <span className="icon fa fa-user-circle" />
            profile
          </NavLink>
          <NavLink className="link" to="/signin" exact>
            <span className="icon fa fa-sign-out-alt" />
            sign out
          </NavLink>
        </div>
        <hr />
        <div id="accountPreference">
          <span className="label"> change password</span>
          <ChangePassword {...this.props} />
        </div>
      </div>
    );
  }
}

export default NavBlock;

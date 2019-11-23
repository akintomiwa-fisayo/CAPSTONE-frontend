import React from 'react';
import { NavLink } from 'react-router-dom';
import lib from '../js/lib';
import '../css/navblock.css';


class NavBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      conPassword: {
        state: 'empty',
        value: '',
        focused: '',
        invalid: '',
      },
      newPassword: {
        state: 'empty',
        value: '',
        focused: '',
        invalid: '',
      },
    };

    this.regFieldInput = this.regFieldInput.bind(this);
    this.blurField = this.blurField.bind(this);
    this.focusField = this.focusField.bind(this);
    this.clickTofocusField = this.clickTofocusField.bind(this);
  }


  clickTofocusField(event) {
    const field = event.target.getAttribute('name');
    const fieldFocus = field === 'conPassword' ? this.state.conPassword.focused : this.state.newPassword.focused;
    if (fieldFocus !== 'focused') {
      const heroInput = lib.isDescendant(event.target, '.hero-input');
      heroInput.querySelector('.hero-input-field').focus();
    }
  }

  focusField(event) {
    const field = event.target.getAttribute('name');
    this.setState((prevState) => ((field === 'conPassword') ? {
      conPassword: { ...prevState.conPassword, focused: 'focused' },
    } : {
      newPassword: { ...prevState.newPassword, focused: 'focused' },
    }));
  }

  regFieldInput(event) {
    const field = event.target.getAttribute('name');
    if (field === 'conPassword' || field === 'newPassword') {
      const { value } = event.target;
      const fieldState = lib.isEmpty(value) ? 'empty' : 'filled';
      this.setState(() => ((field === 'conPassword') ? {
        conPassword: {
          state: fieldState,
          focused: 'focused',
          invalid: '',
          value,
        },
      } : {
        newPassword: {
          state: fieldState,
          focused: 'focused',
          invalid: '',
          value,
        },
      }));
    }
  }

  blurField(event) {
    const field = event.target.getAttribute('name');
    this.setState((prevState) => ((field === 'conPassword') ? {
      conPassword: { ...prevState.conPassword, focused: '' },
    } : {
      newPassword: { ...prevState.newPassword, focused: '' },
    }));
  }

  render() {
    return (
      <div id="navBlock">
        <span id="siteLogo">ignite</span>
        <div className="links">
          <NavLink className="link" to="/create-user">
            <span className="icon fa fa-user-plus" />
            create user
          </NavLink>
          <NavLink className="link" to="/">
            <span className="icon fa fa-bug" />
            reports
          </NavLink>
          <NavLink className="link" to="/feed">
            <span className="icon fa fa-spinner" />
            feed
          </NavLink>
          <NavLink className="link" to="/">
            <span className="icon fa fa-user-circle" />
            profile
          </NavLink>
          <NavLink className="link" to="/">
            <span className="icon fa fa-sign-out-alt" />
            sign out
          </NavLink>
        </div>
        <hr />
        <div id="accountPreference">
          <span className="label"> change password</span>
          <div id="changePassForm">
            <div
              className={`${this.state.newPassword.state} ${this.state.newPassword.focused} ${this.state.newPassword.invalid} hero-input form-element`}
              onClick={this.clickTofocusField}
              name="password"
            >
              <p className="hero-input-label">
                <span>new password</span>
              </p>
              <input type="password" name="newPassword" className="hero-input-field" onInput={this.regFieldInput} onBlur={this.blurField} onFocus={this.focusField} />
            </div>

            <div
              className={`${this.state.conPassword.state} ${this.state.conPassword.focused} ${this.state.conPassword.invalid} hero-input form-element`}
              onClick={this.clickTofocusField}
              name="conPassword"
            >
              <p className="hero-input-label">
                <span>confirm password</span>
              </p>
              <input type="password" name="conPassword" className="hero-input-field" onInput={this.regFieldInput} onBlur={this.blurField} onFocus={this.focusField} />
            </div>
            <button type="button" className={`btn ${this.state.submitting === true ? 'disabled' : ''} `}>submit</button>
          </div>
        </div>
      </div>
    );
  }
}

export default NavBlock;

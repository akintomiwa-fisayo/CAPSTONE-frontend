import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';
import '../css/createuser.css';

const $ = (query) => document.querySelector(query);
const JobRoles = {
  j1001: {
    name: 'administrator',
    departments: ['d1002'],
  },
  j1002: {
    name: 'director',
    departments: ['d1001', 'd1002', 'd1003', 'd1004', 'd1005'],
  },
};

const Departments = {
  d1001: 'sales',
  d1002: 'administration',
  d1003: 'finance',
  d1004: 'marketing',
  d1005: 'production',
};

const defaultStates = {
  submitting: false,
  passport: null,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  gender: '',
  jobRole: '',
  department: '',
  address: '',
  emailError: '',
  passwordError: '',
};

class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultStates;

    this.onJobRoleChange = this.onJobRoleChange.bind(this);
    this.onDepartmentChange = this.onDepartmentChange.bind(this);
    this.onGenderChange = this.onGenderChange.bind(this);
    this.regInputsState = this.regInputsState.bind(this);
    this.onDisplayChange = this.onDisplayChange.bind(this);
    this.createUser = this.createUser.bind(this);
    this.resetForm = this.resetForm.bind(this);

    props.pageSwitch('createUser');
  }

  onDisplayChange(event) {
    const el = event.target;
    const regDisplay = $('#regDisplay');
    const passport = el.files[0];
    if (passport && passport.type === 'image/jpeg') {
      if (passport.size > 5242880) { // 5mb
        lib.popMessage("can't upload image larger than 5mb");
      } else {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(passport);

        fileReader.onerror = () => {
          lib.popMessage('Oops!, we couldn\'t attach the file picked please try again or try another one');
        };

        fileReader.onload = (frEvent) => {
          const fileSrc = frEvent.target.result;
          $('#regPassport').src = fileSrc;
          regDisplay.classList.add('selected');
          regDisplay.classList.remove('Error');
          this.setState(() => ({ passport }));
        };
      }
    } else {
      lib.popMessage('Image as to be a JPEG (.jpg or .jpeg) file');
    }
  }

  onJobRoleChange(event) {
    const jobRole = event.target.value;
    this.setState(() => ({ jobRole }));
  }

  onDepartmentChange(event) {
    const department = event.target.value;
    this.setState(() => ({ department }));
  }

  onGenderChange(event) {
    const gender = event.target.value;
    this.setState(() => ({ gender: gender === 'male' || gender === 'female' ? gender : '' }));
  }

  regInputsState(event) {
    // eslint-disable-next-line dot-notation
    const input = event.target.name;
    if (Object.keys(this.state).indexOf(input) !== -1) {
      const { value } = event.target;
      this.setState(() => {
        const n = {};
        n[input] = value;
        return n;
      });

      if (!lib.isEmpty(value)) event.target.classList.remove('Error');
    }
  }

  resetForm() {
    this.setState(() => (defaultStates));

    $('#regPassport').src = '';
    $('#regPassportPicker').value = null;
  }

  createUser() {
    const { state } = this;
    if (state.submitting === false) {
      const validate = () => {
        let err = false;

        if (state.passport === null) {
          $('#regDisplay').classList.add('Error');
          err = true;
        } else $('#regDisplay').classList.remove('Error');

        if (lib.isEmpty(state.firstName)) {
          $('#regForm .form-element[name=firstName]').classList.add('Error');
          err = true;
        } else $('#regForm .form-element[name=firstName]').classList.remove('Error');

        if (lib.isEmpty(state.lastName)) {
          $('#regForm .form-element[name=lastName]').classList.add('Error');
          err = true;
        } else $('#regForm .form-element[name=lastName]').classList.remove('Error');

        try {
          if (!lib.isEmpty(state.email)) {
            if (lib.isEmail(state.email)) {
              this.setState(() => ({ emailError: '' }));
              $('#regForm .form-element[name=email]').classList.remove('Error');
            } else {
              this.setState(() => ({ emailError: 'not a valid email address' }));
              throw Error;
            }
          } else throw Error;
        } catch (error) {
          $('#regForm .form-element[name=email]').classList.add('Error');
          err = true;
        }

        try {
          if (!lib.isEmpty(state.password)) {
            if (state.password.length >= 8) {
              this.setState(() => ({ passwordError: '' }));
              $('#regForm .form-element[name=password]').classList.remove('Error');
            } else {
              this.setState(() => ({ passwordError: 'password needs to be atleast 8 characters long' }));
              throw Error;
            }
          } else throw Error;
        } catch (error) {
          $('#regForm .form-element[name=password]').classList.add('Error');
          err = true;
        }

        if (['male', 'female'].indexOf(state.gender) === -1) {
          $('#regForm .form-element[name=gender]').classList.add('Error');
          err = true;
        } else $('#regForm .form-element[name=gender]').classList.remove('Error');

        if (Object.keys(JobRoles).indexOf(state.jobRole) === -1) {
          $('#regForm .form-element[name=jobRole]').classList.add('Error');
          err = true;
        } else $('#regForm .form-element[name=jobRole]').classList.remove('Error');

        if (Object.keys(JobRoles).indexOf(state.jobRole) === -1) {
          $('#regForm .form-element[name=jobRole]').classList.add('Error');
          $('#regForm .form-element[name=department]').classList.add('Error');
          err = true;
        } else {
          $('#regForm .form-element[name=jobRole]').classList.remove('Error');

          if (JobRoles[state.jobRole].departments.indexOf(state.department) === -1) {
            $('#regForm .form-element[name=department]').classList.add('Error');
            err = true;
          } else $('#regForm .form-element[name=department]').classList.remove('Error');
        }

        if (lib.isEmpty(state.address)) {
          $('#regForm .form-element[name=address]').classList.add('Error');
          err = true;
        } else $('#regForm .form-element[name=address]').classList.remove('Error');


        return !err;
      };

      if (validate()) {
        this.setState(() => ({ submitting: true }));

        const form = new FormData();
        form.append('passport', state.passport);
        form.append('firstName', state.firstName);
        form.append('lastName', state.lastName);
        form.append('email', state.email);
        form.append('password', state.password);
        form.append('gender', state.gender);
        form.append('jobRole', state.jobRole);
        form.append('department', state.department);
        form.append('address', state.address);

        fetch('https://akintomiwa-capstone-backend.herokuapp.com/auth/create-user', {
          method: 'POST',
          body: form,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('sessionUserToken')}`,
          },
        }).then((res) => {
          if (res.status === 201 || res.status === 400) return res.json();
          throw new Error();
        }).then((res) => {
          if (res.status === 'error') {
            $('#regForm .form-element[name=email]').classList.add('Error');
            this.setState(() => ({ emailError: 'not a valid email address' }));
          } else {
            this.resetForm();
            lib.popMessage('user account created successfully');
          }
        }).catch(() => {
          lib.popMessage('Oops!, there was a server error, please try again');
        })
          .finally(() => {
            this.setState(() => ({ submitting: false }));
          });
      } else {
        lib.popMessage('Please complete the form before submitting');
      }
    }
  }

  render() {
    const jobRolesKeys = Object.keys(JobRoles);
    const jobRoleDepartments = [];
    const jobRoleDepts = jobRolesKeys.indexOf(this.state.jobRole) !== -1
      ? JobRoles[this.state.jobRole].departments : [];
    jobRoleDepts.forEach((department) => {
      jobRoleDepartments.push(
        <option value={department} key={department}>{Departments[department]}</option>,
      );
    });

    const jobRoles = [];
    Object.keys(JobRoles).forEach((jobRole) => {
      jobRoles.push(<option value={jobRole} key={jobRole}>{JobRoles[jobRole].name}</option>);
    });

    return (
      <div id="regForm">
        <h2 id="regFormLabel">Create a new user account</h2>
        <div id="regDisplay" onClick={() => { $('#regPassportPicker').click(); }}>
          <img id="regPassport" alt="" />
          <div className="overlay">
            <p className="far fa-image" />
            <p>pick passport</p>
          </div>
          <input type="file" className="form-element" name="passport" id="regPassportPicker" accept="image/jpeg" onChange={this.onDisplayChange} />
        </div>

        <div className="input-group">
          <p className="form-label">first name</p>
          <input type="text" name="firstName" value={this.state.firstName} className="form-element" placeholder="user first name" onChange={this.regInputsState} />
        </div>

        <div className="input-group">
          <p className="form-label">last name</p>
          <input type="text" name="lastName" value={this.state.lastName} className="form-element" placeholder="user last name" onChange={this.regInputsState} />
        </div>

        <div className="input-group">
          <p className="form-label">email</p>
          <input type="text" name="email" value={this.state.email} className="form-element" placeholder="user email address" onChange={this.regInputsState} />
          <p className={`error-msg ${this.state.emailError === '' ? 'hide' : ''}`}>{this.state.emailError}</p>
        </div>

        <div className="input-group">
          <p className="form-label">password</p>
          <input type="password" name="password" value={this.state.password} className="form-element" placeholder="user password" onChange={this.regInputsState} />
          <p className={`error-msg ${this.state.passwordError === '' ? 'hide' : ''}`}>{this.state.passwordError}</p>
        </div>

        <div className="input-group">
          <p className="form-label">gender</p>
          <select className={`form-element ${lib.isEmpty(this.state.gender) ? 'placeholder' : ''}`} name="gender" value={lib.isEmpty(this.state.gender) ? '-placeholder-' : this.state.gender} onChange={this.onGenderChange}>
            <option value="-placeholder-" disabled>user gender</option>
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
        </div>

        <div className="input-group">
          <p className="form-label">job role</p>
          <select className={`form-element ${lib.isEmpty(this.state.jobRole) ? 'placeholder' : ''}`} value={lib.isEmpty(this.state.jobRole) ? '-placeholder-' : this.state.department} name="jobRole" onChange={this.onJobRoleChange}>
            <option value="-placeholder-" disabled>user job role</option>
            {jobRoles}
          </select>
        </div>

        <div className="input-group">
          <p className="form-label">department</p>
          <select className={`form-element ${lib.isEmpty(this.state.department) ? 'placeholder' : ''}`} value={lib.isEmpty(this.state.department) ? '-placeholder-' : this.state.department} name="department" onChange={this.onDepartmentChange}>
            <option value="-placeholder-" disabled>user department</option>
            {jobRoleDepartments}
          </select>
        </div>

        <div className="input-group">
          <p className="form-label">address</p>
          <input type="text" name="address" value={this.state.address} className="form-element" placeholder="user home address" onChange={this.regInputsState} />
        </div>

        <button type="submit" className={`btn btn-success ${this.state.submitting ? 'disabled' : ''}`} onClick={this.createUser}>
          create user
          <span className="fas fa-user-plus icon" />
        </button>
      </div>

    );
  }
}

CreateUser.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
};

export default CreateUser;

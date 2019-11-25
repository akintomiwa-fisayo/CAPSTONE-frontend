import React from 'react';
import '../css/report.css';
import PropTypes from 'prop-types';
import Report from './Report';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
    };

    this.props.pageSwitch('reports');
  }

  render() {
    return (
      <div id="reports">
        <Report />
      </div>
    );
  }
}

Reports.propTypes = {
  pageSwitch: PropTypes.func.isRequired,
};

export default Reports;

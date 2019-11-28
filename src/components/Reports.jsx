import React from 'react';
import PropTypes from 'prop-types';
import Report from './Report';
import '../css/report.css';
import lib from '../js/lib';


class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      loading: true,
    };

    this._isMounted = false;
    this.fetchRequest = this.props.fetchRequest;
    this.loadReports = this.loadReports.bind(this);
    this.removeReport = this.removeReport.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.pageSwitch('reports');

    if (this.props.sessionUser.isAdmin) {
      this.loadReports();
    } else {
      this.setState(() => ({
        loading: false,
      }));
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadReports() {
    // Get all reports
    this.fetchRequest({
      url: 'https://akintomiwa-capstone-backend.herokuapp.com/reports',
    }).then((reports) => {
      if (this._isMounted === true) {
        // save reports
        this.setState(() => ({
          reports,
          loading: false,
        }));
      }
    });
  }


  render() {
    if (this.state.loading) {
      return (
        <div>
          <span className="fa fa-spinner fa-spin loader" />
        </div>
      );
    }

    if (this.props.sessionUser.isAdmin) {
      const reports = [];
      const reportsArr = this.state.reports;
      for (let i = 0; i < reportsArr.length; i += 1) {
        reports.push(<Report
          {...this.props}
          report={reportsArr[i]}
          key={reportsArr[i].reportId}
          removeReport={this.removeReport}
        />);
      }
      return (
        <div id="reports">
          {reports}
        </div>
      );
    }
    lib.popMessage('remember to handle error here');
    return null;
  }
}

Reports.propTypes = {
  sessionUser: PropTypes.object.isRequired,
  pageSwitch: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
};


export default Reports;

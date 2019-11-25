import React from 'react';
import lib from '../js/lib';

const reportArticle = {
  reportId: 1991,
  contentType: 'article',
  flag: 'inappropriate',
  reason: 'it is quit lame',
  reporter: {
    id: 1067,
    firstName: 'name',
    lastName: 'name',
    passportUrl: 'https://res.cloudinary.com/capstone-backend/image/upload/v1573054820/gkascktgwbavuemvjy4v.jpg',
  },
  reportedOn: '2019-11-19T20:21:33.733Z',
  article: {
    id: 19991,
    title: 'report sample title',
    createdOn: '2019-11-19T20:21:33.130Z',
    author: {
      id: 1067,
      firstName: 'name',
      lastName: 'name',
      passportUrl: 'https://res.cloudinary.com/capstone-backend/image/upload/v1573054820/gkascktgwbavuemvjy4v.jpg',
    },
    article: 'report sample lorem article',
  },
};

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      report: {
        ...reportArticle,
        dateTimeRef: '',
      },
    };

    this.updateTimeRef = this.updateTimeRef.bind(this);
  }

  updateTimeRef() {
    const update = () => {
      this.setState((prevState) => ({
        report: {
          ...prevState.report,
          dateTimeRef: lib.getRelativeTime(prevState.report.reportedOn),
        },
      }));
    };

    update();
    setInterval(update, 60000); // 60 seconds (1 min)
  }


  render() {
    const { report } = this.state;
    const reportedContent = report.contentType === 'article' ? report.article : report.gif;
    const content = report.contentType === 'gif' ? <img className="item" src={reportedContent.imageUrl} alt="" /> : <div className="item">{reportedContent.article}</div>;

    return (
      <div
        className={`report ${report.contentType}`}
        id={report.id}
        data-type={report.type}
      >
        <div className="head">
          <div className="user-image">
            <a href="man">
              <img src={report.reporter.passportUrl} alt={`${report.reporter.firstName} ${report.reporter.lastName}`} />
            </a>
          </div>
          <div>
            <a href="man" className="user-name">{`${report.reporter.firstName} ${report.reporter.lastName}`}</a>
            <p
              className="date-time"
              data-timestamp={report.reportedOn}
              title={lib.getRelativeTime(report.reportedOn, false)}
              ref={this.updateTimeRef}
            >{report.dateTimeRef}
            </p>
          </div>
          <span className="report-id">123456</span>
        </div>

        <div className="body">
          <div className="report-details">
            <div className="detail">
              <div className="info">flag</div>
              <div className="value">{report.flag}</div>
            </div>
            <div className="detail">
              <div className="info">content</div>
              <div className="value">{report.contentType}</div>
            </div>
          </div>
          <div className="report-content">
            <div className="title">{reportedContent.title}</div>
            <div className="content">
              {content}
            </div>
          </div>
        </div>
        <div className="bottom">
          <button type="button" className="action btn btn-danger"> delete </button>
          <button type="button" className="action btn btn-warning"> ignore </button>
        </div>
      </div>
    );
  }
}

export default Report;

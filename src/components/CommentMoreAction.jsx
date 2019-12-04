import React from 'react';
import PropTypes from 'prop-types';
import lib from '../js/lib';

class CommentMoreActions extends React.Component {
  constructor(props) {
    super(props);
    this.moreActions = null;
    this.focusMoreActions = this.focusMoreActions.bind(this);
    this.blurMoreActions = this.blurMoreActions.bind(this);
    this.revealReportDialog = this.revealReportDialog.bind(this);
  }

  componentDidMount() {
    if (this.props.showMoreActions) {
      this.moreActions.focus();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  focusMoreActions(moreActions) {
    if (moreActions) {
      moreActions.focus();
      this.moreActions = moreActions;
      const { moreActionEl } = this.props;
      const cord = lib.getCordinates(moreActionEl);
      const moreActionWdth = moreActions.offsetWidth;
      let left = cord.left + moreActionEl.offsetWidth;

      const deviceWidth = document.body.clientWidth;
      left = left + moreActionWdth > deviceWidth ? deviceWidth - moreActionWdth : left;
      moreActions.style.left = `${left}px`;
    }
  }

  blurMoreActions(event) {
    event.target.blur();
    this.props.hideMoreActions();
  }

  revealReportDialog(event) {
    event.stopPropagation();
    this.moreActions.blur();
    this.props.focusForReport();
    this.props.showReportDialog();
  }

  render() {
    const { showMoreActions } = this.props;
    const { moreActionEl } = this.props;
    if (!showMoreActions || !moreActionEl) {
      return (<div />);
    }

    const view = this.props.preview ? ' view' : '';

    return (
      <button
        type="button"
        className={`more-actions-dialog${view}`}
        ref={this.focusMoreActions}
        onBlur={this.blurMoreActions}
      >
        <span className="action" onClick={this.revealReportDialog}>
          <span className="fas fa-flag-checkered icon" />
          report
        </span>
      </button>
    );
  }
}


CommentMoreActions.propTypes = {
  moreActionEl: PropTypes.object,
  showMoreActions: PropTypes.bool.isRequired,
  hideMoreActions: PropTypes.func.isRequired,
  showReportDialog: PropTypes.func.isRequired,
  focusForReport: PropTypes.func.isRequired,
  preview: PropTypes.bool.isRequired,

};

CommentMoreActions.defaultProps = {
  moreActionEl: false,
};
export default CommentMoreActions;

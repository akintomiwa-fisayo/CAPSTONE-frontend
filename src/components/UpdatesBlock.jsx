import React from 'react';
import PropTypes from 'prop-types';
import '../css/updatesblock.css';

class UpdatesBlock extends React.Component {
  render() {
    const cancel = this.props.preview
      ? (
        <div className="cancel-holder">
          <span className="cancel fas fa-times" onClick={() => { this.props.onCancel(); }} />
        </div>
      ) : '';
    return (
      <div id="updatesBlock" style={this.props.styles}>
        {cancel}
        <h2 className="header">Notice board</h2>
        <div className="note" data-importance="4">
          <div className="container">
            <div className="date-time">november 12, 9:30am</div>
            <div className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae odit reprehenderit quod blanditiis ratione recusandae at, magnam nobis eius harum nisi iusto libero, ea eveniet dolore? Omnis maxime nisi sapiente?
            </div>
          </div>
        </div>
        <div className="note" data-importance="3">
          <div className="container">
            <div className="date-time">november 10, 11:59am</div>
            <div className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae odit reprehenderit quod blanditiis ratione recusandae at, magnam nobis eius harum nisi iusto libero, ea eveniet dolore? Omnis maxime nisi sapiente?
            </div>
          </div>
        </div>
        <div className="note" data-importance="2">
          <div className="container">
            <div className="date-time">november 8, 2:00pm</div>
            <div className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae odit reprehenderit quod blanditiis ratione recusandae at, magnam nobis eius harum nisi iusto libero, ea eveniet dolore? Omnis maxime nisi sapiente?
            </div>
          </div>
        </div>
        <div className="note" dataimportance="1">
          <div className="container">
            <div className="date-time">november 6, 10:30am</div>
            <div className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae odit reprehenderit quod blanditiis ratione recusandae at, magnam nobis eius harum nisi iusto libero, ea eveniet dolore? Omnis maxime nisi sapiente?
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpdatesBlock.propTypes = {
  styles: PropTypes.object,
  preview: PropTypes.bool,
  onCancel: PropTypes.func,
};
UpdatesBlock.defaultProps = {
  styles: {},
  preview: false,
  onCancel: () => {},
};
export default UpdatesBlock;

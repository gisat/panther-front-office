import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.css';
class HoldButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPressed: false,
    };
  }

  onMouseDown = () => {
    if (!this.props.disabled) {
      this.props.onClick();
      this.clearTimeout();
      this.longPressTimeout = setTimeout(this.longPressStart.bind(this), this.props.startTimeout);
    }
  };

  onMouseOut = () => {
    this.clearTimeout();
    if (this.isCurrentlyPressed()) {
      this.setState({
        isPressed: false,
      });
    }
  };

  clearTimeout = () => {
    clearTimeout(this.longPressTimeout);
    clearInterval(this.pressInterval);
    this.longPressTimeout = undefined;
    this.pressInterval = undefined;
  }

  isCurrentlyPressed = () => this.state.isPressed;

  longPressStart = () => {
    this.props.longPressStart();
    // When inifite call the timeout for regular period
    if (!this.props.finite) {
      this.props.pressCallback();
      this.pressInterval = setInterval(this.props.pressCallback, this.props.pressCallbackTimeout);
    } else if (this.props.finite) {
      this.pressInterval = setTimeout(this.longPressEnd, this.props.pressCallbackTimeout);
    }

    this.setState({
      isPressed: true,
    });
  };

  longPressEnd = () => {
    this.onMouseOut();
    this.props.longPressEnd();
  };

  render() {
    const classes = classNames(
      `hold-button ${this.props.className}`, {
        pressed: this.state.isPressed,
        disabled: this.props.disabled,
      }
    )

    return (
      <button
        className={classes}
        onMouseLeave={this.onMouseOut.bind(this)}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseOut.bind(this)}
        onTouchStart={this.onMouseDown.bind(this)}
        onTouchEnd={this.onMouseOut.bind(this)}
      >
        {this.props.children}
      </button>);
  }
}

HoldButton.defaultProps = {
  startTimeout: 300,
  onClick: () => {},
  longPressStart: () => {},
  longPressEnd: () => {},
  pressCallbackTimeout: 500,
  pressCallback: undefined,
  finite: true,
  className: '',
  disabled: false,
};

HoldButton.propTypes = {
  startTimeout: PropTypes.number,
  longPressStart: PropTypes.func,
  longPressEnd: PropTypes.func,
  pressCallbackTimeout: PropTypes.number,
  pressCallback: PropTypes.func,
  finite: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

export default HoldButton;
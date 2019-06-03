import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.css';
class HoldButton extends React.Component {

  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.onMouseOut = this.onMouseOut.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.state = {
      isPressed: false,
    };
  }

  componentDidMount() {
    this.node.current.addEventListener('touchstart', this.onTouchStart);
    this.node.current.addEventListener('touchend', this.onTouchEnd);
  }

  componentWillUnmount() {
    this.node.current.removeEventListener('touchstart', this.onTouchStart);
    this.node.current.removeEventListener('touchend', this.onTouchEnd);
  }

  onTouchStart = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    this.onMouseDown(evt);
  }
  onTouchEnd = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    this.onMouseOut(evt);
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
        ref={this.node}
        className={classes}
        onMouseLeave={this.onMouseOut}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseOut}
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
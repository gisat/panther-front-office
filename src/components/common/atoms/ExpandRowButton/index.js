import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Button from '../Button';

import './style.css';


class ExpandRowButton extends React.PureComponent {

	static propTypes = {
		expanded: PropTypes.bool
	};


	render() {
		let {expanded, ...props} = this.props;
		props.className = classNames(props.className, 'ptr-expand-row-button', {'expanded': expanded});
		props.icon = "expand-row";
		return React.createElement(Button, props, this.props.children);
	}

}


export default ExpandRowButton;

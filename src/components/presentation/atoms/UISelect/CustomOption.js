import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './CustomOption.css';

class CustomOption extends React.PureComponent {

	static propTypes = {
		centerVertically: PropTypes.bool,
		data: PropTypes.object,
		focused: PropTypes.bool,
		optionKey: PropTypes.string,
		selectValue: PropTypes.func,
		style: PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	render() {
		let classes = classNames('ptr-ui-select-custom-option', {
			'centered-vertically': this.props.centerVertically,
			'focused': this.props.focused
		});

		return (
			<div className={classes} style={this.props.style} onClick={() => this.props.selectValue(this.props.data)}>
				{this.props.children}
			</div>
		);
	}

}


export default CustomOption;

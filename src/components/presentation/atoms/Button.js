import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Icon from './Icon';
import Menu from './Menu';


class Button extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		icon: PropTypes.string,
		primary: PropTypes.bool,
		secondary: PropTypes.bool,
		ghost: PropTypes.bool,
		invisible: PropTypes.bool,
		circular: PropTypes.bool,
		small: PropTypes.bool,
		floatingAction: PropTypes.bool,
		onClick: PropTypes.func,
		className: PropTypes.string
	};

	static defaultProps = {
		disabled: false
	};

	constructor(props) {
		super(props);
		//this.state = {
		//	focused: false
		//};
		this.onClick = this.onClick.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}


	onClick(e) {
		if (!this.props.disabled) {
			this.props.onClick(e)
		}
	}

	//setFocus(focused) {
	//	this.setState({
	//		focused: focused
	//	});
	//}

	onKeyPress(e) {
		if(e.charCode === 32) {
			this.onClick(e);
		}
	}


	render() {

		let iconInsert = null;
		if (this.props.icon) {
			// determine icon
			iconInsert = (
				<Icon icon={this.props.icon} />
			);
		}

		let content = React.Children.map(this.props.children, child => {

			console.log('#####', child, typeof child, child.type instanceof Menu);

			if (typeof child === 'string') {
				return (
					<div className="ptr-button-caption">{child}</div>
				);
			} else if (typeof child === 'object' && child instanceof Menu) {
				return child;
			} else {
				return child;
			}
		});

		let classes = classNames(
			'ptr-button', {
				primary: !!this.props.primary,
				secondary: !!this.props.secondary,
				ghost: !!this.props.ghost,
				invisible: !!this.props.invisible,
				circular: !!this.props.circular,
				'floating-action': !!this.props.floatingAction,
				//hasIcon: !!this.props.icon,
				//focused: this.state.focused,
				disabled: this.props.disabled
			},
			this.props.className
		);

		let ret = (
			<div
				className={classes}
				id={this.props.id}
				tabIndex={this.props.disabled ? "-1" : "0"}
				onClick={this.onClick}
				onKeyPress={this.onKeyPress}
				//onFocus={this.setFocus.bind(this, true)}
				//onBlur={this.setFocus.bind(this, false)}
			>
				{iconInsert}
				{content}
			</div>
		);

		return ret;
	}

}


export default Button;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button, {ButtonGroup} from '../Button';

class ButtonSwitch extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		ghost: PropTypes.bool,
		inverted: PropTypes.bool,
		invisible: PropTypes.bool,
		large: PropTypes.bool,
		onClick: PropTypes.func.isRequired,
		small: PropTypes.bool,
		title: PropTypes.string,
		unfocusable: PropTypes.bool
	};

	static defaultProps = {
		disabled: false
	};

	constructor(props) {
		super(props);
		this.state = {
			focused: false
		};

		this.onBlur = this.onBlur.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}


	onClick(value, e) {
		if (!this.props.disabled) {
			if (this.props.onClick) {
				this.props.onClick(value, e);
			}
		}
	}

	onBlur() {
	
	}

	onKeyPress(e) {
		if(e.charCode === 32) {
			this.onClick(e);
		} else if (e.charCode === 13){
			this.onClick(e);
		}
	}


	render() {

		 let {onClick, ...switchProps} = this.props;

		let content = React.Children.map(this.props.children, child => {
			let {active, value, ...props} = child.props;
			props = {
				...switchProps, //todo should be done by ButtonGroup ?
				...props,
				active: active, //or state
				onClick: this.onClick.bind(this, value)
			};
			return React.cloneElement(child, props, child.props.children);
		});

		let classes = classNames(
			'ptr-button-switch', {
				disabled: this.props.disabled,
				ghost: !!this.props.ghost,
				invisible: !!this.props.invisible,
				inverted: !!this.props.inverted,
				large: !!this.props.large,
				small: this.props.small,
			},
			this.props.className
		);

		return (
			<ButtonGroup
				className={classes}
				onBlur={this.onBlur}
				onClick={this.onClick}
				onKeyPress={this.onKeyPress}
				tabIndex={(this.props.disabled || this.props.unfocusable) ? "-1" : "0"}
				title={this.props.title}
			>
				{content}
			</ButtonGroup>
		);
	}
}

export default ButtonSwitch;

export const Option = ({active, onClick, children, ...props}) => (
	<Button
		className={classNames({active})}
		onClick={onClick}
		{...props}
	>
		{children}
	</Button>
);


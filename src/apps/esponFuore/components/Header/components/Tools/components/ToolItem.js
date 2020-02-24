import React from "react";
import PropTypes from "prop-types";
import classnames from 'classnames';

import {Icon} from '@gisatcz/ptr-atoms';

class ToolItem extends React.PureComponent {

	static propTypes = {
		active: PropTypes.bool,
		disabled: PropTypes.bool,
		icon: PropTypes.string,
		itemKey: PropTypes.string,
		name: PropTypes.string,

		closeWindow: PropTypes.func,
		openWindow: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		if (this.props.isOpen) {
			this.props.closeWindow();
		} else {
			this.props.openWindow();
		}
	}

	render() {
		let classes = classnames("esponFuore-header-tool", {
			active: !!this.props.isOpen,
			disabled: !!this.props.disabled
		});

		return (
			<div className={classes} title={this.props.name} onClick={this.onClick}>
				<Icon icon={this.props.icon}/>
				<span>{this.props.name}</span>
			</div>
		);
	}
}

export default ToolItem;

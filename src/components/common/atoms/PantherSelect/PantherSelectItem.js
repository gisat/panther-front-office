import React from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";
import Icon from "../Icon";

class PantherSelectItem extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		selected: PropTypes.bool,
		onSelect: PropTypes.func,
	};

	static defaultProps = {
		disabled: false
	};

	constructor(props) {
		super(props);

		this.onBlur = this.onBlur.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}


	onClick(e) {
		if (!this.props.disabled) {
			if (this.props.onSelect) {
				this.props.onSelect(this.props.item)
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

		let classes = classNames(
			'ptr-panther-select-item', {
				selected: !!this.props.selected,
			},
			this.props.className
		);

		return (
			<div
				className={classes}
				onClick={this.onClick}
			>
				{this.props.children}
			</div>
		);
	}
}

export default PantherSelectItem;
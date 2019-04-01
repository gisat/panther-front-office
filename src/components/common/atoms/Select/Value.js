import classes from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {getLabel} from './utils';
import './Item.scss';


class Value extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool,                   // disabled prop passed to ReactSelect
		onOptionLabelClick: PropTypes.func,         // method to handle click on value label
		endItems: PropTypes.arrayOf(PropTypes.element),
		startItems: PropTypes.arrayOf(PropTypes.element),
		option: PropTypes.object.isRequired,        // option passed to component
		renderer: PropTypes.func,
		unfocusable: PropTypes.bool
	};

	constructor(options) {
		super(options);

		this.onClick = this.onClick.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}

	blockEvent(event) {
		event.stopPropagation();
	}

	onKeyPress(key) {
		if (key.charCode === 13 || key.charCode === 32) {
			this.props.onOptionLabelClick(this.props.option);
		}
	}

	onClick() {
		this.props.onOptionLabelClick(this.props.option);
	}

	render () {

		const label = getLabel({...this.props.option, renderer: this.props.renderer});

		const itemContent = (
				[
					(this.props.startItems ? <div className={'ptr-item-actions-start'} key='items-start'>
						{/* place for icons/buttons/info on start of the item */}
						{this.props.startItems}
					</div> : null),
					label,
					(this.props.endItems ? <div className={'ptr-item-actions-end'} key='items-end'>
						{/* place for icons/buttons/info at the and of the item */}
						{this.props.endItems}
					</div> : null)
				]
		);

		if (typeof this.props.onOptionLabelClick === 'function') {
			return(
				<a className={classes('ptr-item', this.props.option.className)}
					onMouseDown={this.blockEvent}
					onTouchEnd={this.onClick}
					onClick={this.onClick}
				   	onKeyPress={this.onKeyPress}
					style={this.props.option.style}
				    tabIndex={this.props.unfocusable ? -1 : 0}
					title={this.props.option.title}
				>
					{itemContent}	
				</a>
			)
		} else {
			return (
				<div className={classes('ptr-item ptr-icon-inline-wrap', this.props.option.className)} style={{display:'flex'}}>
					{itemContent}
				</div>
			);
		}
	}
}

export default Value;
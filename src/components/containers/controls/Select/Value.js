import classes from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../presentation/atoms/Icon';
import './Item.css';


class Value extends React.PureComponent {
	constructor() {
		super();
		// this.handleOnRemove = this.handleOnRemove.bind(this);
	}

	
	blockEvent (event) {
		event.stopPropagation();
	}

	getLabel() {
		const labelText = this.props.renderer ? this.props.renderer(this.props.option) : this.props.option.label;
		const IDtooltip = this.props.option && this.props.option.key && this.props.option.key.length > 10 ? this.props.option.key : null;
		return (
			<span className="label" key='label'>
				<span className="option-id" title = {IDtooltip}>
					{this.props.option.key}
				</span>
				<span>
					{labelText}
				</span>
			</span>)
	}

	render () {

		const label = this.getLabel();

		const itemContent = (
				[
					<div className={'ptr-item-actions-start'} key='items-start'>
						{/* place for icons/buttons/info on start of the item */}
						{this.props.startItems}
					</div>,
					label,
					<div className={'ptr-item-actions-end'} key='items-end'>
						{/* place for icons/buttons/info at the and of the item */}
						{this.props.endItems}
					</div>
				]
		)

		if (this.props.optionLabelClick) {
			// 'ptr-item ptr-icon-inline-wrap'

			return(
				<a className={classes('ptr-item', this.props.option.className)}
					style={{display:'flex'}}
					onMouseDown={this.blockEvent}
					onTouchEnd={(evt) => {this.props.onOptionLabelClick(this.props.option, evt)}}
					onClick={(evt) => {this.props.onOptionLabelClick(this.props.option, evt)}}
					style={this.props.option.style}
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
};

Value.propTypes = {
	disabled: PropTypes.bool,                   // disabled prop passed to ReactSelect
	onOptionLabelClick: PropTypes.func,         // method to handle click on value label
	// onRemove: PropTypes.func,                   // method to handle remove of that value
	// ordered: PropTypes.bool,                    // indicates if ordered values
	// onMoveUp: PropTypes.func,                   // method to handle ordering
	// onMoveDown: PropTypes.func,                 // method to handle ordering

	endItems: PropTypes.arrayOf(PropTypes.element),
	startItems: PropTypes.arrayOf(PropTypes.element),

	option: PropTypes.object.isRequired,        // option passed to component
	optionLabelClick: PropTypes.bool,           // indicates if onOptionLabelClick should be handled
	renderer: PropTypes.func                    // method to render option label passed to ReactSelect
}

export default Value;
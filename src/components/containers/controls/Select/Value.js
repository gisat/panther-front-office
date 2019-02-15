import classes from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../presentation/atoms/Icon';
import './Item.css';


class Value extends React.PureComponent {
	constructor() {
		super();
		this.handleOnRemove = this.handleOnRemove.bind(this);
	}

	
	blockEvent (event) {
		event.stopPropagation();
	}

	handleOnRemove (event) {
		if (!this.props.disabled) {
			this.props.onRemove(this.props.option.value);
		}
	}

	getOrderControl () {
		return (
			<span
				className="ptr-icon-inline-wrap"
				key = 'order'
			>
				<span
					className=" ptr-icon-inline-wrap"
					onMouseDown={this.blockEvent}
					onClick={this.props.onMoveUp}
					onTouchEnd={this.props.onMoveUp}
				>
					<Icon icon={'sort-up'} height={'16'}  width={'16'} viewBox={'0 -120 320 512'} className={'ptr-inline-icon hover'}/>
				</span>
				<span
					className=" ptr-icon-inline-wrap"
					onMouseDown={this.blockEvent}
					onClick={this.props.onMoveDown}
					onTouchEnd={this.props.onMoveDown}
				>
					<Icon icon={'sort-down'} height={'16'}  width={'16'} viewBox={'0 120 320 512'} className={'ptr-inline-icon hover'}/>
				</span>
			</span>
		);
	}
	getRemoveIcon () {
		return (
			<span className=" ptr-icon-inline-wrap"
					key='remove'
					onMouseDown={this.blockEvent}
					onClick={this.handleOnRemove}
					onTouchEnd={this.handleOnRemove}
				>
				<Icon icon={'times'} height={'16'}  width={'16'} className={'ptr-inline-icon hover'}/>

			</span>
		)
	}

	getLabel() {
		const labelText = this.props.renderer ? this.props.renderer(this.props.option) : this.props.option.label;

		return (
			<span className="label" key='label'>
				<span className="option-id">
					{this.props.option.key}
				</span>
				<span>
					{labelText}
				</span>
			</span>)
	}

	render () {
		const removeIcon = this.props.onRemove ? this.getRemoveIcon() : null;
		const orderedControls = this.props.ordered && this.props.onMoveUp && this.props.onMoveDown ? this.getOrderControl() : null;
		const label = this.getLabel();

		const itemContent = (
				[removeIcon,
				orderedControls,
				label,
				<div className={'ptr-item-actions-end'} key='items'>
					{/* place for icons/buttons/info at the and of the item */}
					{this.props.endItems}
				</div>]
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
	onRemove: PropTypes.func,                   // method to handle remove of that value
	ordered: PropTypes.bool,                    // indicates if ordered values
	onMoveUp: PropTypes.func,                   // method to handle ordering
	onMoveDown: PropTypes.func,                 // method to handle ordering

	endItems: PropTypes.arrayOf(PropTypes.element),

	option: PropTypes.object.isRequired,        // option passed to component
	optionLabelClick: PropTypes.bool,           // indicates if onOptionLabelClick should be handled
	renderer: PropTypes.func                    // method to render option label passed to ReactSelect
}

export default Value;
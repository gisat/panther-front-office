import classes from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {getLabel} from './utils';
import './Item.scss';


class Value extends React.PureComponent {

	blockEvent (event) {
		event.stopPropagation();
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
		)

		if (typeof this.props.onOptionLabelClick === 'function') {
			return(
				<a className={classes('ptr-item', this.props.option.className)}
					style={{display:'flex'}}
					onMouseDown={this.blockEvent}
					onTouchEnd={(evt) => {this.props.onOptionLabelClick(this.props.option, evt)}}
					onClick={(evt) => {this.props.onOptionLabelClick(this.props.option, evt)}}
					style={this.props.option.style}
				    tabIndex={0}
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
	endItems: PropTypes.arrayOf(PropTypes.element),
	startItems: PropTypes.arrayOf(PropTypes.element),
	option: PropTypes.object.isRequired,        // option passed to component
	renderer: PropTypes.func                    // method to render option label passed to ReactSelect
}

export default Value;
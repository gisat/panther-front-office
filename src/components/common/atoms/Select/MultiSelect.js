import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Value from './Value';
import Icon from '../Icon';

import './select.scss';
import Select from "./Select";

class MultiSelect extends React.PureComponent {

	static propTypes = {
		creatable: PropTypes.bool,
		disabled: PropTypes.bool,
		optionLabel: PropTypes.string, // path to label
		optionValue: PropTypes.string, // path to value (key)
		onAdd: PropTypes.func,
		onChange: PropTypes.func,
		onOptionLabelClick: PropTypes.func,
		options: PropTypes.array,
		selectedValues: PropTypes.array,
		unfocusable: PropTypes.bool,
		withKeyPrefix: PropTypes.bool

		// ordered: PropTypes.bool // ordered values
	};


    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
		this.onOptionLabelClick = this.onOptionLabelClick.bind(this);

        // this.moveValue = this.moveValue.bind(this);
    }

	/**
	 * Get collection of prepared options {label: 'string', value: 'string'}
	 * @param options {Array} Array of keys or collection of options
	 * @return {Array}
	 */
	getFormattedOptions(options) {
		if (!_.isArray(options)) options = [options];

		return options.map(option => {
			if (option) {
				return {
					value: this.getOptionValue(option),
					label: this.getOptionLabel(option)
				};
			} else {
				return [];
			}
		});
	}

	/**
	 * Get value(key) from option
	 * @param option {string | Object}
	 * @return {string}
	 */
	getOptionValue(option) {
		if (this.props.optionValue && _.isObject(option)) {
			return _.get(option, this.props.optionValue);
		} else {
			return option;
		}
	}

	/**
	 * Get label from option
	 * @param option {string | Object}
	 * @return {string}
	 */
	getOptionLabel(option) {
		if (this.props.optionLabel) {
			return _.get(option, this.props.optionLabel);
		} else {
			return option;
		}
	}

	/**
	 * @param selectedOption {Object}
	 */
    onChange(selectedOption) {
		let selectedOptions = this.props.selectedValues ? [...this.props.selectedValues, selectedOption] : [selectedOption];
		this.props.onChange(selectedOptions);
    }

	/**
	 * @param option {{value: {string}, label: {string}}}
	 * @param event {Object}
	 */
	onOptionLabelClick(option, event) {
		if (this.props.onOptionLabelClick) {
			event.stopPropagation();
			event.preventDefault();

			let selectedOption = _.find(this.props.options, opt => {
				let key = this.getOptionValue(opt);
				return key === option.value;
			});

			this.props.onOptionLabelClick(selectedOption);
		}
    }

	/**
	 * @param option {{value: {string}, label: {string}}}
	 * @param event {Object}
	 */
	onRemoveOptionClick(option, event) {
		event.stopPropagation();
		event.preventDefault();

		let selectedOptions = _.filter(this.props.selectedValues, opt => {
			let key = this.getOptionValue(opt);
			return key !== option.value;
		});

		this.props.onChange(selectedOptions);
	}


    
    // moveValue(item, direction) {
	// 	const values = this.state.selectedValues.slice(0);
	// 	const value = item[this.props.valueKey];
    //     const index = values.indexOf(value);
	//
	// 	switch(direction) {
	// 		case "up":
	// 			if(index>0) {
	// 				values.splice((index-1), 0, values.splice(index, 1)[0]);
	// 			}
	// 			break;
	// 		case "down":
	// 			if(index<(values.length-1)) {
	// 				values.splice((index+1), 0, values.splice(index, 1)[0]);
	// 			}
	// 			break;
    //     }
    //     this.setState({selectedValues: values}, this.onChange);
    // }

	blockEvent (event) {
		event.stopPropagation();
	}
    
    getRemoveIcon (item) {
		return (
			<span className=" ptr-icon-inline-wrap"
					key='remove'
					onMouseDown={this.blockEvent}
					onClick={this.onRemoveOptionClick.bind(this, item)}
					onTouchEnd={this.onRemoveOptionClick.bind(this, item)}
				>
				<Icon icon={'times'} height={'16'}  width={'16'} className={'ptr-inline-icon hover'}/>
			</span>
		)
    }
    
    // getOrderControl (item, moveUp, moveDown) {
    //     return (
    //         <span
    //             className="ptr-icon-inline-wrap"
    //             key = 'order'
    //         >
    //             {moveUp ? <span
    //                 className="ptr-icon-inline-wrap"
    //                 onMouseDown={this.blockEvent}
    //                 onClick={() => this.moveValue(item, "up")}
    //                 onTouchEnd={() => this.moveValue(item, "up")}
    //                 >
    //                 <Icon icon={'sort-up'} height={'16'}  width={'16'} viewBox={'0 -120 320 512'} className={'ptr-inline-icon hover'}/>
    //             </span> : <span className={'ptr-order-placeholder'}></span>}
    //             {moveDown ? <span
    //                 className=" ptr-icon-inline-wrap"
    //                 onMouseDown={this.blockEvent}
    //                 onClick={() => this.moveValue(item, "down")}
    //                 onTouchEnd={() => this.moveValue(item, "down")}
    //                 >
    //                 <Icon icon={'sort-down'} height={'16'}  width={'16'} viewBox={'0 120 320 512'} className={'ptr-inline-icon hover'}/>
    //             </span> : <span className={'ptr-order-placeholder'}></span>}
    //         </span>
    //     );
    // }

    getSelectedItem(selected, item) {
        const itemIndex = selected.findIndex(i => i === item.value);
        const moveUp = itemIndex !== 0;
        const moveDown = itemIndex !== selected.length - 1;
		// const orderedControls = this.props.ordered ? this.getOrderControl(item, moveUp, moveDown) : null;

        const startItems = [];
        if (!this.props.disabled) {
        	startItems.push(this.getRemoveIcon(item))
		}

        const endItems = [
            <span className={'ptr-icon-inline-wrap'} key={'double-angle'}>
                <Icon icon='angle-double-right' height={'16'}  width={'16'} className={'ptr-inline-icon'}/>
            </span>
        ];
        
        return (<Value 
                    key = {item.value}
                    option = {item}
                    onOptionLabelClick = {this.onOptionLabelClick}
					unfocusable={this.props.unfocusable}
					withKeyPrefix={this.props.withKeyPrefix}
                    //FIXME - loading
                    endItems = {endItems}
                    startItems = {startItems}
                />)
    }


    getSelectedItems(options, selected) {
        if(selected && selected.length > 0) {
            return selected.reduce((accumulator, selectedValue) => {
                const item = options.find(item => item.value === selectedValue.value);
                return item ? [...accumulator, item] : accumulator;
            }, []).map(this.getSelectedItem.bind(this, selected))
        } else {
            return null;
        }
    }

    getRestOptions(options, selectedOptions) {
        return _.reject(options, (item) => {
        	let key = this.getOptionValue(item);

        	return _.includes(selectedOptions.map(selectedOption => {
				return this.getOptionValue(selectedOption);
			}), key);
		});
    }

    render() {
		let options = this.props.options ? this.props.options : [];
		let selectedOptions = this.props.selectedValues ? this.props.selectedValues : [];

    	let formattedOptions = this.getFormattedOptions(options);
    	let formattedSelected = this.getFormattedOptions(selectedOptions);

        let selectedItems = this.getSelectedItems(formattedOptions, formattedSelected);
        let restOptions = this.getRestOptions(options, selectedOptions);
        return (
        	<div>
				{selectedItems ? <div className='items'>{selectedItems}</div> : null}
				{this.props.creatable ? (
					<Select
						type='creatable'
						disabled={this.props.disabled}
						onChange={this.onChange}
						onCreate={this.props.onAdd}
						options={restOptions}
						optionLabel={this.props.optionLabel}
						optionValue={this.props.optionValue}
						unfocusable={this.props.unfocusable}
						value={null}
						withKeyPrefix={this.props.withKeyPrefix}
					/>
				) : (
					<Select
						disabled={this.props.disabled}
						onChange={this.onChange}
						options={restOptions}
						optionLabel={this.props.optionLabel}
						optionValue={this.props.optionValue}
						unfocusable={this.props.unfocusable}
						value={null}
						withKeyPrefix={this.props.withKeyPrefix}
					/>
				)}
			</div>
		);
    }
}

export default MultiSelect;
import React from 'react';
import PropTypes from 'prop-types';
import SelectCreatable from 'react-select/lib/Creatable';
import Value from './Value';
import Icon from '../../../../components/common/atoms/Icon';
import {getLabel} from './utils';

import './select.scss';

const getInitialState = (props) => {
    return {
        options: props.options,
        selectedValues: props.selectedValues || [],
    };
}

class MultiSelect extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleOptionLabelClick = this.handleOptionLabelClick.bind(this);
        this.removeValue = this.removeValue.bind(this);
        this.moveValue = this.moveValue.bind(this);

        this.state = getInitialState(props);
    }
    
    handleChange = (selectedOption) => {
        const selectedValues =  [...this.state.selectedValues, selectedOption.value];
        this.setState({selectedValues}, this.onChange);
    }

    onChange() {
        if(typeof this.props.onChange === 'function') {
            this.props.onChange(this.state.selectedValues);
        }
    }

	renderOptionLabel (op) {
		return op[this.props.labelKey];
    }
    
    handleOptionLabelClick  (value, event) {
		if (this.props.onOptionLabelClick) {
			event.stopPropagation();
			event.preventDefault();
			this.props.onOptionLabelClick(value, event);
		}
    }
    
    removeValue (valueToRemove) {
        this.setState({
            selectedValues: this.state.selectedValues.filter(val => val !== valueToRemove)
        }, this.onChange);
    }
    
    moveValue(item, direction) {
		const values = this.state.selectedValues.slice(0);
		const value = item[this.props.valueKey];
        const index = values.indexOf(value);

		switch(direction) {
			case "up":
				if(index>0) {
					values.splice((index-1), 0, values.splice(index, 1)[0]);
				}
				break;
			case "down":
				if(index<(values.length-1)) {
					values.splice((index+1), 0, values.splice(index, 1)[0]);
				}
				break;
        }
        this.setState({selectedValues: values}, this.onChange);
    }

	blockEvent (event) {
		event.stopPropagation();
	}
    
    getRemoveIcon (item) {
		return (
			<span className=" ptr-icon-inline-wrap"
					key='remove'
					onMouseDown={this.blockEvent}
					onClick={() => {this.removeValue(item.value)}}
					onTouchEnd={() => {this.removeValue(item.value)}}
				>
				<Icon icon={'times'} height={'16'}  width={'16'} className={'ptr-inline-icon hover'}/>
			</span>
		)
    }
    
    getOrderControl (item, moveUp, moveDown) {
        return (
            <span
                className="ptr-icon-inline-wrap"
                key = 'order'
            >
                {moveUp ? <span
                    className="ptr-icon-inline-wrap"
                    onMouseDown={this.blockEvent}
                    onClick={() => this.moveValue(item, "up")}
                    onTouchEnd={() => this.moveValue(item, "up")}
                    >
                    <Icon icon={'sort-up'} height={'16'}  width={'16'} viewBox={'0 -120 320 512'} className={'ptr-inline-icon hover'}/>
                </span> : <span className={'ptr-order-placeholder'}></span>}
                {moveDown ? <span
                    className=" ptr-icon-inline-wrap"
                    onMouseDown={this.blockEvent}
                    onClick={() => this.moveValue(item, "down")}
                    onTouchEnd={() => this.moveValue(item, "down")}
                    >
                    <Icon icon={'sort-down'} height={'16'}  width={'16'} viewBox={'0 120 320 512'} className={'ptr-inline-icon hover'}/>
                </span> : <span className={'ptr-order-placeholder'}></span>}
            </span>
        );
    }

    getSelectedItem(item) {
        const removeIcon = this.removeValue ? this.getRemoveIcon(item) : null;
        const itemIndex = this.state.selectedValues.findIndex(i => i === item.value);
        const moveUp = itemIndex !== 0;
        const moveDown = itemIndex !== this.state.selectedValues.length - 1;
		const orderedControls = this.props.ordered ? this.getOrderControl(item, moveUp, moveDown) : null;

        const startItems = [
            removeIcon,
            orderedControls,
        ];

        const endItems = [
            <span className={'ptr-icon-inline-wrap'} key={'double-angle'}>
                <Icon icon='angle-double-right' height={'16'}  width={'16'} className={'ptr-inline-icon'}/>
            </span>
        ];
        
        return (<Value 
                    key = {item[this.props.valueKey]}
                    option = {item}
                    onOptionLabelClick = {this.handleOptionLabelClick}
                    disabled = {this.props.disable}
                    //FIXME - loading
                    endItems = {endItems}
                    startItems = {startItems}
                />)
    }

    /**
     * 
     * @param {Array} selectedValues 
     */
    getSelectedItems(selectedValues) {
        if(selectedValues && selectedValues.length > 0) {
            return selectedValues.reduce((accumulator, selectedValue) => {
                const item = this.state.options.find(item => item.value === selectedValue);
                return item ? [...accumulator, item] : accumulator;
            }, []).map(this.getSelectedItem.bind(this))
        } else {
            return null;
        }
    }

    getRestOptions(items) {
        return items.reduce((accumulator, item) => {
            return this.state.selectedValues.includes(item.value) ? accumulator : [...accumulator, item];
        }, [])
    }

    handleAddValue(value) {
        const newItem = {value, label: value}
        this.setState(
            {
                selectedValues: [...this.state.selectedValues, value],
                options: [...this.state.options, newItem],
            }
        );

        if(typeof this.props.onAdd === 'function') {
            this.props.onAdd(value);
        }
    }

    render() {
        const { selectedValues } = this.state;
        const selectedItems = this.getSelectedItems(selectedValues);
        const restOptions = this.getRestOptions(this.props.options);

        return (
            <div>
                {selectedItems ? <div className='items'>{selectedItems}</div> : null}
                <SelectCreatable
                        value={''}
                        onChange={this.handleChange}
                        options={restOptions}
                        isOptionSelected={() => false}
                        getNewOptionData={(inputValue, optionLabel) => ({value:inputValue, label:optionLabel})}
                        onCreateOption={(createValue) => {this.handleAddValue(createValue)}}
                        className={'ptr-select-container'}
                        classNamePrefix={'ptr-select'}
                        formatOptionLabel={getLabel}
                        // menuIsOpen={true}
                        />
            </div>
        )
    }
}



MultiSelect.propTypes = {
    disabled: PropTypes.bool,            // whether the Select is disabled or not
    labelKey: PropTypes.string,          // path of the label value in option objects
    onChange: PropTypes.func,            // onChange handler: function (newValue) {}
    onAdd: PropTypes.func,            // onChange handler: function (newValue) {}
    onOptionLabelClick: PropTypes.func,  // onCLick handler for value labels: function (value, event) {}
    options: PropTypes.array,            // array of options
    ordered: PropTypes.bool,             // ordered values
    valueKey: PropTypes.string,          // path of the label value in option objects
}

MultiSelect.defaultProps = {
    disabled: false,
    labelKey: 'label',
    onChange: undefined,
    onAdd: undefined,
    onOptionLabelClick: undefined,
    options: undefined,
    ordered: false,
    valueKey: 'value'
};

export default MultiSelect;
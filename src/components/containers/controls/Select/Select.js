import React from 'react';
import PropTypes from 'prop-types';
// import Select from 'react-select';
import SelectCreatable from 'react-select/lib/Creatable';
import Value from './Value';
import Icon from 'components/presentation/atoms/Icon';

import './select.css';


const getInitialState = (props) => {
    return {
        /*
            * set by getStateFromValue on componentWillMount:
            * - value
            * - values
            * - filteredOptions
            * - inputValue
            * - placeholder
            * - focusedOption
        */
        isFocused: false,
        isLoading: false,
        isOpen: false,
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
                    // onMoveUp = {this.moveValue.bind(this, item, "up")}
                
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
                    // onMoveDown = {this.moveValue.bind(this, item, "down")}
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
                    optionLabelClick = {!!this.props.onOptionLabelClick}
                    onOptionLabelClick = {this.handleOptionLabelClick}
                    // onRemove = {this.removeValue}
                    // onMoveUp = {this.moveValue.bind(this, item, "up")}
                    // onMoveDown = {this.moveValue.bind(this, item, "down")}
                    // ordered = {this.props.ordered}
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
        //FIXME call handler
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
                        />
            </div>
        )
    }
}



MultiSelect.propTypes = {
    selectedItems: PropTypes.array,

    // unused addLabelText: PropTypes.string,      // placeholder displayed when you want to add a label on a multi-value input
    allowCreate: PropTypes.bool,         // whether to allow creation of new entries
    // asyncOptions: PropTypes.func,        // function to call to get options
    // autoload: PropTypes.bool,            // whether to auto-load the default async options set
    backspaceRemoves: PropTypes.bool,    // whether backspace removes an item if there is no text input
    // cacheAsyncResults: PropTypes.bool,   // whether to allow cache
    className: PropTypes.string,         // className for the outer element
    clearAllText: PropTypes.string,      // title for the "clear" control when multi: true
    clearValueText: PropTypes.string,    // title for the "clear" control
    clearable: PropTypes.bool,           // should it be possible to reset value
    delimiter: PropTypes.string,         // delimiter to use to join multiple values
    disabled: PropTypes.bool,            // whether the Select is disabled or not
    // never used filterOption: PropTypes.func,        // method to filter a single option  (option, filterString)
    // never used filterOptions: PropTypes.func,       // method to filter the options array: function ([options], filterString, [values])
    // ignoreCase: PropTypes.bool,          // whether to perform case-insensitive filtering
    // inputProps: PropTypes.object,        // custom attributes for the Input (in the Select-control) e.g: {'data-foo': 'bar'}
    isLoading: PropTypes.bool,           // whether the Select is loading externally or not (such as options being loaded)
    labelKey: PropTypes.string,          // path of the label value in option objects
    // matchPos: PropTypes.string,          // (any|start) match the start or entire string when filtering
    matchProp: PropTypes.string,         // (any|label|value) which option property to filter on
    multi: PropTypes.bool,               // multi-value input
    name: PropTypes.string,              // field name, for hidden <input /> tag
    newOptionCreator: PropTypes.func,    // factory to create new options when allowCreate set
    noResultsText: PropTypes.string,     // placeholder displayed when there are no matching search results
    onBlur: PropTypes.func,              // onBlur handler: function (event) {}
    onChange: PropTypes.func,            // onChange handler: function (newValue) {}
    onAdd: PropTypes.func,            // onChange handler: function (newValue) {}
    onFocus: PropTypes.func,             // onFocus handler: function (event) {}
    onInputChange: PropTypes.func,       // onInputChange handler: function (inputValue) {}
    onOptionLabelClick: PropTypes.func,  // onCLick handler for value labels: function (value, event) {}
    // optionComponent: PropTypes.func,     // option component to render in dropdown
    // optionRenderer: PropTypes.func,      // optionRenderer: function (option) {}
    options: PropTypes.array,            // array of options
    // ordered: PropTypes.bool,             // ordered values
    placeholder: PropTypes.string,       // field placeholder, displayed when there's no value
    searchable: PropTypes.bool,          // whether to enable searching feature or not
    searchingText: PropTypes.string,     // message to display whilst options are loading via asyncOptions
    searchPromptText: PropTypes.string,  // label to prompt for search input
    singleValueComponent: PropTypes.func,// single value component when multiple is set to false
    value: PropTypes.any,                // initial field value
    valueComponent: PropTypes.func,      // value component to render in multiple mode
    valueKey: PropTypes.string,          // path of the label value in option objects
    valueRenderer: PropTypes.func        // valueRenderer: function (option) {}
}

MultiSelect.defaultProps = {
    addLabelText: 'Add "{label}"',
    allowCreate: false,
    asyncOptions: undefined,
    autoload: true,
    backspaceRemoves: true,
    cacheAsyncResults: true,
    className: undefined,
    clearAllText: 'Clear all',
    clearValueText: 'Clear value',
    clearable: true,
    delimiter: ',',
    disabled: false,
    ignoreCase: true,
    inputProps: {},
    isLoading: false,
    labelKey: 'label',
    matchPos: 'any',
    matchProp: 'any',
    name: undefined,
    newOptionCreator: undefined,
    noResultsText: 'No results found',
    onChange: undefined,
    onAdd: undefined,
    onInputChange: undefined,
    onOptionLabelClick: undefined,
    optionComponent: Option,
    options: undefined,
    ordered: false,
    placeholder: 'Select...',
    searchable: true,
    searchingText: 'Searching...',
    searchPromptText: 'Type to search',
    // singleValueComponent: SingleValue,
    value: undefined,
    // valueComponent: Value,
    valueKey: 'value'
};

export default MultiSelect;
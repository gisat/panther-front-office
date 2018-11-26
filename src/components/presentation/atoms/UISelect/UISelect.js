import React from 'react';
import ReactSelect from 'react-select';
import VirtualizedSelect from 'react-virtualized-select';
import PropTypes from 'prop-types';
import createFilterOptions from 'react-select-fast-filter-options';

import classNames from 'classnames';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

class UISelect extends React.PureComponent {

	static propTypes = {
		classes: PropTypes.string,
		clearable: PropTypes.bool,
		fullWidth: PropTypes.bool,
		label: PropTypes.string,
		name: PropTypes.string,
		multi: PropTypes.bool,
		onChange: PropTypes.func,
		options: PropTypes.array,
		optionClassName: PropTypes.string,
		optionHeight: PropTypes.number,
		optionRenderer: PropTypes.func,
		placeholder: PropTypes.string,
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
			PropTypes.array
		]),
		valueRenderer: PropTypes.func,
		virtualized: PropTypes.bool,
		resizable: PropTypes.bool,
		disabled: PropTypes.bool,
		inverted: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.filterOptions = null;
	}

	render() {
		let classes = classNames(
			'ptr-ui-select',
			this.props.classes, {
				'label-left': this.props.label === 'left',
				'label-top': this.props.label === 'top',
				'full-width': this.props.fullWidth,
				'resizable': this.props.resizable,
				'inverted': this.props.inverted
			}
		);
		let label;
		if (this.props.label && this.props.name){
			label = this.renderLabel();
		}

		let options = this.props.options;

		if(options.length > 0 && !this.filterOptions) {
			this.filterOptions = createFilterOptions({options});
		}

		let optionHeight = 35;
		if (this.props.optionHeight){
			optionHeight = this.props.optionHeight;
		}

		return (
			<div className={classes}>
				{label}
				{this.props.virtualized ? (
					<VirtualizedSelect
						clearable={false}
						name={this.props.name}
						onChange={this.props.onChange}
						options={options}
						optionHeight={optionHeight}
						filterOptions={this.filterOptions}
						placeholder={this.props.placeholder}
						value={this.props.value}
						disabled={this.props.disabled}
					/>
				):(
					<ReactSelect
						autosize
						multi={this.props.multi}
						clearable={this.props.clearable}
						name={this.props.name}
						onChange={this.props.onChange}
						optionClassName={this.props.optionClassName}
						options={options}
						optionRenderer={this.props.optionRenderer}
						filterOptions={this.filterOptions}
						placeholder={this.props.placeholder}
						value={this.props.value}
						valueRenderer={this.props.valueRenderer}
						disabled={this.props.disabled}
					/>
				)}

			</div>
		)
	}

	renderLabel(){
		return (
			<div className={'ptr-ui-select-label'}>{this.props.name}</div>
		)
	}
}

export default UISelect;

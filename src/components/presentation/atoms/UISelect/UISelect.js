import React from 'react';
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
		fullWidth: PropTypes.bool,
		label: PropTypes.string,
		name: PropTypes.string,
		onChange: PropTypes.func,
		options: PropTypes.array,
		placeholder: PropTypes.string,
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		disabled: PropTypes.bool
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
				'full-width': this.props.fullWidth
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

		return (
			<div className={classes}>
				{label}
				<VirtualizedSelect
					clearable={false}
					name={this.props.name}
					onChange={this.props.onChange}
					options={options}
					filterOptions={this.filterOptions}
					placeholder={this.props.placeholder}
					value={this.props.value}
					disabled={this.props.disabled}
				/>
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

import React from 'react';
import {withNamespaces} from '@gisatcz/ptr-locales';
import _ from 'lodash';

import {MultiSelect} from "@gisatcz/ptr-atoms";

import Page from '../../../Page';

const baseOptions = ['Chocolate', 'Strawberry', 'Vanilla'];

const customOptions = [
	{data: {labelCz: 'Čokoláda', key: 'adsddfsfds'}},
	{data: {labelCz: 'Jahoda', key: '7457784567'}  },
	{data: {labelCz: 'Vanilka', key: 'dfgdfg84g'}  }
];

class ItemSelectDoc extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			baseOptions: baseOptions,
			baseSelectedValues: ['Chocolate', 'Vanilla'],

			customOptions: customOptions,
			customSelectedValues: [customOptions[1]],

			creatableBaseOptions: baseOptions,
			creatableBaseSelectedValues: null,

			creatableCustomOptions: customOptions,
			creatableCustomSelectedValues: ['dfgdfg84g'],

			singleValueMultiselectOptions: customOptions,
			singleValueMultiselectValue: 'dfgdfg84g'
		};
	}

	onChange(type, selectedValues) {
		this.setState({[type]: selectedValues});
	}

	onAdd(optionsKey, selectedKeys, option) {
		this.setState({
			[optionsKey]: this.state[optionsKey] ? [...this.state[optionsKey], option] : [option],
			[selectedKeys]: this.state[selectedKeys] ? [...this.state[selectedKeys], option]  : [option]
		});
	}

	onOptionClick(keyPath, option) {
		if (keyPath) {
			window.alert(`Clicked: ${_.get(option, keyPath)}`)
		} else {
			window.alert(`Clicked: ${option}`)
		}
	}

	render() {
		return (
			<Page title="Item select">
				<div className="ptr-docs-panel-section">
					<h2>Basic multiselect</h2>
					<MultiSelect
						options = {this.state.baseOptions}
						selectedValues = {this.state.baseSelectedValues}

						onChange={(evt) => {this.onChange('baseSelectedValues', evt)}}
						onOptionLabelClick={(evt) => {this.onOptionClick(null, evt)}}
					/>
				</div>
				<div className="ptr-docs-panel-section">
					<h2>Disabled</h2>
					<MultiSelect
						disabled={true}
						options = {this.state.baseOptions}
						selectedValues = {this.state.baseSelectedValues}

						onChange={(evt) => {this.onChange('baseSelectedValues', evt)}}
						onOptionLabelClick={(evt) => {this.onOptionClick(null, evt)}}
					/>
				</div>
				<div className="ptr-docs-panel-section">
					<h2>Custom options multiselect</h2>
					<MultiSelect
						options = {this.state.customOptions}
						optionLabel = 'data.labelCz'
						optionValue = 'data.key'
						selectedValues = {this.state.customSelectedValues}

						onChange={(evt) => {this.onChange('customSelectedValues', evt)}}
						onOptionLabelClick={(evt) => {this.onOptionClick('data.key', evt)}}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Creatable</h2>
					<MultiSelect
						creatable
						onAdd={this.onAdd.bind(this, 'creatableBaseOptions', 'creatableBaseSelectedValues')}
						options = {this.state.creatableBaseOptions}
						selectedValues = {this.state.creatableBaseSelectedValues}

						onChange={(evt) => {this.onChange('creatableBaseSelectedValues', evt)}}
						onOptionLabelClick={(evt) => {this.onOptionClick(null, evt)}}
					/>
				</div>
				<div className="ptr-docs-panel-section">
					<h2>Custom options creatable with key</h2>
					<MultiSelect
						creatable
						onAdd={this.onAdd.bind(this, 'creatableCustomOptions', 'creatableCustomSelectedValues')}
						options = {this.state.creatableCustomOptions}
						optionLabel = 'data.labelCz'
						optionValue = 'data.key'
						selectedValues = {this.state.creatableCustomSelectedValues}
						withKeyPrefix

						onChange={(evt) => {this.onChange('creatableCustomSelectedValues', evt)}}
						onOptionLabelClick={(evt) => {this.onOptionClick('data.key', evt)}}
					/>
				</div>
				<div className="ptr-docs-panel-section">
					<h2>Single value multiselect creatable</h2>
					<MultiSelect
						creatable
						onAdd={this.onAdd.bind(this, 'singleValueMultiselectOptions', 'singleValueMultiselectValue')}
						options = {this.state.singleValueMultiselectOptions}
						optionLabel = 'data.labelCz'
						optionValue = 'data.key'
						selectedValues = {this.state.singleValueMultiselectValue}
						singleValue
						withKeyPrefix

						onChange={(evt) => {this.onChange('singleValueMultiselectValue', evt)}}
						onOptionLabelClick={(evt) => {this.onOptionClick('data.key', evt)}}
					/>
				</div>
			</Page>
		);
	}
}

export default withNamespaces()(ItemSelectDoc);
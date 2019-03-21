import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';

import Select from "../../../components/common/atoms/Select/Select";

const baseOptions = [
	{ value: 'chocolate', label: 'Chocolate'},
	{ value: 'strawberry', label: 'Strawberry'},
	{ value: 'vanilla', label: 'Vanilla'}
];

const customOptions = [
	{data: {labelCz: 'Čokoláda', key: 'adsddfsfds'} },
	{data: {labelCz: 'Jahoda', key: '7457784567'}  },
	{data: {labelCz: 'Vanilka', key: 'dfgdfg84g'}  }
];

class SelectDoc extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			basicValue: 'chocolate',
			basicSelectCustomizedOptionsValue: 'dfgdfg84g',
			selectAsTitleValue: baseOptions[0],
			selectAsTitlePrefixedValue: baseOptions[1],
		};
	}

	onChange(key, keyPath, value) {
		let val = value;
		if (keyPath) {
			val = _.get(value, keyPath);
		}

		this.setState({
			[key]: val
		});
	}

	render() {
		return (
			<div className="ptr-docs-panel-content">
				<div className="ptr-docs-panel-section">
					<h2>Basic select</h2>
					<p>Basic select with default options format.</p>
					<Select
						onChange={this.onChange.bind(this, 'basicValue')}
						options={baseOptions}
						value={this.state.basicValue}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Basic select with prefixed key</h2>
					<Select
						onChange={this.onChange.bind(this, 'basicSelectCustomizedOptionsValue', 'data.key')}
						options={customOptions}
						optionLabel="data.labelCz"
						optionValue="data.key"
						value={this.state.basicSelectCustomizedOptionsValue}
						withKeyPrefix
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Basic select disabled</h2>
					<Select
						disabled
						options={customOptions}
						optionLabel="data.labelCz"
						optionValue="data.key"
						value={customOptions[0]}
						withKeyPrefix
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Select as title</h2>
					<Select
						options={baseOptions}
						onChange={this.onChange.bind(this, 'selectAsTitleValue')}
						valueIsTitle
						value={this.state.selectAsTitleValue}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Select as title (with prefixed key)</h2>
					<Select
						options={baseOptions}
						onChange={this.onChange.bind(this, 'selectAsTitlePrefixedValue')}
						valueIsTitle
						value={this.state.selectAsTitlePrefixedValue}
						withKeyPrefix
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(SelectDoc);
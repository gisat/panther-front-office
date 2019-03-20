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
			basicSelectCustomizedOptionsValue: 'dfgdfg84g',
			selectAsTitleValue: baseOptions[0]
		};

		this.onSelectAsTitleOnChange = this.onSelectAsTitleOnChange.bind(this);
	}

	onSelectAsTitleOnChange(value) {
		this.setState({
			selectAsTitleValue: value
		});
	}

	onChangeCustom(key, value) {
		this.setState({
			[key]: value.data.key
		});
	}

	render() {
		return (
			<div className="ptr-docs-panel-content">
				<div className="ptr-docs-panel-section">
					<h2>Basic select</h2>
					<p>Basic select with default options format.</p>
					<Select
						options={baseOptions}
						value='chocolate'
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Basic select with prefixed key</h2>
					<Select
						onChange={this.onChangeCustom.bind(this, 'basicSelectCustomizedOptionsValue')}
						options={customOptions}
						optionLabel="data.labelCz"
						optionValue="data.key"
						value={this.state.basicSelectCustomizedOptionsValue}
						withKeyPrefix
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Select as title</h2>
					<Select
						options={baseOptions}
						onChange={this.onSelectAsTitleOnChange}
						valueIsTitle
						value={this.state.selectAsTitleValue}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Select as title (with prefixed key)</h2>
					<Select
						options={baseOptions}
						onChange={this.onSelectAsTitleOnChange}
						valueIsTitle
						value={this.state.selectAsTitleValue}
						withKeyPrefix
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(SelectDoc);
import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';

import Select from "../../../components/common/atoms/Select/Select";

const baseOptions = [
	{ value: 'chocolate', label: 'Chocolate', data: {labelCz: 'Čokoláda', key: 'adsddfsfds'} },
	{ value: 'strawberry', label: 'Strawberry', data: {labelCz: 'Jahoda', key: '7457784567'}  },
	{ value: 'vanilla', label: 'Vanilla', data: {labelCz: 'Vanilka', key: 'dfgdfg84g'}  }
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
			basicSelectCustomizedOptionsValue: customOptions[0],
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
			[key]: {...value, value: value.data.key, label: value.data.label}
		});
	}

	render() {
		return (
			<div className="ptr-docs-panel-content">
				<h2>Basic select</h2>
				<div className="ptr-docs-panel-section">
					<Select
						options={baseOptions}
					/>
				</div>

				<h2>Basic select with prefixed key</h2>
				<div className="ptr-docs-panel-section">
					<Select
						onChange={this.onChangeCustom.bind(this, 'basicSelectCustomizedOptionsValue')}
						options={customOptions}
						optionLabel="data.labelCz"
						optionValue="data.key"
						value={this.state.basicSelectCustomizedOptionsValue}
						withKeyPrefix
					/>
				</div>

				<h2>Select as title</h2>
				<div className="ptr-docs-panel-section">
					<Select
						options={baseOptions}
						onChange={this.onSelectAsTitleOnChange}
						valueIsTitle
						value={this.state.selectAsTitleValue}
					/>
				</div>

				<h2>Select as title (with prefixed key)</h2>
				<div className="ptr-docs-panel-section">
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
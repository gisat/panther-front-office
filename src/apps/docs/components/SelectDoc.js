import React from 'react';
import {withNamespaces} from "react-i18next";

import {Select} from '@gisatcz/ptr-atoms';

const baseOptions = ['Chocolate', 'Strawberry very loooooooooooooooooooooooong and tasty and sweet', 'Vanilla'];

const customOptions = [
	{data: {labelCz: 'Čokoláda', key: 'adsddfsfds'} },
	{data: {labelCz: 'Jahoda', key: '7457784567'}  },
	{data: {labelCz: 'Vanilka vanilková nejvanilkovatější ze všech vanilek v celém širém okolí a ještě dál', key: 'dfgdfg84g'}  }
];

class SelectDoc extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			basicCreatableOptions: [...baseOptions],
			basicCreatableValue: 'Strawberry',

			customCreatableOptions: [...customOptions],
			customCreatableValue: 'adsddfsfds',

			basicValue: 'Chocolate',
			basicClearableValue: 'Chocolate',
			basicSelectCustomizedOptionsValue: 'dfgdfg84g',
			selectAsTitleValue: baseOptions[0],
			selectAsTitlePrefixedValue: baseOptions[1],
		};
	}

	onChange(key, keyPath, option) {
		this.setState({
			[key]: option
		});
	}

	onCreate(valueState, optionsState, keyPath, labelPath, option) {
		this.setState({
			[optionsState]: [...this.state[optionsState], option]
		});
		this.onChange(valueState, keyPath, option);
	}

	render() {
		return (
			<div className="ptr-docs-panel-content">
				<div className="ptr-docs-panel-section">
					<h2>Basic select</h2>
					<p>Basic select with default options format.</p>
					<Select
						onChange={this.onChange.bind(this, 'basicValue', null)}
						options={baseOptions}
						value={this.state.basicValue}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Basic select clearable and multi</h2>
					<Select
						clearable
						multi
						onChange={this.onChange.bind(this, 'basicClearableValue', null)}
						options={baseOptions}
						value={this.state.basicClearableValue}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Basic select with prefixed key</h2>
					<Select
						clearable
						multi
						onChange={this.onChange.bind(this, 'basicSelectCustomizedOptionsValue', 'data.key')}
						options={customOptions}
						optionLabel="data.labelCz"
						optionValue="data.key"
						value={this.state.basicSelectCustomizedOptionsValue}
						withKeyPrefix
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Creatable select</h2>
					<Select
						onChange={this.onChange.bind(this, 'basicCreatableValue', null)}
						onCreate={this.onCreate.bind(this, 'basicCreatableValue', 'basicCreatableOptions', null, null)}
						options={this.state.basicCreatableOptions}
						type="creatable"
						value={this.state.basicCreatableValue}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Creatable select - custom options</h2>
					<Select
						onChange={this.onChange.bind(this, 'customCreatableValue', 'data.key')}
						onCreate={this.onCreate.bind(this, 'customCreatableValue', 'customCreatableOptions', 'data.key', 'data.labelCz')}
						optionLabel="data.labelCz"
						optionValue="data.key"
						options={this.state.customCreatableOptions}
						type="creatable"
						value={this.state.customCreatableValue}
					/>
				</div>


				<div className="ptr-docs-panel-section">
					<h2>Basic select disabled</h2>
					<Select
						disabled
						options={customOptions}
						optionLabel="data.labelCz"
						optionValue="data.key"
						value='adsddfsfds'
						withKeyPrefix
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Select as title</h2>
					<Select
						options={baseOptions}
						onChange={this.onChange.bind(this, 'selectAsTitleValue', null)}
						valueIsTitle
						value={this.state.selectAsTitleValue}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Select as title (with prefixed key)</h2>
					<Select
						options={baseOptions}
						onChange={this.onChange.bind(this, 'selectAsTitlePrefixedValue', null)}
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
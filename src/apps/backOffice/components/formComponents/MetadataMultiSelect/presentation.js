import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import _ from 'lodash';

import {MultiSelect} from "@gisatcz/ptr-atoms";

class MetadataMultiSelect extends React.PureComponent {
	static propTypes = {
		disabled: PropTypes.bool,
		enableCreate: PropTypes.bool,
		withKeyPrefix: PropTypes.bool,
		singleValue: PropTypes.bool,

		onAdd: PropTypes.func,
		onOpen: PropTypes.func,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		unfocusable: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.onAdd = this.onAdd.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onOpen = this.onOpen.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	onAdd(option) {
		this.props.onAdd(option.key);
		let keys = this.props.keys ? [...this.props.keys, option.key] : [option.key];
		this.props.onChange(keys);
	}

	onChange(selectedModels) {
		let keys = selectedModels.map(model => model.key);
		this.props.onChange(keys);
	}

	onOpen(option) {
		this.props.onOpen(option.key);
	}

	render() {
		// at least selected tags should by in the store
		let options = this.props.options;
		if (!this.props.options) {
			options = this.props.selected;
		}

		return (
			<MultiSelect
				creatable={this.props.enableCreate}
				disabled={this.props.disabled}
				onAdd={this.onAdd}
				options = {options}
				optionLabel = 'data.nameDisplay'
				optionValue = 'key'
				selectedValues = {this.props.selected}
				singleValue={this.props.singleValue}
				unfocusable={this.props.unfocusable}
				withKeyPrefix={this.props.withKeyPrefix}

				onChange={this.onChange}
				onOptionLabelClick={this.onOpen}
			/>
		);
	}
}

export default withNamespaces(['backOffice'])(MetadataMultiSelect);
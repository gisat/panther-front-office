import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import classnames from 'classnames';
import {withNamespaces} from "react-i18next";
import Select from "../../../../../components/common/atoms/Select/Select";

class ApplicationSelect extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		unfocusable: PropTypes.bool,
		value: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	onChange(value) {
		let key = value.key;
		if (key === 'allApps') {
			key = null;
		}

		this.formatOptionLabel = this.formatOptionLabel.bind(this);
		this.props.onChange('applicationKey', key);
	}

	render() {
		let t = this.props.t;
		let data = [{
			key: 'allApps',
			data: {
				name: t('metadata.formLabels.allApps')
			}
		}];
		let value = this.props.value ? this.props.value : data[0];

		if (this.props.data) {
			data = [...data, ...this.props.data];
		}

		return (
			<Select
				disabled={this.props.disabled}
				formatOptionLabel={this.formatOptionLabel}
				onChange={this.onChange}
				options={data}
				optionLabel="data.name"
				optionValue="key"
				unfocusable={this.props.unfocusable}
				value={value}
			/>
		);
	}

	formatOptionLabel(option) {
		let classes = classnames('label', {
			'emphasized': option.key === 'allApps'
		});

		return (
			<div className={classes} key='label'>
				{option.data.name}
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(ApplicationSelect);
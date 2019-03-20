import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import {withNamespaces} from "react-i18next";
import Select from "../../../../atoms/Select/Select";

class ApplicationSelect extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		onChange: PropTypes.func,
		value: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	onChange(value) {
		this.props.onChange('applicationKey', value.key);
	}

	render() {
		return (
			<Select
				onChange={this.onChange}
				options={this.props.data}
				optionLabel="data.name"
				optionValue="key"
				value={this.props.value}
			/>
		);
	}
}

export default withNamespaces()(ApplicationSelect);
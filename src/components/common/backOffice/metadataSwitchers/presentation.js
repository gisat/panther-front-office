import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import {withNamespaces} from "react-i18next";

import Button from "../../atoms/Button";
import Select from '../../atoms/Select/Select';

import './MetadataSwitcher.scss';


class MetadataSwitcher extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		onChange: PropTypes.func,
		itemKey: PropTypes.string,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		onAddClick: PropTypes.func,
		unfocusable: PropTypes.bool
	};

	componentDidMount(){
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		const t = this.props.t;
		let selectedValue = null;

		// filter null values
		let relevantData = _.compact(this.props.data);

		if (relevantData) {
			selectedValue = relevantData.find(i => i.key === this.props.itemKey);
		}
		
		return (
			<div className="ptr-screen-metadata-switcher-content">
				<Select
					unfocusable={this.props.unfocusable}
                    options = {relevantData}
					optionValue="key"
                    value = {selectedValue}
					valueIsTitle
					optionLabel="data.nameDisplay"
					onChange={this.props.onChange}
					withKeyPrefix
				/>
				<Button
					title={t('createCapitalized')}
					icon="plus"
					ghost
					onClick={this.props.onAddClick}
					unfocusable={this.props.unfocusable}
				/>
			</div>
		);
	}
}

export default withNamespaces()(MetadataSwitcher);
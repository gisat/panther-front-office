import React from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';
import Select from "../../../../../components/common/atoms/Select/Select";

import './style.scss';
import Button from "../../../../../components/common/atoms/Button";

class AreasFilter extends React.PureComponent {

	static propTypes = {
		activeFilter: PropTypes.object,
		onClear: PropTypes.func,
		onSelect: PropTypes.func,
		options: PropTypes.array
	};

	constructor(props) {
		super(props);

		this.onCountrySelect = this.onCountrySelect.bind(this);
		this.onFilterClear = this.onFilterClear.bind(this);
	}

	onCountrySelect(record) {
		if (record && record.length) {
			if (this.props.onSelect) {
				let codes = record.map(rec => rec.code);
				let units = record.map(rec => rec.units);
				this.props.onSelect(codes.join(', '), codes, _.flatten(units));
			}
		} else {
			this.onFilterClear();
		}
	}

	onFilterClear() {
		if (this.props.onClear) {
			this.props.onClear();
		}
	}

	render() {
		let selectedCountry = this.props.activeFilter && this.props.activeFilter.data  && this.props.activeFilter.data.values  && this.props.activeFilter.data.values;

		return (
			<div className="esponFuore-areas-filter">
				<div className="esponFuore-areas-filter-attribute">
					<span>Select country</span>
					<Select
						clearable
						multi
						onChange={this.onCountrySelect}
						options={_.orderBy(this.props.options, ["code"], ["asc"])}
						optionLabel="code"
						optionValue="code"
						value={selectedCountry}
					/>
				</div>

				<div className="esponFuore-areas-filter-buttons">
					<Button
						icon="times"
						disabled={!this.props.activeFilter}
						onClick={this.onFilterClear}
					>
						Clear filter
					</Button>
				</div>
			</div>
		);
	}
}

export default AreasFilter;

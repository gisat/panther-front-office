import React from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';
import Select from "../../../../../components/common/atoms/Select/Select";

import './style.scss';
import Button from "../../../../../components/common/atoms/Button";
import AttributeFilter from "./AttributeFilter";

class AreasFilter extends React.PureComponent {

	static propTypes = {
		activeAttribute: PropTypes.object,
		activeAttributeData: PropTypes.object,
		activeAttributeStatistics: PropTypes.object,
		activeSelection: PropTypes.object,
		activeSubfilters: PropTypes.array,
		activeAttributeKey: PropTypes.string,
		activePeriodKeys: PropTypes.array,
		activeScopeKey: PropTypes.string,
		onClear: PropTypes.func,
		onSelect: PropTypes.func,
		countryAttributeKey: PropTypes.string,
		countryOptions: PropTypes.array
	};

	constructor(props) {
		super(props);

		this.onCountrySelect = this.onCountrySelect.bind(this);
		this.onAttributeFilterChange = this.onAttributeFilterChange.bind(this);

		this.onSelectionClear = this.onSelectionClear.bind(this);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.activeAttributeKey !== this.props.activeAttributeKey) {
			this.onSelectionClear();
		} else if (prevProps.activePeriodKeys !== this.props.activePeriodKeys) {
			this.onSelectionClear();
		} else if (prevProps.activeScopeKey !== this.props.activeScopeKey) {
			this.onSelectionClear();
		}
	}


	onCountrySelect(record) {
		if (record && record.length) {
			if (this.props.onSelect) {
				let codes = record.map(rec => rec.code);
				let units = record.map(rec => rec.units);
				let filter = {
					filteredKeys: _.flatten(units),
					attributeKey: this.props.countryAttributeKey,
					type: 'uniqueValues',
					uniqueValues: codes
				};

				this.props.onSelect(this.props.countryAttributeKey, filter);
			}
		} else {
			this.props.onSelect(this.props.countryAttributeKey, null);
		}
	}

	onSelectionClear() {
		if (this.props.onClear) {
			this.props.onClear();
		}
	}

	onAttributeFilterChange(range) {
		if (range) {
			this.updateActiveAttributeFilter(range[0], range[1]);
		}
	}

	updateActiveAttributeFilter(min, max) {
		let filter = {
			filteredKeys: this.getUnitsByRange(min, max),
			attributeKey: this.props.activeAttribute.key,
			type: 'interval',
			min,
			max
		};

		this.props.onSelect( this.props.activeAttribute.key, filter);
	}

	getUnitsByRange(min, max) {
		let periodKey = this.props.activePeriodKeys[0];
		let data = this.props.activeAttributeData[periodKey];
		return _.map(_.filter(data, (item) => {return item.value >= min && item.value <= max}), item => item.key);
	}

	render() {
		const props = this.props;
		let selectedCountries = null;
		let activeAttributeFilter = null;
		let statistic = props.activeAttributeStatistics;

		if (props.activeSubfilters) {
			let countriesFilter = _.find(props.activeSubfilters, {attributeKey: props.countryAttributeKey});
			if (countriesFilter) {
				selectedCountries = countriesFilter.uniqueValues;
			}
			if (props.activeAttribute) {
				activeAttributeFilter = _.find(props.activeSubfilters, {attributeKey: props.activeAttribute.key});
			}
		}

		let areasInfoContent = null;
		if (props.activeSelection) {
			let selectedItemsLength = props.activeSelection && props.activeSelection.data && props.activeSelection.data.filteredKeys && props.activeSelection.data.filteredKeys.length;
			let text = selectedItemsLength === 1 ? "area" : "areas";
			areasInfoContent = `${selectedItemsLength} ${text} filtered`;
		}

		return (
			<div className="esponFuore-areas-filter">
				<div className="esponFuore-areas-filter-content">
					<div className="esponFuore-areas-filter-attribute">
						<span>Select country</span>
						<Select
							clearable
							multi
							onChange={this.onCountrySelect}
							options={_.orderBy(props.countryOptions, ["code"], ["asc"])}
							optionLabel="code"
							optionValue="code"
							value={selectedCountries}
						/>
					</div>
					<div className="esponFuore-areas-filter-attribute slider">
						<span>{props.activeAttribute ? props.activeAttribute.data.nameDisplay : null}</span>
						{statistic ? (
							<AttributeFilter
								activeFilter={activeAttributeFilter}
								onChange={this.onAttributeFilterChange}
								min={statistic && statistic.min}
								max={statistic && statistic.max}
							/>
						) : null}
					</div>
				</div>

				<div className="esponFuore-areas-filter-buttons">
					<div className="esponFuore-areas-filter-areas-info">{areasInfoContent}</div>
					<Button
						invisible
						disabled={!props.activeSelection}
						onClick={this.onSelectionClear}
					>
						Clear filter
					</Button>
				</div>
			</div>
		);
	}
}

export default AreasFilter;

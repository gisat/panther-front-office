import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import utils from '../../../../../utils/utils';

import presentation from "./presentation";

const getUniqueCountries = (features) => {
	const countries = [];
	features.features.forEach((f) => {
		let country = countries.find(c => f.properties.cntr === c.code);
		if(!country) {
			country = {code: f.properties.cntr, units: []}
			countries.push(country);
		}

		country.units.push(f.properties.objectid);
	})
	return countries;
}

const mapStateToProps = (state, ownProps) => {

	let activeScope = Select.scopes.getActive(state);
	let countryFilterAttributeKey = activeScope && activeScope.data && activeScope.data.configuration && activeScope.data.configuration.countryCodeAttributeKey;
	let countryFilter = {attributeKey: countryFilterAttributeKey, scopeKey: activeScope.key};

	const relations = Select.attributeRelations.getFiltered(state, countryFilter);
	const attributeDataSourceKey = relations[0].attributeDataSourceKey
	let attributes = Select.attributeData.getByKey(state, attributeDataSourceKey);

	const countryCodes = getUniqueCountries(attributes.attributeData);

	return {
		activeFilter: Select.selections.getActive(state),
		options: countryCodes
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_AreasFilter_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			onClear: () => {
				dispatch(Action.selections.clearActiveSelection());
			},
			onSelect: (name, values, areas) => {
				dispatch(Action.selections.updateActiveSelection(name, values, areas));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
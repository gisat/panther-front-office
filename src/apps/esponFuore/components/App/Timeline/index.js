import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import utils from '../../../../../utils/utils';

import presentation from "./presentation";

const periodsOrder = [['period', 'ascending']];
const periodsFilterByActive = {application: true};

let filter = {};

const mapStateToProps = (state, ownProps) => {
	let scopeKey = Select.scopes.getActiveKey(state);
	let attributeKey = Select.attributes.getActiveKey(state);

	if (!_.isEqual(filter, {scopeKey, attributeKey})){
		filter = {scopeKey, attributeKey}
	}

	return {
		activeAttributeKey: attributeKey,
		activeScopeKey: scopeKey,
		activePeriodKeys: Select.periods.getActiveKeys(state),
		availablePeriodKeys: Select.periods.getKeysByAttributeRelations(state, filter, 'timeline'),
		periods: Select.periods.getIndexed(state, periodsFilterByActive, null, periodsOrder, 1, 100)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_Timeline_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			addMap: (periodKey) => {
				dispatch(Action.maps.addMapForPeriod(periodKey, ownProps.mapSetKey));
			},
			onActivePeriodsChange: (keys) => {
				dispatch(Action.periods.setActiveKeys(keys));
			},
			onMount: () => {
				dispatch(Action.periods.useIndexed(periodsFilterByActive, null, periodsOrder, 1, 100, componentId));
			},
			onActiveAttributeChange: (attributeKey, scopeKey) => {
				dispatch(Action.attributeRelations.ensureIndexed({scopeKey, attributeKey}, null, 1, 1000));
			},
			onUnmount: () => {
				dispatch(Action.periods.useIndexedClear(componentId));
			},
			removeMap: (periodKey) => {
				dispatch(Action.maps.removeMapForPeriod(periodKey, ownProps.mapSetKey));
			},
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
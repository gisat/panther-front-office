import {connect} from '@gisatcz/ptr-state';
import {Action, Select} from '@gisatcz/ptr-state';

import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const filterByActive = {application: true};
const periodsOrder = [["period", "descending"]];

const mapStateToProps = state => {
	return {
		templateKeys: Select.app.getConfiguration(state, 'templates'),
		periods: Select.periods.getIndexed(state, filterByActive, null, periodsOrder, 1, 200),
		layerTemplates: Select.layerTemplates.getIndexed(state, filterByActive, null, null, 1, 20),
		activeLayerTemplateKey: Select.layerTemplates.getActiveKey(state),
		activePeriodKey: Select.periods.getActiveKey(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'tacrGeoinvaze_CaseDetail_' + utils.randomString(6);
	
	return (dispatch, ownProps) => {
		
		return {
			onMount: () => {
				// TODO order
				dispatch(Action.periods.useIndexed(filterByActive, null, periodsOrder, 1, 200, componentId));
				dispatch(Action.layerTemplates.useIndexed(filterByActive, null, null, 1, 20, componentId));
			},
			onUnmount: () => {
				dispatch(Action.periods.useIndexedClear(componentId));
				dispatch(Action.layerTemplates.useIndexedClear(componentId));
			},
			setActiveLayerTemplate: (key) => {
				dispatch(Action.layerTemplates.setActiveKey(key));
			},
			setActivePeriod: (key) => {
				dispatch(Action.periods.setActiveKey(key));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
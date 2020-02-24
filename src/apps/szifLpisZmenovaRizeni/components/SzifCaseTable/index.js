import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';
import {getStatusesForUserGroups} from '../../constants/LpisCaseStatuses';
import presentation from "./presentation";
import utils from "../../../../utils/utils";

const filterComponentId = 'SzifCaseTableFilterStatus';

const mapStateToProps = state => {
	const casesLeft = Select.components.get(state, 'szifZmenovaRizeni_CaseCounter', 'weekCaseCountLeft');
	const userGroups = Select.specific.lpisZmenovaRizeni.getActiveUserGroups(state);
	const activeUserCanAddCase = Select.specific.lpisZmenovaRizeni.activeUserCanAddCase(state);
	const statusesOptions = getStatusesForUserGroups(userGroups);

	const {filter, order} = Select.components.getDataByComponentKey(state, filterComponentId) || {filter:{status:{in:statusesOptions[0].keys}}, order: [['submitDate', 'descending']]};
	const status = filter.status.in;

	return {
		cases: Select.specific.lpisChangeCases.getIndexed(state, null, filter, order, 1, 1000),
		casesLeft,
		userGroups,
		activeUserCanAddCase,
		casesFilter: filter,
		casesOrder: order,
		selectedStatus: status,
		statusesOptions,
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'SzifCaseTable' + utils.randomString(6);
	

	return (dispatch) => {
		return {
			onMount: (defaultFilter, order) => {
				dispatch(Action.specific.lpisChangeCases.refreshUses(null, defaultFilter, order, 1, 1000, componentId));
			},
			onChangeStatus: (newFilter, order) => {
				const filter = {status:{in: newFilter.keys}};
				dispatch(Action.components.update(filterComponentId, {filter, order}));
				dispatch(Action.specific.lpisChangeCases.refreshUses(null, filter, order, 1, 1000, componentId));
			},
			switchScreenToExplorer: () => {
				dispatch(Action.components.set('szifScreenAnimator', 'activeScreenKey', 'szifSentinelExplorer'));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
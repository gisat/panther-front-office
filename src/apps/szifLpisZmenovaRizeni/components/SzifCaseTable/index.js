import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';
import {statusesOptionsGisatAdmins, statusesOptionsGisatUsers, statusesOptionsSzif} from '../../constants/LpisCaseStatuses';
import presentation from "./presentation";
import utils from "../../../../utils/utils";

const order = [['submitDate', 'descending']];
const filterComponentId = 'SzifCaseTable' + utils.randomString(6);

const mapStateToProps = state => {
	const casesLeft = Select.components.get(state, 'szifZmenovaRizeni_CaseCounter', 'weekCaseCountLeft');
	const userGroups = Select.specific.lpisZmenovaRizeni.getActiveUserGroups(state);
	const activeUserCanAddCase = Select.specific.lpisZmenovaRizeni.activeUserCanAddCase(state);

	let statusesOptions = null;
	if (userGroups.includes('gisatUsers')) {
		statusesOptions = statusesOptionsGisatUsers;
	} else if (userGroups.includes('gisatAdmins')){
		statusesOptions = statusesOptionsGisatAdmins;
	} else {
		statusesOptions = statusesOptionsSzif;
	}

	const {filter} = Select.components.getDataByComponentKey(state, filterComponentId) || {filter:{status:{in:statusesOptions[0].keys}}};
	const status = filter.status.in;

	return {
		cases: Select.specific.lpisChangeCases.getIndexed(state, null, filter, order, 1, 1000),
		casesLeft,
		userGroups,
		activeUserCanAddCase,
		casesFilter: filter,
		selectedStatus: status,
		statusesOptions,
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'SzifCaseTable' + utils.randomString(6);
	

	return (dispatch) => {
		return {
			onMount: (defaultFilter) => {
				dispatch(Action.specific.lpisChangeCases.refreshUses(null, defaultFilter, order, 1, 1000, componentId));
			},
			onChangeStatus: (newFilter) => {
				const filter = {status:{in: newFilter.keys}};
				dispatch(Action.components.set(filterComponentId, 'filter', filter));
				dispatch(Action.specific.lpisChangeCases.refreshUses(null, filter, order, 1, 1000, componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
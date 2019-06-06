import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../../state/Action';
import Select from '../../../../../../state/Select';
import utils from '../../../../../../utils/utils';

import presentation from "./presentation";

const filter = {application: true};

const mapStateToProps = (state, ownProps) => {
	return {
		caseSelectOpen: Select.components.get(state, 'tacrGeoinvaze_CaseSelect', 'caseSelectOpen'),
		// cases: Select.cases.getIndexed(state, filter, null, null, 1, 20),
		// activeCase: Select.cases.getActive(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'tacrGeoinvaze_CaseSelect_' + utils.randomString(6);

	return dispatch => {
		return {
			openSelect: () => {
				dispatch(Action.components.set('tacrGeoinvaze_CaseSelect', 'caseSelectOpen', true))
			},
			closeSelect: () => {
				dispatch(Action.components.set('tacrGeoinvaze_CaseSelect', 'caseSelectOpen', false))
			},
			onMount: () => {
				// TODO order
				// dispatch(Action.cases.useIndexed({application: true}, null, null, 1, 20, componentId));
			},
			onUnmount: () => {
				// dispatch(Action.cases.useIndexedClear(componentId));
			},
			selectCase: (key) => {
				// dispatch(Action.cases.setActiveKey(key));
				dispatch(Action.components.set('tacrGeoinvaze_CaseSelect', 'caseSelectOpen', false));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
import {connect} from '@gisatcz/ptr-state';
import {Action, Select} from '@gisatcz/ptr-state';
import {utils} from '@gisatcz/ptr-utils'

import presentation from "./presentation";

const filter = {application: true};

const mapStateToProps = (state, ownProps) => {
	return {
		caseSelectOpen: Select.components.get(state, 'tacrGeoinvaze_CaseSelect', 'caseSelectOpen'),
		activeCase: Select.cases.getActive(state)
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

			},
			onUnmount: () => {

			},
			selectCase: (key) => {
				dispatch(Action.cases.setActiveKey(key));
				dispatch(Action.components.set('tacrGeoinvaze_CaseSelect', 'caseSelectOpen', false));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
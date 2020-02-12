import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";
import utils from "../../../../utils/utils";

const mapStateToProps = state => {
	return {
		activeEditedCase: Select.specific.lpisChangeCasesEdited.getActiveEditedCase(state),
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'SzifCaseForm' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: (caseKey) => {
				if(!caseKey) {
					dispatch(Action.specific.lpisChangeCasesEdited.createNewActiveEditedCase());
				}
			},
			onUnmount: () => {
				dispatch(Action.specific.lpisChangeCasesEdited.clearActiveEditedCaseKey());
			},
			createLpisCase:() => {
				return dispatch(Action.specific.lpisChangeCasesEdited.createLpisCase());
			},
			createNewActiveEditedCase: () => {
				dispatch(Action.specific.lpisChangeCasesEdited.createNewActiveEditedCase());
			},
			editActiveEditedCase: (column, value, file) => {
				dispatch(Action.specific.lpisChangeCasesEdited.editActiveEditedCase(column, value, file));
			},
			clearActiveEditedCase: () => {
				dispatch(Action.specific.lpisChangeCasesEdited.clearActiveEditedCase());
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
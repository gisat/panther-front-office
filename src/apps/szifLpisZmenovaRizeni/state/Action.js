import CommonAction from '../../../state/Action';
import Select from '../state/Select';

import lpisChangeCases from './LpisChangeCases/actions';
import lpisChangeCasesEdited from './LpisChangeCasesEdited/actions';

const applyView = (viewKey) => (dispatch, getState) => {
	if (!viewKey) {
		viewKey = Select.views.getActiveKey(getState());
		dispatch(CommonAction.views.apply(viewKey, CommonAction));
	}
};

const szifLpisZmenovaRizeni = {
	applyView
};

export default {
	...CommonAction,
	specific: {
		lpisChangeCases,
		lpisChangeCasesEdited,
		szifLpisZmenovaRizeni
	}
}
import CommonAction from '../../../state/Action';
import utils from '../../../utils/utils';
import Select from '../state/Select';
import cloneDeep from 'lodash/cloneDeep';

import lpisChangeCases from './LpisChangeCases/actions';
import lpisChangeCasesEdited from './LpisChangeCasesEdited/actions';

const applyView = (viewKey) => (dispatch, getState) => {
	//apply default view
	if (!viewKey) {
		viewKey = Select.views.getActiveKey(getState());
		dispatch(CommonAction.views.apply(viewKey, CommonAction));	
	} else {
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
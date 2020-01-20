import CommonAction from '../../../state/Action';
import utils from '../../../utils/utils';
import Select from '../state/Select';
import cloneDeep from 'lodash/cloneDeep';

import lpisChangeCases from './LpisChangeCases/actions';
import lpisChangeCasesEdited from './LpisChangeCasesEdited/actions';

const applyView = (viewKey) => (dispatch, getState) => {
	//apply default view
	if (!viewKey) {
		const state = getState();
		viewKey = Select.views.getActiveKey(state);
		const view = cloneDeep(Select.views.getDataByKey(state, viewKey));

		//todo -> set map center
		const newViewKey = utils.uuid();
		dispatch(CommonAction.views.add(
			{
				key: newViewKey,
				data: view,
			}
		))
		dispatch(CommonAction.views.setActiveKey(newViewKey));
		dispatch(CommonAction.views.apply(newViewKey, CommonAction));		
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
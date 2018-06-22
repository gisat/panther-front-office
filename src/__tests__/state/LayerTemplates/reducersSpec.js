import ActionTypes from '../../../constants/ActionTypes';
import layerTemplateReducer from '../../../state/LayerTemplates/reducers';
import {Reducer} from 'redux-testkit';

let state = {
	data: null
};

describe('Layer Templates Reducers', () => {
	it('should add data to state', () => {
		const action = {
			type: ActionTypes.LAYER_TEMPLATES_ADD,
			data: [{"name":"Urban Atlas","key": 1}]
		};
		const action2 = {
			type: ActionTypes.LAYER_TEMPLATES_ADD,
			data: [{"name":"Urban Atlas","key": 2}]
		};
		const expectedResult = {
			data: [{"name":"Urban Atlas","key": 1}]
		};
		const expectedResult2 = {
			data: [{"name":"Urban Atlas","key": 1}, {"name":"Urban Atlas","key": 2}]
		};
		Reducer(layerTemplateReducer).withState(state).expect(action).toReturnState(expectedResult);
		Reducer(layerTemplateReducer).withState(expectedResult).expect(action2).toReturnState(expectedResult2);
	});
});
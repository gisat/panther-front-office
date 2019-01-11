import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';
import _ from 'lodash';

const INITIAL_STATE = {
	components: {
		application: {
			intro: true,
			style: {
				activeKey: null,
				configuration: {
					forScope: {
						htmlClass: null
					},
					forUrl: {
						htmlClass: null
					}
				}
			}
		}
	}
};

describe('#Components selectors', () => {
	describe('#getApplicationStyleHtmlClass', () => {
		it('should select null, if there is no htmlClass for any configuration', () => {
			let selector = Selector(Select.components.getApplicationStyleHtmlClass).execute(INITIAL_STATE);
			expect(selector).toBeNull();
		});
		it('should select html class for url, if only forUrl is set', () => {
			const expectedResult = 'blue';
			let state = _.cloneDeep(INITIAL_STATE);
			state.components.application.style.configuration.forUrl.htmlClass = 'blue';
			let selector = Selector(Select.components.getApplicationStyleHtmlClass).execute(state);
			expect(selector).toBe(expectedResult);
		});
		it('should select html class for scope, if only forScope is set', () => {
			const expectedResult = 'red';
			let state = _.cloneDeep(INITIAL_STATE);
			state.components.application.style.configuration.forScope.htmlClass = 'red';
			let selector = Selector(Select.components.getApplicationStyleHtmlClass).execute(state);
			expect(selector).toBe(expectedResult);
		});
		it('should select html class for url, if both configurations are set', () => {
			const expectedResult = 'red';
			let state = _.cloneDeep(INITIAL_STATE);
			state.components.application.style.configuration = {
				forScope: {
					htmlClass: 'red'
				},
				forUrl: {
					htmlClass: 'blue'
				}
			};
			let selector = Selector(Select.components.getApplicationStyleHtmlClass).execute(state);
			expect(selector).toBe(expectedResult);
		});
	});
});
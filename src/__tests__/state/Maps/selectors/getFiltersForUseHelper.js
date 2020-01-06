import _ from 'lodash';
import Select from '../../../../state/Select';
import mapsSelector from '../../../../state/Maps/selectors';

describe('#getFiltersForUseHelper', () => {
	it('should return filters', () => {
		let activeKeys = {
			activeScopeKey: 'scope1',
			activePlaceKey: null,
			activePeriodKey: 'period1',
			activeCaseKey: null,
			activeScenarioKey: 'scenario1'
		};

		let layer = {
			layerTemplate: 'aaa',
			period: 'layerPeriod'
		};

		let expectedOutput = {
			filter: {
				periodKey: 'layerPeriod',
				layerTemplateKey: 'aaa'
			},
			filterByActive: {
				scope: true,
				place: true,
				case: true,
				scenario: true
			},
			mergedFilter: {
				scopeKey: 'scope1',
				periodKey: 'layerPeriod',
				scenarioKey: 'scenario1',
				layerTemplateKey: 'aaa'
			},
			layer
		};

		expect(mapsSelector.getFiltersForUse_deprecated(layer, activeKeys)).toEqual(expectedOutput)
	});

	it('should return filter if no activeKeys was passed', () => {
		let layer = {
			layerTemplate: 'aaa',
			period: 'layerPeriod'
		};

		let expectedOutput = {
			filter: {
				periodKey: 'layerPeriod',
				layerTemplateKey: 'aaa'
			},
			filterByActive: {
				scope: true,
				place: true,
				case: true,
				scenario: true
			},
			mergedFilter: {
				periodKey: 'layerPeriod',
				layerTemplateKey: 'aaa'
			},
			layer
		};

		expect(mapsSelector.getFiltersForUse_deprecated(layer)).toEqual(expectedOutput)
	});

	it('should return filter if empty activeKeys was passed', () => {
		let layer = {
			layerTemplate: 'aaa',
			period: 'layerPeriod'
		};
		let activeKeys = {};

		let expectedOutput = {
			filter: {
				periodKey: 'layerPeriod',
				layerTemplateKey: 'aaa'
			},
			filterByActive: {
				scope: true,
				place: true,
				case: true,
				scenario: true
			},
			mergedFilter: {
				periodKey: 'layerPeriod',
				layerTemplateKey: 'aaa'
			},
			layer
		};

		expect(mapsSelector.getFiltersForUse_deprecated(layer, activeKeys)).toEqual(expectedOutput)
	});
});
import commonHelpers from "../../../../state/_common/helpers";

describe('#mergeFilters', () => {
	it('should merge scopes', () => {
		const activeKeys = {
			activeScopeKey: 1,
			activeThemeKey: 2,
			activePlaceKey: 3,
			activePlaceKeys: null,
			activePeriodKey: null,
			activePeriodKeys: [4, 5]
		};
		const filterByActive = {
			scope: true
		};
		const filter = null;

		const expectedOutput = {
			scopeKey: 1
		};

		expect(commonHelpers.mergeFilters(activeKeys, filterByActive, filter)).toEqual(expectedOutput);
	});

	it('should merge scopes and places', () => {
		const activeKeys = {
			activeScopeKey: 1,
			activeThemeKey: 2,
			activePlaceKey: 3,
			activePlaceKeys: null,
			activePeriodKey: null,
			activePeriodKeys: [4, 5]
		};
		const filterByActive = {
			place: true
		};
		const filter = {
			scopeKey: 2
		};

		const expectedOutput = {
			scopeKey: 2,
			placeKey: 3
		};

		expect(commonHelpers.mergeFilters(activeKeys, filterByActive, filter)).toEqual(expectedOutput);
	});

	it('should merge overwtite scope with active scope key and add periods', () => {
		const activeKeys = {
			activeScopeKey: 1,
			activeThemeKey: 2,
			activePlaceKey: 3,
			activePlaceKeys: null,
			activePeriodKey: null,
			activePeriodKeys: [4, 5]
		};
		const filterByActive = {
			scope: true,
			period: true
		};
		const filter = {
			scopeKey: 2
		};

		const expectedOutput = {
			scopeKey: 1,
			periodKey: {
				key: {
					in: [4, 5]
				}
			}
		};

		expect(commonHelpers.mergeFilters(activeKeys, filterByActive, filter)).toEqual(expectedOutput);
	});

	it('should return filter if filterByActive is null', () => {
		const activeKeys = {
			activeScopeKey: 1,
			activeThemeKey: 2,
			activePlaceKey: 3,
			activePlaceKeys: null,
			activePeriodKey: null,
			activePeriodKeys: [4, 5]
		};
		const filterByActive = null;
		const filter = {
			scopeKey: 2
		};

		expect(commonHelpers.mergeFilters(activeKeys, filterByActive, filter)).toEqual(filter);
	});
});
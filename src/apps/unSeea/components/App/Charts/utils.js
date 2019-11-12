
const calculateMedian = (values) => [...values].sort((a, b) => a - b)[Math.round(values.length/2)];
export const calculateDataStatistics = (data, observedValues) => {
	
	//calculate data statistics
	const observedDataStatistics = observedValues.map(d => ({
		id: d.name,
		idNormalised: d.normalisedName,
		min: null,
		max: null,
		median: null,
		values: [],
		valuesNormalised: [],
		minNormalised: null,
		maxNormalised: null
	}))

	data.forEach((d) => {
		for (const [key, value] of Object.entries(d)) {
			const observedValue = observedValues.find(ov => ov.name === key);
			if(observedValue) {
				const statistics = observedDataStatistics.find(s => s.id === key);
				statistics.min = (statistics.min || statistics.min === 0) ? Math.min(statistics.min, value) : value;
				statistics.max = (statistics.max || statistics.max === 0) ? Math.max(statistics.max, value) : value;
				statistics.values.push(value);
			}

			const observedValueNormalised = observedValues.find(ov => ov.normalisedName === key);
			if(observedValueNormalised) {
				const statistics = observedDataStatistics.find(s => s.idNormalised === key);
				const normalisedValue = d[observedValueNormalised.normalisedName];
				statistics.minNormalised = (statistics.minNormalised || statistics.minNormalised === 0) ? Math.min(statistics.minNormalised, normalisedValue) : normalisedValue;
				statistics.maxNormalised = (statistics.maxNormalised || statistics.maxNormalised === 0) ? Math.max(statistics.maxNormalised, normalisedValue * 1000000 / d['Area of Borough']) : normalisedValue * 1000000 / d['Area of Borough'];
				statistics.valuesNormalised.push(normalisedValue);
			}
		}
	})

	const sumStatistics = {
		min: null,
		max: null,
		median: null,
		medianNormalised: null,
		values: [],
		valuesNormalised: [],
	}

	observedDataStatistics.forEach(s => {
		sumStatistics.min = (sumStatistics.min || sumStatistics.min === 0) ? Math.min(sumStatistics.min, s.min) : s.min;
		sumStatistics.max = (sumStatistics.max || sumStatistics.max === 0) ? Math.max(sumStatistics.max, s.max) : s.max;
		sumStatistics.minNormalised = (sumStatistics.minNormalised || sumStatistics.minNormalised === 0) ? Math.min(sumStatistics.minNormalised, s.minNormalised) : s.minNormalised;
		sumStatistics.maxNormalised = (sumStatistics.maxNormalised || sumStatistics.maxNormalised === 0) ? Math.max(sumStatistics.maxNormalised, s.maxNormalised) : s.maxNormalised;
		sumStatistics.values = [...sumStatistics.values, ...s.values];
		sumStatistics.valuesNormalised = [...sumStatistics.valuesNormalised, ...s.valuesNormalised];
		s.median = calculateMedian(s.values);
		s.medianNormalised = calculateMedian(s.valuesNormalised);
	});
	sumStatistics.median = calculateMedian(sumStatistics.values);
	return {
		observedDataStatistics,
		sumStatistics,
	}
}
export const calculateData = (data, observedValues, dataStatistics) => {
		// convert absolute numbers to relative
		//TODO -> should be in selector
		const relativeData = data.map((d) => {
			const calData = {};
			for (const [key, value] of Object.entries(d)) {
				
				const observedValue = observedValues.find(ov => ov.name === key);
				if(observedValue) {
					const exists = calData[key] || {};
					const statistics = dataStatistics.find(s => s.id === key);
					calData[key] = {
						...exists,
						relativeMax: 100 * value / statistics.max,
						relativeMedian: 100 * value / statistics.median,
						absolute: value
					}
				}


				const observedNormalisedValue = observedValues.find(ov => ov.normalisedName === key);
				if(observedNormalisedValue) {
					const statistics = dataStatistics.find(s => s.idNormalised === key);
					const name = observedNormalisedValue.name;
					const exists = calData[name] || {};
					calData[name] = {
						...exists,
						relativeNormalised: 100 * value / statistics.maxNormalised,
						absoluteNormalised: value * 1000000 / d['Area of Borough'] // normalisation in km2
					}
				}

				if(!calData[key]) {
					calData[key] = value;
				}
			}
			return calData;
		});

		return relativeData;
}
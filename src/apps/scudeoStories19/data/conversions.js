import _ from 'lodash';

function featuresToSerialData(features, normAttributeKey) {
	return _.map(featuresToSerialDataAsObject(features, normAttributeKey), feature => {
		/* convert data to array */
		feature.data = Object.values(feature.data);
		return feature;
	});
}

function featuresToAttributes(originalFeatures, key, period, attributes, normAttributeKey) {
	let features = featuresToSerialDataAsObject(originalFeatures, normAttributeKey);
	let areas = {};

	_.forEach(features, feature => {
		let data = feature.data[period];
		areas[feature[key]] = attributes.map(attribute => {
			let value = data[attribute.key];
			return {...attribute, value}
		});
	});

	return areas;
}

function featuresToAttributesSerial(originalFeatures, key, attributes, normAttributeKey) {
	let features = featuresToSerialDataAsObject(originalFeatures, normAttributeKey);
	let areas = {};

	_.forEach(features, feature => {
		areas[feature[key]] = attributes.map(attribute => {
			let serialData = [];
			_.forIn(feature.data, (value, key) => {
				let serieValue = 0;
				if (_.isArray(attribute.key)) {
					_.forEach(attribute.key, key => {
						serieValue += value[key]
					});
				} else {
					serieValue = value[attribute.key]
				}



				serialData.push({
					key,
					value: serieValue
				});
			});
			return {...attribute, key: (_.isArray(attribute.key) ? attribute.key[0] : attribute.key), data: serialData}
		});
	});

	return areas;
}

function featuresToSerialDataAsObject(features, normAttributeKey) {
	return _.map(features, feature => {
		let properties = feature.properties;

		let attributes = {
			data: {}
		};

		let normValue = normAttributeKey ? properties[normAttributeKey]: null;
		if (typeof normAttributeKey === "number") {
			normValue = normAttributeKey;
		}

		_.forEach(properties, (propValue, propKey) => {
			let parsedKey = propKey.split("_p_60000");
			if (parsedKey.length === 2) {
				let key = parsedKey[0];
				let period = parsedKey[1];

				/* add attribute-like properties to data */
				if (!attributes.data[period]) {
					attributes.data[period] = {
						[key]: normValue ? normalize(propValue, normValue) : propValue,
						period: Number(period)
					}
				} else {
					attributes.data[period][key] = normValue ? normalize(propValue, normValue) : propValue
				}

			} else {
				attributes[propKey] = propValue;
			}
		});
		return attributes;
	});
}

/**
 * Calculate changes in attributes between to and from
 * @param data {Array} prepared data
 * @param attributes {Array}
 * @param key {string} area key
 * @param from {number}
 * @param to {number}
 */
function getAttributeChanges(data, key, attributes, from, to) {
	let features = featuresToSerialDataAsObject(data);
	let areas = {};

	_.forEach(features, feature => {
		let data = feature.data;
		areas[feature[key]] = attributes.map(attribute => {
			let absolute = data[to][attribute.key] - data[from][attribute.key];
			return {
				...attribute,
				absolute: data[to][attribute.key] - data[from][attribute.key],
				relative: absolute*100/data[from][attribute.key]
			}
		});
	});

	return areas;
}

function normalize(value, normValue) {
	return +((value*100/normValue).toFixed(2));
}

function avarage(features, valuePath) {
	return features.reduce((acc, feature) => {
		return (acc + _.get(feature, valuePath)) / 2;
	}, 0)
}

/**
 * 
 * @param {Array} features 
 * @param {Array} valuePaths 
 */
function sum(features, valuePaths) {
	return features.reduce((acc, feature) => {
		return acc + valuePaths.reduce((acc, valuePath) => {
			const val = _.get(feature, valuePath) || 0;
			return acc + val;
		}, 0)
	}, 0)
}

const toSquareKm = (squareMeters) => squareMeters / 1000000;

export default {
	avarage,
	sum,
	featuresToSerialData,
	featuresToSerialDataAsObject,
	featuresToAttributes,
	featuresToAttributesSerial,
	toSquareKm,
	getAttributeChanges
}
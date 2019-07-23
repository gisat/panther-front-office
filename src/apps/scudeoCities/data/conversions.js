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

function featuresToSerialDataAsObject(features, normAttributeKey) {
	return _.map(features, feature => {
		let properties = feature.properties;

		let attributes = {
			data: {}
		};

		let normValue = normAttributeKey ? properties[normAttributeKey]: null;

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

function normalize(value, normValue) {
	return +((value*100/normValue).toFixed(2));
}

export default {
	featuresToSerialData,
	featuresToAttributes
}
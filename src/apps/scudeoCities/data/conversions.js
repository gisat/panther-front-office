import _ from 'lodash';

function featuresToSerialData(features) {
	return _.map(featuresToSerialDataAsObject(features), feature => {
		/* convert data to array */
		feature.data = Object.values(feature.data);
		return feature;
	});
}

function featuresToAttributes(originalFeatures, key, period, attributes, normAttributeKey) {
	let features = featuresToSerialDataAsObject(originalFeatures);
	let areas = {};

	_.forEach(features, feature => {
		let data = feature.data[period];
		areas[feature[key]] = attributes.map(attribute => {
			let value = data[attribute.key];
			if (normAttributeKey) {
				value = (Math.round((value*100)/data[normAttributeKey])*100)/100
			}

			return {...attribute, value}
		});
	});

	return areas;
}

function featuresToSerialDataAsObject(features) {
	return _.map(features, feature => {
		let properties = feature.properties;

		let attributes = {
			data: {}
		};

		_.forEach(properties, (propValue, propKey) => {
			let parsedKey = propKey.split("_p_60000");
			if (parsedKey.length === 2) {
				let key = parsedKey[0];
				let period = parsedKey[1];

				/* add attribute-like properties to data */
				if (!attributes.data[period]) {
					attributes.data[period] = {
						[key]: propValue,
						period: Number(period)
					}
				} else {
					attributes.data[period][key] = propValue
				}

			} else {
				attributes[propKey] = propValue;
			}
		});
		return attributes;
	});
}

export default {
	featuresToSerialData,
	featuresToAttributes
}
import _ from 'lodash';
import chroma from 'chroma-js';

const DEFAULT_STYLE_OBJECT = {
	fill: "#ffffff",
	fillOpacity: 1,
	outlineColor: "#000000",
	outlineWidth: 2,
	outlineOpacity: 1
};

// const FILTERED_STYLE_OBJECT ???

function getStyleObject(attributes, styleDefinition, omitDefault) {
	let finalStyleObject = {};

	if (styleDefinition && styleDefinition.rules) {
		_.each(styleDefinition.rules, (rule) => {
			if (rule.filter) {
				// TODO apply filter
			}

			if (rule.styles) {
				_.each(rule.styles, style => {
					let styleObject = {};
					if (style.attributeKey) {
						styleObject = getStyleObjectForAttribute(style, attributes);
					} else {
						styleObject = {...style}
					}

					finalStyleObject = {...finalStyleObject, ...styleObject}
				});
			}
		})
	}

	return omitDefault ? finalStyleObject : {...DEFAULT_STYLE_OBJECT, ...finalStyleObject}
}

/**
 * @param styleDefinition {Object} Style definition for given attribute key
 * @param attributes {Object} Feature attributes
 * @return {Object} Style object for given attribute key
 */
function getStyleObjectForAttribute(styleDefinition, attributes) {
	if (attributes.hasOwnProperty(styleDefinition.attributeKey)) {
		let value = attributes[styleDefinition.attributeKey];
		if (styleDefinition.attributeClasses) {
			return getStyleObjectForAttributeClasses(styleDefinition.attributeClasses, value);
		} else if (styleDefinition.attributeScale) {
			return getStyleObjectForAttributeScale(styleDefinition.attributeScale, value);
		} else if (styleDefinition.attributeTransformation) {
			return getStyleObjectForAttributeTransformation(styleDefinition.attributeTransformation, value);
		} else if (styleDefinition.attributeValues) {
			return getStyleObjectForAttributeValues(styleDefinition.attributeValues, value)
		}
		// TODO add other cases
		else {
			return {};
		}
	} else {
		return {};
	}
}

// ATTRIBUTE STYLE TYPES ---------------------------------------------------------------

/**
 * Attribute classes
 *
 * @param attributeClasses {Array}
 * @param value {number|String} attribute value
 */
function getStyleObjectForAttributeClasses(attributeClasses, value) {
	let styleObject = {};
	_.each(attributeClasses, attributeClass => {
		let {interval, intervalBounds, ...style} = attributeClass;

		if (!intervalBounds) {
			intervalBounds = [true, false];
		}

		if (isGreaterThan(value, interval[0], intervalBounds[0]) && isGreaterThan(interval[1], value, intervalBounds[1])) {
			styleObject = {...styleObject, ...style};
		}
	});

	return styleObject;
}

/**
 * Attribute value
 *
 * @param attributeValues {Object}
 * @param value {String} attribute value
 * @return {Object}
 */
function getStyleObjectForAttributeValues(attributeValues, value) {
	return attributeValues[value] || {};
}


/**
 * Attribute scale
 *
 * @param attributeScale {Object}
 * @param value {number|String} attribute value
 */
function getStyleObjectForAttributeScale(attributeScale, value) {
	let parameter = Object.keys(attributeScale)[0];
	let definitions = attributeScale[parameter];

	// check transformations
	if (definitions.inputTransformation) {
		value = doMathOperations(definitions.inputTransformation, value);
	}

	if (parameter === "outlineWidth") {
		return {
			outlineWidth: scaleValue(definitions.inputInterval, definitions.outputInterval, value)
		}
	} else if (parameter === "fill") {
		let scale = chroma.scale(definitions.outputInterval).domain(definitions.inputInterval);
		return {
			fill: chroma(scale(value)).hex()
		};
	} else if (parameter === "volume") {
		return {
			volume: scaleValue(definitions.inputInterval, definitions.outputInterval, value)
		};
	} else if (parameter === "size") {
		return {
			size: scaleValue(definitions.inputInterval, definitions.outputInterval, value)
		};
	} else if (parameter === "arrowLength") {
		return {
			arrowLength: scaleValue(definitions.inputInterval, definitions.outputInterval, value)
		}
	} else {
		return {};
	}
}

function getStyleObjectForAttributeTransformation(attributeTransformation, value) {
	let parameter = Object.keys(attributeTransformation)[0];
	let definitions = attributeTransformation[parameter];

	// check transformations
	if (definitions.inputTransformation) {
		value = doMathOperations(definitions.inputTransformation, value);
	}

	if (parameter === "arrowDirection") {
		return {
			arrowDirection: value
		}
	} else {
		return {};
	}
}


// HELPERS --------------------------------------------------------------------------------
function scaleValue (inputInterval, outputInterval, value) {
	const x1 = inputInterval[0];
	const x2 = inputInterval[1];
	const y1 = outputInterval[0];
	const y2 = outputInterval[1];

	return (value - x1) * ((y2 - y1) / (x2 - x1)) + y1;
}

function isGreaterThan(comparedValue, referenceValue, allowEquality) {
	if (allowEquality) {
		return comparedValue >= referenceValue;
	} else {
		return comparedValue > referenceValue;
	}
}

function doMathOperations(operations, value) {
	_.each(operations, operation => {
		if (operation === 'abs') {
			value = Math.abs(value);
		} else if (operation === 'sign') {
			value = Math.sign(value);
		}
	});

	return value;
}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

export default {
	getStyleObject,
	hexToRgb,
}
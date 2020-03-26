import React from 'react';
import i18n from 'i18next';

import _ from 'lodash';

import period, {toString as periodToString} from './period';
import {replaceIdWithKey, removeDuplicities} from './models';

//scales taken from https://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=6
const colorScales = [
	['#01665e','#8c510a'],
	['#4d9221','#c51b7d'],
	['#542788','#b35806'],
	['#2166ac','#b2182b'],
	['#1a9850','#d73027'],
]

export default {

	period: period,
	periodToString: periodToString,

	addI18nResources: function(namespace, resources){
		_.forIn(resources, (resource, language) => {
			i18n.addResourceBundle(language, namespace, resource, true, true);
		});
	},

	deepClone: function (data) {
		var clone = data;
		if (_.isObject(data) && !React.Component.isPrototypeOf(data)) {

			clone = _.clone(data);

			_.each(clone, function (value, key) {
				clone[key] = this.deepClone(value);
			}, this);

		}

		return clone;
	},

	deepCloneKeepModels: function (data) {
		var clone = data;
		if (
			_.isObject(data) && !React.Component.isPrototypeOf(data)
		//&& !(data instanceof GeneralModel)
		) {

			clone = _.clone(data);

			_.each(clone, function (value, key) {
				clone[key] = this.deepCloneKeepModels(value);
			}, this);

		}

		return clone;
	},

	clone: function (data) {
		var clone = data;
		if (
			_.isObject(data) && !React.Component.isPrototypeOf(data)
		) {

			clone = _.clone(data);

			_.each(clone, function (value, key) {
				clone[key] = this.deepCloneKeepModels(value);
			}, this);

		}

		return clone;
	},

	/**
	 * Generates v4 compliant UUID
	 * @returns {string|*|void}
	 */
	uuid() {
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		)
	},

	/**
	 * DEPRECATED!
	 * Generates pseudo-uuid string
	 * @returns {string}
	 */
	guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}

		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	},

	/**
	 * Generates random string of specified length.
	 * @param length
	 * @returns {string}
	 */
	randomString: length => ((Math.random() * Math.pow(36, length) >> 0).toString(36)),

	getRemSize: () => parseFloat(getComputedStyle(document.documentElement).fontSize),

	/**
	 * Promise.all() for objects (instead of arrays)
	 * @param object of promises
	 * @returns promise of object of resolved values
	 */
	promiseAll(object) {

		let promisedProperties = [];
		const objectKeys = Object.keys(object);

		objectKeys.forEach((key) => promisedProperties.push(object[key]));

		return Promise.all(promisedProperties)
			.then((resolvedValues) => {
				return resolvedValues.reduce((resolvedObject, property, index) => {
					resolvedObject[objectKeys[index]] = property;
					return resolvedObject;
				}, object);
			});

	},

	collectionsAreEqual (collection1, collection2, sortBy) {
		// Sort conditions so the arrays match up.
		sortBy = sortBy || 'id';
		collection1 = _.sortBy(collection1, sortBy);
		collection2 = _.sortBy(collection2, sortBy);
		return JSON.stringify(collection1) === JSON.stringify(collection2);
	},

	scrollTo(elementId, containerId, duration){
		let animationDuration = duration ? duration : 200;
		let container = document.getElementById(containerId);
		let element = document.getElementById(elementId);

		let elementOffset = element.offsetTop;
		let elementHeight = element.offsetHeight;
		let containerHeight = container.offsetHeight;
		let scroll = elementOffset + elementHeight - containerHeight + 10;

		document.getElementById(containerId).scrollTop = elementOffset;
	},

	renderParagraphWithSeparatedLines(text) {
		if (text && typeof text === "string"){
			let splittedText = text.split("\n");
			return (
				<p>
					{splittedText.map((rec, index) => {
						return (
							<span key={index}>
							{rec}{index === (splittedText.length - 1) ? null : <br/>}
						</span>
						)})
					}
				</p>
			);
		} else {
			return null;
		}
	},

	/**
	 * Get json-like formatted string
	 * @param json {JSON | string | null}
	 * @return {string}
	 */
	getStringFromJson (json) {
		if (json && typeof json === "object") {
			return JSON.stringify(json, null, 2)  ;
		} else {
			return json;
		}
	},

	/**
	 * Takes deep object and returns it with values containing path to that key in the object (where value isn't a nested object).
	 * e.g. {a: null, b: {c: null, d: null}} => {a: 'a', b: {c: 'b.c', d: 'b.d'}}
	 * Used for constants.
	 * @param object - input object or nested object when called recursively
	 * @param path - path to nested object when called recursively
	 * @returns object
	 */
	deepKeyMirror(object, path) {
		if (_.isObjectLike(object)) {
			return _.mapValues(object, (value, key) => {
				return this.deepKeyMirror(value, path ? path + '.' + key : key);
			});
		} else {
			return path;
		}
	},


	stringToNumHash(string) {
		string = '' + string;
		if (typeof string !== 'string') throw new Error('stringToNumHash: argument must be a string');
		let hash = 1;
		for (let i = 0; i < string.length; i++) {
			hash = Math.imul(hash + string.charCodeAt(i) | 0, 265443576107);
		}
		return (hash ^ hash >>> 17) >>> 0;
	},

	/**
	 * Deterministic two side colour scale set based on input string.
	 * @param string - input string
	 * @returns {Array} colors
	 */
	stringToColoursScale(string) {
		const hash = this.stringToNumHash(string);
		const scaleIndex = hash % (colorScales.length - 1)
		return colorScales[scaleIndex];
	},

	/**
	 * Deterministic colour set based on input string.
	 * @param string - input string
	 * @param count - number of colours
	 * @param options - hue, saturation and lightness ranges
	 * @returns {Array} css hsl codes
	 */
	stringToColours(string, count, options) {
		let hash = this.stringToNumHash(string);
		let colours = [];
		let defaults = {
			hue: [0,360],
			saturation: [35,65],
			lightness: [40,60]
		};
		options = {...defaults, ...options};
		let h, s, l;
		let hueRange = options.hue[1] - options.hue[0];
		let saturationRange = options.saturation[1] - options.saturation[0];
		let lightnessRange = options.lightness[1] - options.lightness[0];
		for (let i = 0; i < (count || 1); i++) {
			h = hash % hueRange + options.hue[0];
			hash = (hash ^ hash >>> 17) >>> 0;
			s = hash % saturationRange + options.saturation[0];
			hash = (hash ^ hash >>> 17) >>> 0;
			l = hash % lightnessRange + options.lightness[0];
			hash = (hash ^ hash >>> 17) >>> 0;
			colours.push('hsl(' + h + ',' + s + '%,' + l + '%)');
		}
		return colours;
	}
}



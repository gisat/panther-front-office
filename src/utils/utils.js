import React from 'react';

import _ from 'lodash';

import period, {toString as periodToString} from './period';
import {replaceIdWithKey, removeDuplicities} from './models';

export default {

	period: period,
	periodToString: periodToString,
	replaceIdWithKey: replaceIdWithKey,
	removeDuplicities: removeDuplicities,

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
	}
}



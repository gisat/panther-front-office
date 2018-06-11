import React from 'react';

import _ from 'lodash';

import period, {toString as periodToString} from './period';

export default {

	period: period,
	periodToString: periodToString,

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

	replaceIdWithKey (options) {
		if (options.length){
			return options.map(layer => {
				let clone = _.cloneDeep(layer);
				clone.key = clone.id;
				delete clone.id;
				return clone;
			});
		} else {
			return options;
		}
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

		let step = Math.floor((animationDuration/scroll));
		// let interval = setInterval(scrollTo.bind(this, scroll), step);

		// function scrollTo(end){
		// 	let scroll = document.getElementById(containerId).scrollTop;
		// 	if (scroll >= end) {
		// 		clearInterval(interval);
		// 	} else {
		// 		document.getElementById(containerId).scrollTop = scroll + 1;
		// 	}
		// }
	}

}



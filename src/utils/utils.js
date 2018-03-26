import React from 'react';

import config from '../config';
import _ from 'lodash';

import period from './period';

export default {

	period: period,

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
	}

}



define(['../../../../error/ArgumentError',
	'../../../../util/Logger',
	'../../../../error/NotFoundError',
	'../../../View',

	'jquery',
	'string',

	'text!./MultiSelectBox.html',
	'css!./MultiSelectBox'
], function (ArgumentError,
			 Logger,
			 NotFoundError,
			 View,

			 $,
			 S,

			 htmlContent) {
	"use strict";

	/**
	 * This class represents the row with the multi select box
	 * @param options {Object}
	 * @param options.id {string} ID of the select box
	 * @param options.name {string} Select box label
	 * @param options.target {Object} JQuery selector representing the target element where should be the select box rendered
	 * @param options.data {Array} Select options
	 * @constructor
	 */
	var MultiSelectBox = function(options) {
		View.apply(this, arguments);

		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MultiSelectBox", "constructor", "missingSelectBoxId"));
		}
		if (!options.name){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MultiSelectBox", "constructor", "missingSelectBoxName"));
		}
		if (!options.target){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MultiSelectBox", "constructor", "missingTarget"));
		}
		if (options.target.length == 0){
			throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "MultiSelectBox", "constructor", "missingHTMLElement"));
		}

		this._id = options.id;
		this._name = options.name;
		this._target = options.target;
		this._data = options.data;

		this.build();
	};

	MultiSelectBox.prototype = Object.create(View.prototype);

	/**
	 * Build the checkbox row and add a listener to it
	 */
	MultiSelectBox.prototype.build = function (){

		var html = S(htmlContent).template({
			id: this._id,
			name: this._name
		}).toString();

		this._target.append(html);
		var content = this.getOptions();

		$('#' + this._id).append(content).find("input" ).checkboxradio({
			icon: false
		});
	};

	/**
	 * Return options for select menu. If there is more than one option, add All option.
	 * @returns {string} String representing HTML code
	 */
	MultiSelectBox.prototype.getOptions = function(){
		var content = "";
		var self = this;
		this._firstOptionId = this._id + '-option-0';

		this._data.forEach(function(item, index){
			var id = self._id + '-option-' + index;
			content += '<label for="' + id +'">' + item + '</label>' +
			'<input type="checkbox" name="' + id + '" id="' + id + '">';
		});
		return content;
	};

	return MultiSelectBox;
});
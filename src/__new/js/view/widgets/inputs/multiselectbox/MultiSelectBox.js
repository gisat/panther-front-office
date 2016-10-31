define(['../../../../error/ArgumentError',
	'../../../../util/Logger',
	'../../../../error/NotFoundError',
	'../../../View',

	'jquery',
	'string',

	'text!./MultiSelectBox.html',
	'text!./MultiSelectBoxOptions.html',
	'css!./MultiSelectBox'
], function (ArgumentError,
			 Logger,
			 NotFoundError,
			 View,

			 $,
			 S,

			 htmlContent,
			 htmlOptions) {
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
	 * Return options for multiselect
	 * @returns {string} String representing HTML code
	 */
	MultiSelectBox.prototype.getOptions = function(){
		var content = "";
		var self = this;

		// options
		this._data.forEach(function(item, index){
			var id = self._id + '-option-' + index;
			if (item){
				content += self.addOption(id, "multiselect-option", item);
			}
		});

		if (this._data.length > 1){
			content += self.addOption(self._id + '-option-select-all', "multiselect-select-all", "Select all");
			content += self.addOption(self._id + '-option-clear-all', "multiselect-clear-all", "Clear all");
			this.addSelectAllListener();
			this.addClearAllListener();
		}
		return content;
	};

	MultiSelectBox.prototype.addSelectAllListener = function(){
		var self = this;
		$("#" + this._id).off("click.multiselect-all").on("click.multiselect-all", "#" + this._id + '-option-select-all', function(){
			$("#" + self._id + " > .label-multiselect-option").each(function(){
				var option = $(this);
				if (!option.hasClass("ui-state-active")){
					option.addClass("ui-state-active").addClass("ui-checkboxradio-checked");
					var inputId = option.attr("for");
					$("#" + inputId).attr("checked", true);
				}
			});
		});
	};

	MultiSelectBox.prototype.addClearAllListener = function(){
		var self = this;
		$("#" + this._id).off("click.multiselect-clear").on("click.multiselect-clear", "#" + this._id + '-option-clear-all', function(){
			$("#" + self._id + " > .label-multiselect-option").each(function(){
				var option = $(this);
				if (option.hasClass("ui-state-active")){
					option.removeClass("ui-state-active").removeClass("ui-checkboxradio-checked");
					var inputId = option.attr("for");
					$("#" + inputId).attr("checked", false);
				}
			});
		});
	};

	/**
	 * Add option button
	 * @param id {string} id of the button
	 * @param klass {string} class of the button
	 * @param content {string} content
	 * @returns {string}
	 */
	MultiSelectBox.prototype.addOption = function(id, klass, content){
		return S(htmlOptions).template({
			id: id,
			item: content,
			class: klass
		}).toString();
	};

	return MultiSelectBox;
});
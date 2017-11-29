define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'jquery',
	'string',
	'underscore',
	'select2',
	'css!./BaseSelect'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$,
			S,
			_
){
	/**
	 * Base class for Select2 selects, which contains common methods
	 * @constructor
	 * @param options {Object}
	 * @param options.id {string} id of the select
	 * @param options.containerSelector {Object} JQuery selector of container, where will be the select rendered
	 * @param options.options {Array} list of options
	 * @param [options.title] {string} Optional parameter.
	 * @param [options.selectedOptions] {Array} ids of an options selected by default
	 * @param [options.disabledOptions] {Array} ids of an options selected by default
	 * @param [options.sorting] {Object} Optional parameter.
	 * @param [options.classes] {string} Optional parameter.
	 */
	var BaseSelect = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "BaseSelect", "constructor", "missingId"));
		}
		if (!options.containerSelector){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "BaseSelect", "constructor", "missingTarget"));
		}
		if (!options.options){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "BaseSelect", "constructor", "missingOptions"));
		}

		this._id = options.id;
		this._containerSelector = options.containerSelector;
		this._options = options.options;
		this._disabledOptions = options.disabledOptions;
		this._selectedOptions = options.selectedOptions;
		this._title = options.title || "Select";
		this._sorting = options.sorting;
		this._classes = options.classes;
	};

	/**
	 * Render the select element
	 * @param content {string} html template
	 */
	BaseSelect.prototype.renderElement = function(content){
		if (this._selectSelector){
			this._selectSelector.remove();
		}
		var classes = "";
		if (this._classes){
			classes = " " + this._classes;
		}

		var html = S(content).template({
			id: this._id,
			title: this._title,
			classes: classes
		}).toString();
		this._containerSelector.append(html);
		this._selectSelector = $("#" + this._id);
	};

	/**
	 * It prepares data for select2 usage
	 * @returns {Object}
	 */
	BaseSelect.prototype.prepareData = function(){
		var preparedOptions = this.prepareOptions(this._options);
		return this.sortOptions(preparedOptions);
	};

	/**
	 * Prepare options for select2 usage
	 * @param options {Array} List of options
	 * @returns {Array} Customiyed options
	 */
	BaseSelect.prototype.prepareOptions = function(options){
		var self = this;
		var preparedOptions = [];
		options.forEach(function(option){
			var optionAsObject = self.makeObjectFromOption(option);

			var selected = _.find(self._selectedOptions, function(option){ return option === optionAsObject["id"]; });
			if (selected > 0){
				optionAsObject["selected"] = true;
			}

			var disabled = _.find(self._disabledOptions, function(option){ return option === optionAsObject["id"]; });
			if (disabled > 0){
				optionAsObject["disabled"] = true;
			}

			preparedOptions.push(optionAsObject);
		});
		return preparedOptions;
	};

	/**
	 * Make an object from option
	 * @param option {Object|string|number}
	 * @returns {Object} customized option
	 */
	BaseSelect.prototype.makeObjectFromOption = function(option){
		var id = "";
		var text = "";

		if (typeof option === "number" || typeof option === "string"){
			id = option; //todo formalize
			text = option;
		} else {
			id = option.id;
			text = option.id;
			if (option.name){
				text = option.name;
			}
		}

		return{
			"id": id,
			"text": text
		};

	};

	/**
	 * Return options sorted by text in ascending order
	 * @param options {Array}
	 * @returns {Array} sorted options
	 */
	BaseSelect.prototype.sortOptions = function(options){
		// todo sort by type, sorting order
		return _.sortBy(options, function(o) { return o["text"]; })
	};

	/**
	 * Get selected items
	 * @returns {Array} List of selected objects
	 */
	BaseSelect.prototype.getSelected = function(){
		return this._selectSelector.select2('data');
	};

	return BaseSelect;
});
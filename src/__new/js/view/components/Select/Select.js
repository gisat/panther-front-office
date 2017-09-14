define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'jquery',
	'string',
	'underscore',
	'text!./Select.html',
	'select2',
	'css!./Select'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			$,
			S,
			_,
			SelectHtml
){
	/**
	 * Class for creating of basic html select element using Select2 library
	 * @param options {Object}
	 * @param options.id {string} id of the select
	 * @param options.containerSelector {Object} JQuery selector of container, where will be the select rendered
	 * @param options.options {Array} list of options
	 * @param [options.title] {string} Optional parameter.
	 * @param [options.selectedOption] {number|string} id of an option selected by default
	 * @param [options.sorting] {Object} Optional parameter.
	 * @constructor
	 */
	var Select = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Select", "constructor", "missingId"));
		}
		if (!options.containerSelector){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Select", "constructor", "missingTarget"));
		}
		if (!options.options){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Select", "constructor", "missingOptions"));
		}

		this._id = options.id;
		this._containerSelector = options.containerSelector;
		this._options = options.options;
		this._selectedOption = options.selectedOption;
		this._title = options.title || "Select";
		this._sorting = options.sorting;

		this.render();
	};

	/**
	 * Render select
	 */
	Select.prototype.render = function(){
		var self = this;
		var html = S(SelectHtml).template({
			id: this._id,
			title: this._title
		}).toString();
		this._containerSelector.append(html);
		this._selectSelector = $("#" + this._id);

		$(document).ready(function() {
			self._selectSelector.select2({
				data: self.prepareData(),
				containerCssClass: "select-basic-container"
			});
		});
	};

	/**
	 * It prepares data for select2 usage
	 * @returns {Object}
	 */
	Select.prototype.prepareData = function(){
		var preparedOptions = this.prepareOptions(this._options);
		var sortedOptions = this.sortOptions(preparedOptions);
		return sortedOptions;
	};

	/**
	 * Prepare options for select2 usage
	 * @param options {Array} List of options
	 * @returns {Array} Customiyed options
	 */
	Select.prototype.prepareOptions = function(options){
		var self = this;
		var preparedOptions = [];
		this._options.forEach(function(option){
			var optionAsObject = self.makeObjectFromOption(option);
			if (self._selectedOption === optionAsObject["id"]){
				optionAsObject["selected"] = true;
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
	Select.prototype.makeObjectFromOption = function(option){
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
	Select.prototype.sortOptions = function(options){
		// todo sort by type, sorting order
		return _.sortBy(options, function(o) { return o["text"]; })
	};

	return Select;
});
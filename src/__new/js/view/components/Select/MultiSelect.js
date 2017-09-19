define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./BaseSelect',

	'jquery',
	'string',
	'underscore',
	'text!./MultiSelect.html',
	'select2',
	'css!./MultiSelect'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			BaseSelect,

			$,
			S,
			_,
			MultiSelectHtml
){
	/**
	 * Class for creating of multi options html select element using Select2 library
	 * @constructor
	 * @param options.onChange {function}
	 * @param [options.hidePillbox] {boolean} Optional parameter. If true, show only an arrow.
	 */
	var MultiSelect = function(options){
		BaseSelect.apply(this, arguments);

		this.onChange = options.onChange;
		this._hidePillbox = options.hidePillbox;

		this.render();
		this.addListeners();
	};

	MultiSelect.prototype = Object.create(BaseSelect.prototype);

	/**
	 * Render select
	 */
	MultiSelect.prototype.render = function(){
		var self = this;
		this.renderElement(MultiSelectHtml);

		var containerClass = "select-multi-container";
		if (this._hidePillbox){
			containerClass += " onlyArrow";
		}
		if (this._classes){
			containerClass += " " + this._classes;
		}

		$(document).ready(function() {
			self._selectSelector.select2({
				data: self.prepareData(),
				containerCssClass: containerClass,
				dropdownCssClass: "select-multi-dropdown",
				multiple: "multiple"
			});
		});
	};

	/**
	 * Get all options
	 * @returns {Array} List of all items
	 */
	MultiSelect.prototype.getAllOptions = function(){
		var selectedItems = [];
		this._selectSelector.find("option").each(function(item) {
			if (this.value){
				selectedItems.push(this.value);
			}
		});
		return selectedItems;
	};

	/**
	 * Get all selected options' values
	 * @returns {Array}
	 */
	MultiSelect.prototype.getSelectedOptions = function(){
		return this._selectSelector.select2("val");
	};

	/**
	 * Add listeners to events
	 */
	MultiSelect.prototype.addListeners = function(){
		this._selectSelector.on("change", this.onChange.bind(this));
	};

	return MultiSelect;
});
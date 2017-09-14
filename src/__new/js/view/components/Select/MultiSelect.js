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
	 * @param [options.hidePillbox] {boolean} Optional parameter. If true, show only an arrow.
	 */
	var MultiSelect = function(options){
		BaseSelect.apply(this, arguments);

		this._hidePillbox = options.hidePillbox;
		this.render();
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

		$(document).ready(function() {
			self._selectSelector.select2({
				data: self.prepareData(),
				containerCssClass: containerClass,
				dropdownCssClass: "select-multi-dropdown",
				multiple: "multiple"
			});
		});
	};

	return MultiSelect;
});
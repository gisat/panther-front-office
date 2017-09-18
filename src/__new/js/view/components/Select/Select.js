define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./BaseSelect',

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

			BaseSelect,

			$,
			S,
			_,
			SelectHtml
){
	/**
	 * Class for creating of basic html select element using Select2 library
	 * @constructor
	 * @params onChange {function}
	 */
	var Select = function(options){
		BaseSelect.apply(this, arguments);
		this.onChange = options.onChange;

		this.render();
		this.addListeners();
	};

	Select.prototype = Object.create(BaseSelect.prototype);

	/**
	 * Render select
	 */
	Select.prototype.render = function(){
		var self = this;
		this.renderElement(SelectHtml);

		var containerClass = "select-basic-container";
		if (this._classes){
			containerClass += " " + this._classes;
		}

		$(document).ready(function() {
			self._selectSelector.select2({
				data: self.prepareData(),
				containerCssClass: containerClass
			});
		});
	};

	/**
	 * Add listeners to events
	 */
	Select.prototype.addListeners = function(){
		this._selectSelector.on("change", this.onChange.bind(this));
	};

	return Select;
});
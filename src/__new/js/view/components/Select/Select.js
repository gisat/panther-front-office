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
	 * @params options.onChange {function}
	 * @params options.placeholder {string}
	 */
	var Select = function(options){
		BaseSelect.apply(this, arguments);
		this.onChange = options.onChange;

		this._placeholder = options.placeholder;

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

		$(document).ready(function() {
			self._selectSelector.select2(self.prepareSelectSettings());
		});
	};

	/**
	 * Prepare settings for select
	 * @returns {Object} select settings
	 */
	Select.prototype.prepareSelectSettings = function(){
		var containerClass = "select-basic-container";
		if (this._classes){
			containerClass += " " + this._classes;
		}

		var settings = {
			data: this.prepareData(),
			containerCssClass: containerClass
		};

		if (this._placeholder){
			$("#" + this._id).append('<option></option>');
			settings.placeholder = this._placeholder;
		}

	 	return settings;
	};

	/**
	 * Add listeners to events
	 */
	Select.prototype.addListeners = function(){
		this._selectSelector.on("change", this.onChange.bind(this));
	};

	return Select;
});
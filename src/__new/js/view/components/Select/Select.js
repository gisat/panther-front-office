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
	 */
	var Select = function(options){
		BaseSelect.apply(this, arguments);
		this.render();
	};

	Select.prototype = Object.create(BaseSelect.prototype);

	/**
	 * Render select
	 */
	Select.prototype.render = function(){
		var self = this;
		this.renderElement(SelectHtml);

		$(document).ready(function() {
			self._selectSelector.select2({
				data: self.prepareData(),
				containerCssClass: "select-basic-container"
			});
		});
	};

	return Select;
});
define(['../../../../error/ArgumentError',
	'../../../../util/Logger',

	'./Checkbox',

	'jquery',
	'string',

	'text!./Radiobox.html',
	'css!./Radiobox'
], function (ArgumentError,
			 Logger,

			 Checkbox,

			 $,
			 S,

			 htmlContent) {
	"use strict";

	/**
	 * This class represents the row with the radiobox
	 * @constructor
	 */
	var Radiobox = function(options) {
		Checkbox.apply(this, arguments);
	};

	Radiobox.prototype = Object.create(Checkbox.prototype);

	/**
	 * Build the checkbox row and add a listener to it
	 */
	Radiobox.prototype.build = function (){

		var html = S(htmlContent).template({
			id: this._id,
			class: this._class,
			dataId: this._dataId,
			name: this._name
		}).toString();

		this._target.append(html);

		if (this._checked){
			$("#" + this._id).addClass("checked");
		}
		this.addListeners(this._id);
	};

	/**
	 * It returns radiobox row element
	 * @returns {*|jQuery}
	 */
	Radiobox.prototype.getRadiobox = function(){
		return $("#" + this._id);
	};

	/**
	 * Add listener to radiobox row and remove the old one
	 * @param id {string} ID of the checkbox
	 */
	Radiobox.prototype.addListeners = function(id){
		var self = this;
		var selector = $("#" + this._containerId);
		selector.off('click.' + id);
		selector.on('click.' + id, '#' + id, function(e){
			if (!self.specialKeyPressed(e)){
				self._target.find(".radiobox-row").removeClass('checked');
				$('#' + id).addClass('checked');
			}
		})
	};

	return Radiobox;
});
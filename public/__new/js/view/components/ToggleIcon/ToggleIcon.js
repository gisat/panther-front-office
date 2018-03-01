define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'jquery',
	'string',
	'text!./ToggleIcon.html',
	'css!./ToggleIcon'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			$,
			S,
			ToggleIconHtml){

	/**
	 * Build toggle Icon
	 * @param options {Object}
	 * @param options.id {string} id of icon
	 * @param options.target {Object} JQuery selector of target element
	 * @param [options.isSmall] {boolean} Optional parameter. True if toggle should be small
	 * @constructor
	 */
	var ToggleIcon = function(options){
		this._target = options.target;
		this._id = options.id;
		this._isSmall = options.isSmall;
		this.build();
	};

	/**
	 * Build icon
	 */
	ToggleIcon.prototype.build = function(){
		var extraClasses = "";

		if(this._isSmall){
			extraClasses += "toggle-icon-small"
		}

		var content = S(ToggleIconHtml).template({
			id: this._id,
			classes: extraClasses
		}).toString();
		this._target.append(content);
		this._icon = $("#" + this._id);
	};

	/**
	 * Switch toggle to active state
	 */
	ToggleIcon.prototype.activate = function(){
		this._icon.addClass("active");
	};

	/**
	 * Switch toggle to inactive state
	 */
	ToggleIcon.prototype.deactivate = function(){
		this._icon.removeClass("active");
	};

	return ToggleIcon;
});
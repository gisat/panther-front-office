define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'jquery',
	'string',
	'underscore',
	'text!./Button.html',
	'css!./Button'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$,
			S,
			_,
			ButtonHtml
){
	/**
	 * Base class for button creating
	 * @constructor
	 * @param options {Object}
	 * @param options.id {string} id of the button
	 * @param options.containerSelector {Object} JQuery selector of container, where will be the select rendered
	 * @param options.text {string} Text for button
	 * @param options.onClick {function}
	 * @param [options.classes] {string} Optional parameter. Additional classes.
	 * @param [options.title] {string} Optional parameter.
	 * @param [options.textCentered] {boolean} Optional parameter.
	 * @param [options.textSmall] {boolean} Optional parameter.
	 */
	var Button = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Button", "constructor", "missingId"));
		}
		if (!options.text){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Button", "constructor", "missingText"));
		}
		if (!options.containerSelector){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Button", "constructor", "missingTarget"));
		}

		this._id = options.id;
		this._text = options.text;
		this._containerSelector = options.containerSelector;
		this._classes = options.classes;
		this.onClick = options.onClick;

		this._title = options.title || polyglot.t("select");
		this._textCentered = options.textCentered;
		this._textSmall = options.textSmall;

		this.render();
		this.addOnClickListener();
	};

	/**
	 * Render button
	 */
	Button.prototype.render = function(){
		if (this._buttonSelector){
			this._buttonSelector.remove();
		}

		var classes = this.getClasses();
		var html = S(ButtonHtml).template({
			id: this._id,
			title: this._title,
			text: this._text,
			classes: classes
		}).toString();
		this._containerSelector.append(html);
		this._buttonSelector = $("#" + this._id);
	};

	/**
	 * Get classes based on button's configuration
	 * @returns {string} html classes
	 */
	Button.prototype.getClasses = function(){
		var classes = "";
		if (this._classes){
			classes += " " + this._classes;
		}
		if (this._textCentered){
			classes += " text-centered"
		}
		if (this._textSmall){
			classes += " text-small"
		}
		return classes;
	};

	Button.prototype.addOnClickListener = function(){
		this._buttonSelector.on("click", this.onClick.bind(this));
	};

	return Button;
});
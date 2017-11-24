define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'jquery',
	'string',
	'underscore',
	'text!./Collapse.html',
	'css!./Collapse'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$,
			S,
			_,
			CollapseHtml
){

	/**
	 * Colapsible panel with title and content
	 * @param options {Object}
	 * @param options.title {String} Title of the collapse
	 * @param options.content {String} HTML content that could be collapsed
	 * @param options.containerSelector {Object} JQuery selector of target element
	 * @param [options.customClasses] {string} optional classes
	 * @param [options.open] {boolean} false for collapsed content
	 * @constructor
	 */
	var Collapse = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Collapse", "constructor", "missingId"));
		}
		if (!options.title){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Collapse", "constructor", "missingName"));
		}
		if (!options.content){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Collapse", "constructor", "missingContent"));
		}
		if (!options.containerSelector){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Collapse", "constructor", "missingTarget"));
		}

		this._id = options.id;
		this._title = options.title;
		this._content = options.content;
		this._containerSelector = options.containerSelector;
		this._classes = options.customClasses;
		this._open = options.open;

		this.render();
		this.addHeaderOnClickListener();
	};

	/**
	 * Render collapse
	 */
	Collapse.prototype.render = function(){
		var classes = "";
		if (this._open){
			classes += " open";
		}
		if (this._classes){
			classes += " " + this._classes;
		}

		var html = S(CollapseHtml).template({
			id: this._id,
			title: this._title,
			content: this._content,
			classes: classes
		}).toString();
		this._containerSelector.append(html);

		this._collapseSelector = $("#" + this._id);
		this._headerSelector = this._collapseSelector.find(".component-collapse-header");
		this._bodySelector = this._collapseSelector.find(".component-collapse-body");

		if (this._open){
			this._bodySelector.show();
		} else {
			this._bodySelector.hide();
		}
	};

	Collapse.prototype.addHeaderOnClickListener = function(){
		this._headerSelector.off("click.collapse").on("click.collapse", function(){
			var collapse = $(this).parents(".component-collapse");
			var body = $(this).siblings(".component-collapse-body");
			if (collapse.hasClass("open")){
				collapse.removeClass("open");
				body.slideUp(200);
			} else {
				collapse.addClass("open");
				body.slideDown(200);
			}
		});
	};

	return Collapse;
});
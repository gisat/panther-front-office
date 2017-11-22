define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'jquery',
	'string',
	'text!./MapToolTrigger.html',
	'css!./MapToolTrigger'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			$,
			S,
			MapToolTriggerContent){

	/**
	 * Class representing trigger for map tool activation
	 * @param options {Object}
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @param options.target {Object} JQuery selector of container where trigger will be rendered
	 * @param options.id {string} id of the tool trigger
	 * @param options.label {string} label of the tool trigger
	 * @param options.hasSvgIcon {boolean} true, if trigger has svg icon //TODO implement case when there is no SVG icon
	 * @param options.iconPath {string} path to icon
	 * @param options.onActivate {function} execute when trigger has been activated
	 * @param options.onDeactivate {function} execute when trigger has been deactivated
	 * @constructor
	 */
	var MapToolTrigger = function(options){
		this._dispatcher = options.dispatcher;
		this._target = options.target;
		this._id = options.id;
		this._label = options.label;
		this._hasSvgIcon = options.hasSvgIcon;

		this._onActivate = options.onActivate;
		this._onDeactivate = options.onDeactivate;

		if (this._hasSvgIcon){
			this._iconPath = options.iconPath;
		}

		this.build();
		this._dispatcher.addListener(this.onEvent.bind(this));
	};

	/**
	 * Build tool trigger with icon. //TODO implement for other types of icons
	 */
	MapToolTrigger.prototype.build = function(){
		if (this._hasSvgIcon){
			this.buildWithSvgIcon();
		}
	};

	/**
	 * Deactivate trigger and functionality on rebuild
	 */
	MapToolTrigger.prototype.rebuild = function(){
		if (this._mapToolTrigger && this._mapToolTrigger.hasClass("active")){
			this._mapToolTrigger.trigger("click")
		}
	};

	/**
	 * Build trigger with SVG icon
	 * TODO move toggle switch to separate class
	 */
	MapToolTrigger.prototype.buildWithSvgIcon = function(){
		var content = S(MapToolTriggerContent).template({
			id: this._id,
			label: this._label
		}).toString();
		this._target.append(content);
		this._mapToolTrigger = $("#" + this._id);
		this._mapToolTriggerToggle = this._mapToolTrigger.find(".toggle-switch");
		var icon = this._mapToolTrigger.find(".map-tool-icon");
		icon.load(this._iconPath);

		this.addTriggerListener();
	};


	/**
	 * Add on click listener to map tool trigger
	 */
	MapToolTrigger.prototype.addTriggerListener = function(){
		var self = this;
		this._mapToolTrigger.off("click.mapTool").on("click.mapTool", function(e){
			if (e.target.localName === 'span') return;
			var trigger = $(this);
			var isActive = trigger.hasClass("active");
			if (isActive){
				self._onDeactivate();
				trigger.removeClass("active");
				self._mapToolTriggerToggle.find("input[type=checkbox]")[0].checked = false;
			} else {
				self._onActivate();
				trigger.addClass("active");
				self._mapToolTriggerToggle.find("input[type=checkbox]")[0].checked = true;
			}
		});
	};

	/**
	 * @param type {string} type of event
	 */
	MapToolTrigger.prototype.onEvent = function (type) {
		// Deactivate tool on map framework change
		if (type === Actions.mapSwitchFramework){
			if (this._mapToolTrigger.hasClass("active")){
				this._mapToolTrigger.trigger("click")
			}
		}
	};

	return MapToolTrigger;
});
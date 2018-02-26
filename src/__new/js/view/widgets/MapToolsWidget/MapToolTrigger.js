define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../components/ToggleIcon/ToggleIcon',

	'jquery',
	'string',
	'text!./MapToolTrigger.html',
	'css!./MapToolTrigger'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			ToggleIcon,

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
	 * @param options.hasSvgIcon {boolean} true, if trigger has svg icon
	 * @param options.hasFaIcon {boolean} true, if trigger has Font Awesome icon
	 * @param options.iconPath {string} path to icon
	 * @param options.iconClass {string} Class of FA icon, if exists
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
		this._hasFaIcon = options.hasFaIcon;

		this._onActivate = options.onActivate;
		this._onDeactivate = options.onDeactivate;

		if (this._hasSvgIcon){
			this._iconPath = options.iconPath;
		}
		if (this._hasFaIcon){
			this._iconClass = options.iconClass;
		}

		this.build();
		this._dispatcher.addListener(this.onEvent.bind(this));
	};

	/**
	 * Build tool trigger with icon.
	 */
	MapToolTrigger.prototype.build = function(){
		if (this._hasSvgIcon){
			this.buildTrigger('svg');
		} else if (this._hasFaIcon){
			this.buildTrigger('fa');
		} else {
			this.buildTrigger();
		}
	};

	/**
	 * Deactivate trigger and functionality on rebuild
	 */
	MapToolTrigger.prototype.rebuild = function(){
		if (this._mapToolTrigger && this._mapToolTrigger.hasClass("active")){
			this._mapToolTrigger.trigger("click")
		}
		// TODO hide if scope doesn't allow this functionality
	};

	/**
	 * Build trigger with SVG icon
	 * TODO move toggle switch to separate class
	 */
	MapToolTrigger.prototype.buildTrigger = function(iconType){
		var content = S(MapToolTriggerContent).template({
			id: this._id,
			label: this._label
		}).toString();
		this._target.append(content);
		this._mapToolTrigger = $("#" + this._id);
		this._mapToolTriggerIcons = this._mapToolTrigger.find(".map-tool-trigger-icons");
		this._mapToolTriggerToggle = this.buildToggle();

		var icon = this._mapToolTrigger.find(".map-tool-icon");
		if (iconType === 'svg'){
			icon.load(this._iconPath);
		}
		if (iconType === 'fa'){
			icon.append('<i class="fa ' + this._iconClass + '"></i>')
		}

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
				self._mapToolTriggerToggle.deactivate();
			} else {
				self._onActivate();
				trigger.addClass("active");
				self._mapToolTriggerToggle.activate();
			}
		});
	};

	/**
	 * Build toggle icon
	 */
	MapToolTrigger.prototype.buildToggle = function(){
		return new ToggleIcon({
			id: this._id + "-toggle-icon",
			target: this._mapToolTriggerIcons
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
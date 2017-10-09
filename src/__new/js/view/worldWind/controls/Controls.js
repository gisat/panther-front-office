define([
		'../../../error/ArgumentError',
		'../../../util/Logger',

		'jquery',
		'string',
		'text!./Controls.html',
		'css!./Controls'
	],
	function (ArgumentError,
			  Logger,

			  $,
			  S,
			  ControlsHtml
	) {
		"use strict";

		/**
		 * Constructs a view controls layer.
		 * @alias Controls
		 * @constructor
		 * @param {Object} options
		 * @param {WorldWindow} options.worldWindow The World Window associated with these controls.
		 * @param {JQuery} options.mapContainer selector of target container, where should be the controls rendered
		 * @throws {ArgumentError} If the specified world window is null or undefined.
		 */
		var Controls = function (options) {
			if (!options.worldWindow) {
				throw new ArgumentError(
					Logger.logMessage(Logger.LEVEL_SEVERE, "Controls", "constructor", "missingWorldWindow"));
			}
			if (!options.mapContainer) {
				throw new ArgumentError(
					Logger.logMessage(Logger.LEVEL_SEVERE, "Controls", "constructor", "missingTarget"));
			}

			/**
			 * Target element
			 * @type {JQuery}
			 */
			this._mapContainer = options.mapContainer;

			/**
			 * The World Window associated with controls.
			 * @type {WorldWindow}
			 * @readonly
			 */
			this.wwd = options.worldWindow;

			/**
			 * The incremental vertical exaggeration to apply each cycle.
			 * @type {Number}
			 * @default 0.01
			 */
			this.exaggerationIncrement = 0.01;

			/**
			 * The incremental amount to increase or decrease the eye distance (for zoom) each cycle.
			 * @type {Number}
			 * @default 0.04 (4%)
			 */
			this.zoomIncrement = 0.04;

			/**
			 * The incremental amount to increase or decrease the heading each cycle, in degrees.
			 * @type {Number}
			 * @default 1.0
			 */
			this.headingIncrement = 1.0;

			/**
			 * The incremental amount to increase or decrease the tilt each cycle, in degrees.
			 * @type {Number}
			 */
			this.tiltIncrement = 1.0;

			/**
			 * The incremental amount to narrow or widen the field of view each cycle, in degrees.
			 * @type {Number}
			 * @default 0.1
			 */
			this.fieldOfViewIncrement = 0.1;

			/**
			 * The scale factor governing the pan speed. Increased values cause faster panning.
			 * @type {Number}
			 * @default 0.001
			 */
			this.panIncrement = 0.001;

			this.wwds = [this.wwd];

			// Render icons
			this.buildIcons();

			// Establish event handlers.
			this.setupInteraction();
		};

		/**
		 * Add another World window which will be controlled by this control
		 * @param wwd {WorldWindow}
		 */
		Controls.prototype.addWorldWindow = function(wwd){
			this.wwds.push(wwd);
		};

		/**
		 * Render icons
		 */
		Controls.prototype.buildIcons = function(){
			var html = S(ControlsHtml).template().toString();
			this._mapContainer.append(html);
		};

		// Intentionally not documented.
		Controls.prototype.setupInteraction = function () {
			//// Add the mouse listeners.
			$("#zoom-plus-control").on({
				"mousedown": this.handleMouseEvent.bind(this,this.handleZoomIn),
				"mouseup": this.handleMouseEvent.bind(this,this.handleZoomIn)});
			$("#zoom-minus-control").on({
				"mousedown": this.handleMouseEvent.bind(this,this.handleZoomOut),
				"mouseup": this.handleMouseEvent.bind(this,this.handleZoomOut)});
			$("#tilt-less-control").on({
				"mousedown": this.handleMouseEvent.bind(this,this.handleTiltUp),
				"mouseup": this.handleMouseEvent.bind(this,this.handleTiltUp)});
			$("#tilt-more-control").on({
				"mousedown": this.handleMouseEvent.bind(this,this.handleTiltDown),
				"mouseup": this.handleMouseEvent.bind(this,this.handleTiltDown)});
			$("#rotate-right-control").on({
				"mousedown": this.handleMouseEvent.bind(this,this.handleHeadingRight),
				"mouseup": this.handleMouseEvent.bind(this,this.handleHeadingRight)});
			$("#rotate-left-control").on({
				"mousedown": this.handleMouseEvent.bind(this,this.handleHeadingLeft),
				"mouseup": this.handleMouseEvent.bind(this,this.handleHeadingLeft)});
			$("#rotate-needle-control").on({
				"mouseup": this.handleHeadingReset.bind(this)});
			this.wwd.addEventListener("mousemove", this.handleManualRedraw.bind(this));
		};

		Controls.prototype.handleMouseEvent = function (operation, e) {
			if (
				e.type &&
				(
					(e.type === "mouseup" && e.which === 1) ||
					e.type === "touchend" ||
					e.type === "touchcancel"
				)
			)
			{
				this.handleOperationEnd(e);
			} else {
				this.handleOperationStart(operation, e);
			}
		};

		Controls.prototype.handleOperationStart = function(operation, e) {
			if ((e.type === "mousedown" && e.which === 1) || (e.type === "touchstart")) {

				this.activeOperation = operation;
				e.preventDefault();

				var self = this;
				var runOperation = function () {
					if (self.activeOperation) {
						operation.call(self);
						setTimeout(runOperation, 50);
					}
				};
				setTimeout(runOperation, 50);
			}
		};

		Controls.prototype.handleOperationEnd = function (e) {
			this.activeOperation = null;
			e.preventDefault();
		};

		Controls.prototype.handleZoomIn = function() {
			var self = this;
			this.wwds.forEach(function(wwd){
				wwd.navigator.range *= (1 - self.zoomIncrement);
				wwd.redraw();
			});
		};

		Controls.prototype.handleZoomOut = function() {
			var self = this;
			this.wwds.forEach(function(wwd){
				wwd.navigator.range *= (1 + self.zoomIncrement);
				wwd.redraw();
			});
		};

		Controls.prototype.handleHeadingRight = function() {
			var self = this;
			this.wwds.forEach(function(wwd){
				wwd.navigator.heading -= self.headingIncrement;
				wwd.redraw();
			});
			this.redrawHeadingIndicator();
		};

		Controls.prototype.handleHeadingLeft = function() {
			var self = this;
			this.wwds.forEach(function(wwd){
				wwd.navigator.heading += self.headingIncrement;
				wwd.redraw();
			});
			this.redrawHeadingIndicator();
		};

		Controls.prototype.handleHeadingReset = function() {
			var self = this;
			this.wwds.forEach(function(wwd){
				var headingIncrement = 1.0;
				if (Math.abs(wwd.navigator.heading) > 60) {
					headingIncrement = 2.0;
				} else if (Math.abs(navigator.heading) > 120) {
					headingIncrement = 3.0;
				}
				if (wwd.navigator.heading > 0) {
					headingIncrement = -headingIncrement;
				}

				var runOperation = function () {
					if (Math.abs(wwd.navigator.heading) > Math.abs(headingIncrement)) {
						wwd.navigator.heading += headingIncrement;
						wwd.redraw();
						self.redrawHeadingIndicator();
						setTimeout(runOperation, 10);
					} else {
						wwd.navigator.heading = 0;
						wwd.redraw();
						self.redrawHeadingIndicator();
					}
				};
				setTimeout(runOperation, 10);
			});
		};

		Controls.prototype.redrawHeadingIndicator = function () {
			this.wwds.forEach(function(wwd){
				var initialAngle = 45;
				var currentHeading = wwd.navigator.heading;
				var rotateAngle = 0 - currentHeading - initialAngle;
				$("#rotate-needle-control").find('i').css('transform', 'rotate(' + rotateAngle + 'deg)');
			});
		};

		Controls.prototype.handleTiltUp = function() {
			var self = this;
			this.wwds.forEach(function(wwd){
				wwd.navigator.tilt =
					Math.max(0, wwd.navigator.tilt - self.tiltIncrement);
				wwd.redraw();
			});
		};

		Controls.prototype.handleTiltDown = function() {
			var self = this;
			this.wwds.forEach(function(wwd){
				wwd.navigator.tilt =
					Math.min(90, wwd.navigator.tilt + self.tiltIncrement);
				wwd.redraw();
			});
		};

		Controls.prototype.handleManualRedraw = function(e) {
			var self = this;
			this.wwds.forEach(function(wwd){
				if (e.which) { //we only care if mouse button is down todo will this work for touch?

					// redraw heading indicator
					self._lastHeading = self._lastHeading || 0;
					if (wwd.navigator.heading !== self._lastHeading) {
						self.redrawHeadingIndicator();
					}
					self._lastHeading = wwd.navigator.heading;
				}
			});
		};

		return Controls;
	});

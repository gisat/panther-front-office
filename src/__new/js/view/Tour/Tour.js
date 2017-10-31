define([
	'./snowTour/snowLegs',

	'string',
	'text!./Tour.html',
	'text!./snowTour/snowLegs.html',
	'css!./Tour'
], function (
	snowLegs,

	S,
	TourHtml,
	SnowLegsHtml
) {
	"use strict";

	/**
	 * Class for creating a tour through the app
	 * @param options {Object}
	 * @param options.id {string} id of the tour list
	 * @param options.iFrame {Object}
	 * @constructor
	 */
	var Tour = function(options) {
		this._id = options.id;
		this._iFrame = options.iFrame;
		this.build();
	};

	Tour.prototype.build = function(){
		this.buildTourTrigger();
		this.buildTour();
	};

	/**
	 * Build the tour trigger
	 */
	Tour.prototype.buildTourTrigger = function(){
		this._tourTrigger = $("#top-toolbar-tour");
		this.addTourTriggerListener();
	};

	/**
	 * Build tour steps
	 */
	Tour.prototype.buildTour = function(){
		var content = this.buildContent();

		var html = S(TourHtml).template({
			content: content,
			id: this._id
		}).toString();
		$('body').append(html);
		this._tourOverlay = $('.tour-overlay');
		this.buildTourbus();
	};

	/**
	 * Build tourbus
	 */
	Tour.prototype.buildTourbus = function(){
		var self = this;
		this._tour = $.tourbus('#' + this._id,{
			onLegStart: self.onLegChange.bind(self),
			onStop: self.onStop.bind(self),
			leg: {
				zindex: 99999
			}
		});
	};

	/**
	 * Build content of tour for current project
	 */
	Tour.prototype.buildContent = function(){
		if (Config.toggles.isSnow){
			return S(SnowLegsHtml).template().toString();
		}
	};

	/**
	 * Do on tour stop
	 */
	Tour.prototype.onStop = function(){
		this._tourOverlay.removeClass("open");
		this._tourTrigger.removeClass("open");
		if (Config.toggles.isSnow){
			snowLegs.onTourStop(this._iFrame);
		}
	};

	/**
	 * Do on leg change
	 * @param leg {Object}
	 */
	Tour.prototype.onLegChange = function(leg){
		if (Config.toggles.isSnow){
			snowLegs.onLegChange(leg, this._iFrame, this._appOffset);
		}
	};

	Tour.prototype.addTourTriggerListener = function(){
		var self = this;
		this._tourTrigger.on("click", function () {
			self._tour.depart();
			self._tourOverlay.addClass('open');
			self._appOffset = $("#header").height() + $("#top-toolbar").height();
			if (Config.toggles.isSnow){
				snowLegs.onTourStart(self._iFrame);
			}
		})
	};

	return Tour;
});

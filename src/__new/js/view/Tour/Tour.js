define([
	'string',
	'text!./Tour.html',
	'css!./Tour'
], function (
	S,
	TourHtml
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
		var self = this;
		var html = S(TourHtml).template({
			id: this._id
		}).toString();
		$('body').append(html);
		this._tourList = $('#' + this._id);
		this._tourOverlay = $('.tour-overlay');

		this._tour =  this._tourList.tourbus({
			onLegStart: self.onLegChange.bind(self),
			onStop: self.onStop.bind(self),
			leg: {
				zindex: 99999
			}
		});
	};

	/**
	 * Do on tour stop
	 */
	Tour.prototype.onStop = function(){
		this._tourOverlay.removeClass("open");
		this._tourTrigger.removeClass("open");
		this._iFrame.rebuild(Config.snowAppUrl);
	};

	Tour.prototype.onLegChange = function(leg){
		if (leg.index === 2){
			this._iFrame.rebuild(Config.snowAppExampleUrl);
		}
	};

	Tour.prototype.addTourTriggerListener = function(){
		var self = this;
		this._tourTrigger.on("click", function () {
			self._tour.trigger('depart.tourbus');
			self._tourOverlay.addClass('open');
		})
	};

	return Tour;
});

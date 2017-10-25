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
		var html = S(TourHtml).template({
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
	 * Do on tour stop
	 */
	Tour.prototype.onStop = function(){
		this._tourOverlay.removeClass("open");
		this._tourTrigger.removeClass("open");
		this._iFrame.rebuild(Config.snowAppUrl);
	};

	/**
	 * Do on leg change
	 * @param leg {Object}
	 */
	Tour.prototype.onLegChange = function(leg){
		leg.$el.css({
			marginTop: this._appOffset + "px"
		});
		if (leg.index > 5){
			leg.reposition();
		}
		if (!leg.rawData.el || leg.rawData.el === "#top-toolbar-snow-configuration" || leg.rawData.el === ".ptr-overview-collection .ptr-button"){
			leg.$el.css({
				marginTop: "0px"
			});
		}
		if (leg.rawData.el === "#overview-header-scenes"){
			this._iFrame.rebuild(Config.snowAppExampleUrl);
			leg.$el.css({
				left: "500px"
			});
		}
		if (leg.rawData.el === "#overview-collections"){
			leg.$el.css({
				top: "400px",
				left: "500px",
				marginTop: "0px"
			});
		}
		if (leg.rawData.el === "#compare-composites-button"){
			var self = this;
			setTimeout(function(){
				self._iFrame.scrollY(300);
				leg.$el.css({
					bottom: "50px",
					top: "auto"
				});
			}, 100);
		}
		if (leg.rawData.el === "#composites .empty"){
			this._iFrame.rebuild(Config.snowAppExampleUrl + "/?s=composites");
			var button = $("#snow-iframe").contents().find("#overview-collections .ptr-button");
			button.trigger("click");
			leg.$el.css({
				left: "100px"
			});
		}
		if (leg.rawData.el === "#map-holder"){
			var showInMapButton = $("#snow-iframe").contents().find("#composites-list .ptr-button:first-child");
			showInMapButton.trigger("click");
			leg.$el.css({
				top: "300px"
			});
		}
	};

	Tour.prototype.addTourTriggerListener = function(){
		var self = this;
		this._tourTrigger.on("click", function () {
			self._tour.depart();
			self._tourOverlay.addClass('open');
			self._iFrame.rebuild(Config.snowAppUrl);
			self._appOffset = $("#header").height() + $("#top-toolbar").height();
		})
	};

	return Tour;
});

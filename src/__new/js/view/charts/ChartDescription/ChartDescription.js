define([
	'jquery',
	'underscore',
	'string',

	'text!./ChartDescription.html',
	'css!./ChartDescription'
], function($,
			_,
			S,

			chartDescriptionHtml){

	/**
	 * Class representing chart description window
	 * @param options {Object} Data about chart
	 * @param icon {Object} JQuery selector of description icon in chart panel header
	 * @constructor
	 */
	var ChartDescription = function(options, icon){
		this.id = options.id;
		this.name = options.name;
		this.description = options.description;
		this.type = options.type;
		this.active = options.active;
		this.icon = icon;

		this.render();
	};

	ChartDescription.prototype.render = function() {
		var html = S(chartDescriptionHtml).template({
			id: "chart-description-" + this.id,
			name: this.name,
			description: this.description
		}).toString();

		$("body").append(html);
		this._descriptionSelector = $("#chart-description-" + this.id);

		this.addCloseButtonListener();
		this.addDragging();
	};

	ChartDescription.prototype.rebuild = function(){
		if (this.active){
			this._descriptionSelector.addClass("open active");
		} else {
			this._descriptionSelector.removeClass("open").removeClass("active");
		}
	};

	/**
	 * Show description window
	 */
	ChartDescription.prototype.show = function() {
		this.active = true;
		this.rebuild();
	};

	/**
	 * Hide description window
	 */
	ChartDescription.prototype.hide = function(){
		this.active = false;
		this.rebuild();
	};

	/**
	 * Add listener to close button in window header
	 */
	ChartDescription.prototype.addCloseButtonListener = function(){
		var self = this;
		this._descriptionSelector.find(".window-close").off("click.close").on("click.close", function(){
			self.hide();
			self.icon.removeClass('tool-active');
		});
	};

	/**
	 * Enable dragging of window
	 */
	ChartDescription.prototype.addDragging = function(){
		this._descriptionSelector.draggable({
			containment: "body",
			handle: ".info-window-header",
			stop: function (ev, ui) {
				var element = $(this);
				element.css({
					width: "",
					height: ""
				});
			}
		});
	};

	return ChartDescription;
});
define([
	'jquery',
	'css!./PanelIFrame'
], function (
$
) {
	"use strict";

	var PanelIFrame = function(url) {
		this._target = $('#app-extra-content');
		this._url = url;

		this.build();
		this.addToggleListener();
	};


	PanelIFrame.prototype.build = function(){
		this._target.empty();

		this._target.append('<iframe id="snow-iframe" src="' + this._url + '"></iframe>');

		this._iframeSelector = $("#snow-iframe");
		$("#sidebar-reports").addClass("snow-mode");
	};

	/**
	 * Rebuild iframe with given url
	 * @param url {string}
	 */
	PanelIFrame.prototype.rebuild = function(url){
		this._iframeSelector.attr("src", url);
	};

	/**
	 * @returns {string} id of the iframe element
	 */
	PanelIFrame.prototype.getElementId = function(){
		return this._iframeSelector.attr("id");
	};

	PanelIFrame.prototype.addToggleListener = function(){
		$("#sidebar-reports-toggle").on("click", function(){
			setTimeout(function(){
				Observer.notify("resizeMap");
			},500);
		});
	};

	return PanelIFrame;
});

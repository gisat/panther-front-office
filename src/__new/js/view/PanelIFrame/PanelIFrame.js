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

	return PanelIFrame;
});

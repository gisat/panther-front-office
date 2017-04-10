define([
	'css!./PanelIFrame'
], function (

) {
	"use strict";

	var PanelIFrame = function(url) {
		this._target = $('#app-extra-content');
		this._url = url;

		this.build();

	};


	PanelIFrame.prototype.build = function(){

		this._target.empty();

		this._target.append('<iframe src="' + this._url + '"></iframe>');

	};

	return PanelIFrame;
});

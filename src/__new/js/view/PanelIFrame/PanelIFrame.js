define([], function () {
	"use strict";

	var PanelIFrame = function() {
		this._target = $('#app-extra-content');
		this.build();

	};


	PanelIFrame.prototype.build = function(url){

		this._target.empty();


		this._target.append('<iframe src="' + url + '"></iframe>');

	};

	return PanelIFrame;
});

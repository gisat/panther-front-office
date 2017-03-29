define([], function () {
	"use strict";

	var TopToolBar = function() {
		this.build();
	};


	TopToolBar.prototype.build = function(){

		var html = "<div>buttons...</div>";


		var widgetIDs;
		if (Config.toggles.hasNewEvaluationTool){
			widgetIDs = ['layers', 'areas', 'colourSelection', 'maptools'];
		} else {
			widgetIDs = ['layers', 'areas', 'colourSelection', 'legacyAdvancedFilters', 'maptools'];
		}
		for (var widgetID in widgetIDs){

		}




		$('#top-toolbar-widgets').append(html);
	};


	return TopToolBar;
});

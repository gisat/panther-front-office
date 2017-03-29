define([], function () {
	"use strict";

	var TopToolBar = function() {
		this._target = $('#top-toolbar-widgets');
		this._target.on('click.topToolBar', '.item', this.handleClick);
		this.build();
	};


	TopToolBar.prototype.build = function(){

		this._target.empty();

		var is3d = $('body').hasClass('mode-3d');

		if (is3d) {

			this._target.append('<div class="item" id="top-toolbar-layers" data-for="floater-world-wind-widget">Layers</div>');

		} else {

			this._target.append('<div class="item" id="top-toolbar-layers" data-for="window-layerpanel">Layers</div>');

			this._target.append('<div class="item" id="top-toolbar-areas" data-for="window-areatree">Areas</div>');

			this._target.append('<div class="item" id="top-toolbar-selections" data-for="window-colourSelection">Selections</div>');

			if(Config.toggles.hasNewEvaluationTool) {
				this._target.append('<div class="item" id="top-toolbar-selection-filter" data-for="floater-evaluation-tool-widget">Advanced filters</div>');
			} else {
				this._target.append('<div class="item" id="top-toolbar-selection-filter" data-for="window-legacyAdvancedFilters">Advanced filters</div>');
			}

			this._target.append('<div class="item" id="top-toolbar-map-tools" data-for="window-maptools">Map tools</div>');

		}

	};

	TopToolBar.prototype.handleClick = function(e){
		var targetId = e.target.getAttribute('data-for');
		$('#' + targetId).toggleClass('open');
	};


	return TopToolBar;
});

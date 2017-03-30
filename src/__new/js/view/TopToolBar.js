define([], function () {
	"use strict";

	var TopToolBar = function() {
		this._target = $('#top-toolbar-widgets');
		this._target.on('click.topToolBar', '.item', this.handleClick);
		this.build();

		$('#top-toolbar-context-help').on('click.topToolBar', this.handleContextHelpClick);
	};


	TopToolBar.prototype.build = function(){

		this._target.empty();

		var is3d = $('body').hasClass('mode-3d');

		if (is3d) {

			this._target.append('<div class="item" id="top-toolbar-layers" data-for="floater-world-wind-widget">Layers</div>');

			this._target.append('<div class="item disabled" id="top-toolbar-areas">Areas</div>');

			this._target.append('<div class="item disabled" id="top-toolbar-selections">Selections</div>');

			this._target.append('<div class="item disabled" id="top-toolbar-selection-filter">Areas filter</div>');

			this._target.append('<div class="item disabled" id="top-toolbar-map-tools">Map tools</div>');

			this._target.append('<div class="item disabled" id="top-toolbar-saved-views">Custom views</div>');

		} else {

			this._target.append('<div class="item" id="top-toolbar-layers" data-for="window-layerpanel">Layers</div>');

			this._target.append('<div class="item" id="top-toolbar-areas" data-for="window-areatree">Areas</div>');

			this._target.append('<div class="item" id="top-toolbar-selections" data-for="window-colourSelection">Selections</div>');

			if(Config.toggles.hasNewEvaluationTool) {
				this._target.append('<div class="item" id="top-toolbar-selection-filter" data-for="floater-evaluation-tool-widget">Areas filter</div>');
			} else {
				this._target.append('<div class="item" id="top-toolbar-selection-filter" data-for="window-legacyAdvancedFilters">Areas filter</div>');
			}

			this._target.append('<div class="item" id="top-toolbar-map-tools" data-for="window-maptools">Map tools</div>');

			this._target.append('<div class="item" id="top-toolbar-saved-views" data-for="window-saved-views">Custom views</div>');

		}

	};

	TopToolBar.prototype.handleClick = function(e){
		var targetId = e.target.getAttribute('data-for');
		if (targetId) {
			$('#' + targetId).toggleClass('open');
		}
	};

	TopToolBar.prototype.handleContextHelpClick = function(e){
		var target = $(e.target);
		var active = target.hasClass('active');
		if (active) {
			Config.contextHelp = false;
			if (PumaMain.controller.Help.overEl) {
				PumaMain.controller.Help.overEl.removeCls('help-over');
				PumaMain.controller.Help.overEl.un('mouseout', PumaMain.controller.Help.overEl.fc);
			}
		} else {
			Config.contextHelp = true;
		}
		target.toggleClass('active');
	};


	return TopToolBar;
});

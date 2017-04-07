define([], function () {
	"use strict";

	var TopToolBar = function() {
		this._target = $('#top-toolbar-widgets');
		this._target.on('click.topToolBar', '.item', this.handleClick);
		this.build();

		$('#top-toolbar-context-help').on('click.topToolBar', this.handleContextHelpClick);
		$('#top-toolbar-snapshot').on('click.topToolBar', this.handleSnapshotClick);
		$('#top-toolbar-share-view').on('click.topToolBar', this.handleShareViewClick);

		Observer.addListener("Tools.hideClick.layerpanel",this.handleHideClick.bind(this, 'window-layerpanel'));
		Observer.addListener("Tools.hideClick.areatree",this.handleHideClick.bind(this, 'window-areatree'));
		Observer.addListener("Tools.hideClick.selections",this.handleHideClick.bind(this, 'window-colourSelection'));
		Observer.addListener("Tools.hideClick.maptools",this.handleHideClick.bind(this, 'window-maptools'));
		Observer.addListener("Tools.hideClick.legacyAdvancedFilters",this.handleHideClick.bind(this, 'window-legacyAdvancedFilters'));
		Observer.addListener("Tools.hideClick.customviews",this.handleHideClick.bind(this, 'window-customviews'));
	};


	TopToolBar.prototype.build = function(){

		this._target.empty();

		var is3d = $('body').hasClass('mode-3d');

		if (is3d) {

			var classesLayers3d = $('#floater-world-wind-widget').hasClass('open') ? "item open" : "item";
			this._target.append('<div class="' + classesLayers3d + '" id="top-toolbar-layers" data-for="floater-world-wind-widget">Layers</div>');

			var classesAreas3d = $('#window-areatree').hasClass('open') ? "item open" : "item";
			this._target.append('<div class="' + classesAreas3d + '" id="top-toolbar-areas" data-for="window-areatree">Areas</div>');

			var classesSelections3d = $('#window-colourSelection').hasClass('open') ? "item open" : "item";
			this._target.append('<div class="' + classesSelections3d + '" id="top-toolbar-selections" data-for="window-colourSelection">Selections</div>');

			this._target.append('<div class="item disabled" id="top-toolbar-selection-filter">Areas filter</div>');

			this._target.append('<div class="item disabled" id="top-toolbar-map-tools">Map tools</div>');

			var classesCustomViews3d = Config.auth ? "item disabled" : "item disabled hidden";
			this._target.append('<div class="' + classesCustomViews3d + '" id="top-toolbar-saved-views">Custom views</div>');

			if(Config.toggles.isSnow) {
				this.handleSnow()
			}
		} else {

			var classesLayers = $('#window-layerpanel').hasClass('open') ? "item open" : "item";
			this._target.append('<div class="' + classesLayers + '" id="top-toolbar-layers" data-for="window-layerpanel">Layers</div>');

			var classesAreas = $('#window-areatree').hasClass('open') ? "item open" : "item";
			this._target.append('<div class="' + classesAreas + '" id="top-toolbar-areas" data-for="window-areatree">Areas</div>');

			var classesSelections = $('#window-colourSelection').hasClass('open') ? "item open" : "item";
			this._target.append('<div class="' + classesSelections + '" id="top-toolbar-selections" data-for="window-colourSelection">Selections</div>');

			if(Config.toggles.hasNewEvaluationTool) {
				var classesAreasFilter = $('#floater-evaluation-tool-widget').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesAreasFilter + '" id="top-toolbar-selection-filter" data-for="floater-evaluation-tool-widget">' + Config.basicTexts.advancedFiltersName + '</div>');
			} else {
				var classesLegacyAreasFilter = $('#window-legacyAdvancedFilters').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesLegacyAreasFilter + '" id="top-toolbar-selection-filter" data-for="window-legacyAdvancedFilters">' + Config.basicTexts.advancedFiltersName + '</div>');
			}

			var classesMapTools = $('#window-maptools').hasClass('open') ? "item open" : "item";
			this._target.append('<div class="' + classesMapTools + '" id="top-toolbar-map-tools" data-for="window-maptools">Map tools</div>');

			var classesCustomViews = Config.auth ? "item" : "item hidden";
			classesCustomViews += $('#window-customviews').hasClass('open') ? " open" : "";
			this._target.append('<div class="' + classesCustomViews + '" id="top-toolbar-saved-views" data-for="window-customviews">Custom views</div>');

			if(Config.toggles.isSnow) {
				this.handleSnow();
			}
		}

	};

	TopToolBar.prototype.handleSnow = function() {
		this._target.append('<div class="item" id="snow">Snow</div>');
		$('#snow').click(function(){
			$('body').append('<div style="position: absolute; top: 100px; bottom: 100px; left: 100px; right: 100px; z-index: 1000000; background: white;"><iframe width="100%" height="100%" src="http://35.165.51.145/snow"></iframe></div>');
		});

		this._target.append('<div class="item" id="metadata-composites">Composites</div>');
		$('#metadata-composites').click(function(){
			$.get(Config.url + 'rest/composites/metadata', function(data){
				var rows = '';
				data.metadata.forEach(function(row){
					rows+= '<tr><td>'+row.key+'</td><td>'+row.sensors.join(',')+'</td><td>'+row.date_start+'</td><td>'+row.date_end+'</td><td>'+row.period+'</td><td>'+row.area+'</td></tr>';
				});
				var table = "<div style='width: 100%; height: 400px;'><table style='width: 100%; height: 100%; overflow: auto;'><thead><tr><th>Key</th><th>Sensors</th><th>Date start</th><th>Date End</th><th>Period</th><th>Area</th></tr></thead><tbody>"+rows+"</tbody></table></div>";

				$('body').append('<div style="position: absolute; top: 100px; bottom: 100px; left: 100px; right: 100px; z-index: 1000000; background: white;">'+table+'</div>');
			});
		});
	};

	TopToolBar.prototype.handleClick = function(e){
		var targetId = e.target.getAttribute('data-for');
		if (targetId) {
			if (targetId == 'window-customviews') Ext.ComponentQuery.query('#window-customviews')[0].show();
			$('#' + targetId).toggleClass('open');
			$(e.target).toggleClass('open');
		}
	};

	TopToolBar.prototype.handleHideClick = function(targetId){
		if (targetId) {
			$('#' + targetId).removeClass('open');
			this._target.find('div[data-for="' + targetId + '"]').removeClass('open');
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

	TopToolBar.prototype.handleSnapshotClick = function(e){
		Observer.notify("PumaMain.controller.Map.onExportMapUrl");
	};

	TopToolBar.prototype.handleShareViewClick = function(e){
		Observer.notify("PumaMain.controller.ViewMng.onShare");
	};


	return TopToolBar;
});

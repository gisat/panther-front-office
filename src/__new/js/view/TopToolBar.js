define([
	'./CustomLayers',
	'../util/Floater',
	'../stores/Stores',
	'jquery'
], function (
	CustomLayers,
	Floater,
	InternalStores,
	$
) {
	"use strict";

	var TopToolBar = function(options) {
		this._dispatcher = options.dispatcher;
		this._target = $('#top-toolbar-widgets');
		this._target.on('click.topToolBar', '.item', this.handleClick.bind(this));
		this.build();

		$('#top-toolbar-context-help').on('click.topToolBar', this.handleContextHelpClick);
		$('#top-toolbar-snapshot').on('click.topToolBar', this.handleSnapshotClick);
		$('#top-toolbar-share-view').on('click.topToolBar', this.handleShareViewClick);
		$('#top-toolbar-3dmap').on("click.topToolBar", this.handle3dMapClick.bind(this));

		Observer.addListener("Tools.hideClick.layerpanel",this.handleHideClick.bind(this, 'window-layerpanel'));
		Observer.addListener("Tools.hideClick.areatree",this.handleHideClick.bind(this, 'window-areatree'));
		Observer.addListener("Tools.hideClick.selections",this.handleHideClick.bind(this, 'window-colourSelection'));
		Observer.addListener("Tools.hideClick.maptools",this.handleHideClick.bind(this, 'window-maptools'));
		Observer.addListener("Tools.hideClick.legacyAdvancedFilters",this.handleHideClick.bind(this, 'window-legacyAdvancedFilters'));
		Observer.addListener("Tools.hideClick.customviews",this.handleHideClick.bind(this, 'window-customviews'));
		Observer.addListener("Tools.hideClick.customLayers",this.handleHideClick.bind(this, 'window-customLayers'));
		Observer.addListener("Tools.hideClick.periods",this.handleHideClick.bind(this, 'floater-periods'));
	};


	TopToolBar.prototype.build = function(){
		var tools = {
			layers: true,
			areas: true,
			selections: true,
			mapTools: true,
			addLayer: true,
			customViews: true,
			customLayers: true,
			functionalFilrer: false
		};


		if (Config.toggles.hasFunctionalUrbanArea){
			tools.functionalFilrer = true;
		}
		if (Config.toggles.hasPeriodsWidget){
			tools.periods = true;
		}
		if (Config.toggles.hasOsmWidget){
			tools.osm = true;
		}
		if (Config.toggles.hasNewEvaluationTool) {
			tools.areasFilterNew = true;
		} else {
			tools.areasFilterOld = true;
		}
		if (Config.toggles.isSnow) {
			tools = this.handleSnow();
		}

		this.renderFeatures(tools);
	};

	TopToolBar.prototype.renderFeatures = function(tools){
		this._target.empty();
		var isWorldWind = $('body').hasClass('mode-3d');

		// tools for WorldWind mode
		if (isWorldWind){
			if (tools.layers){
				var classesLayers3d = $('#floater-world-wind-widget').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesLayers3d + '" id="top-toolbar-layers" data-for="floater-world-wind-widget"><span>'+polyglot.t('layers')+'</span></div>');
			}
			if (tools.areas){
				var classesAreas3d = $('#window-areatree').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesAreas3d + '" id="top-toolbar-areas" data-for="window-areatree"><span>'+polyglot.t('areas')+'</span></div>');
			}
			if (tools.periods){
				var classesPeriods3d = $('#floater-periods-widget').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesPeriods3d + '" id="top-toolbar-periods" data-for="floater-periods-widget"><span>'+polyglot.t('periods')+'</span></div>');
			}
			if (tools.osm){
				var classesOsm3d = $('#floater-osm-widget').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesOsm3d + '" id="top-toolbar-osm" data-for="floater-osm-widget"><span>'+polyglot.t('osm')+'</span></div>');
			}
			if (tools.selections){
				var classesSelections3d = $('#window-colourSelection').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesSelections3d + '" id="top-toolbar-selections" data-for="window-colourSelection"><span>'+polyglot.t('selections')+'</span></div>');
			}
			if (tools.areasFilterNew){
				var classesAreasFilter3d = $('#floater-evaluation-widget').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesAreasFilter3d + '" id="top-toolbar-selection-filter" data-for="floater-evaluation-widget"><span>'+polyglot.t('areasFilter')+'</span></div>');
			}
			if (tools.areasFilterOld){
				var classesLegacyAreasFilter3d = $('#window-legacyAdvancedFilters').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesLegacyAreasFilter3d + '" id="top-toolbar-selection-filter" data-for="window-legacyAdvancedFilters"><span>'+polyglot.t('areasFilter')+'</span></div>');
			}
			if (tools.mapTools){
				var classesMapTools3d = $('#floater-map-tools-widget').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesMapTools3d + '" id="top-toolbar-map-tools" data-for="floater-map-tools-widget"><span>'+polyglot.t('mapTools')+'</span></div>');
			}
			if (tools.customViews){
				var classesCustomViews3d = $('#floater-custom-views-widget').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesCustomViews3d + '" id="top-toolbar-saved-views" data-for="floater-custom-views-widget"><span>'+polyglot.t('customViews')+'</span></div>');
			}
			if (tools.snow){
				var classesSnowWidget3d = $('#floater-snow-widget').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesSnowWidget3d + '" id="top-toolbar-snow-configuration" data-for="floater-snow-widget"><span>'+polyglot.t('savedConfigurations')+'</span></div>');
			}
		}

		// tools for OpenLayers mode
		else {
			if (tools.layers){
				var classesLayers = $('#window-layerpanel').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesLayers + '" id="top-toolbar-layers" data-for="window-layerpanel"><span>'+polyglot.t('layers')+'</span></div>');
			}
			if (tools.areas){
				var classesAreas = $('#window-areatree').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesAreas + '" id="top-toolbar-areas" data-for="window-areatree"><span>'+polyglot.t('areas')+'</span></div>');
			}
			if (tools.selections){
				var classesSelections = $('#window-colourSelection').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesSelections + '" id="top-toolbar-selections" data-for="window-colourSelection"><span>'+polyglot.t('selections')+'</span></div>');
			}
			if (tools.areasFilterNew){
				var classesAreasFilter = $('#floater-evaluation-widget').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesAreasFilter + '" id="top-toolbar-selection-filter" data-for="floater-evaluation-widget"><span>'+polyglot.t('areasFilter')+'</span></div>');
			}
			if (tools.areasFilterOld){
				var classesLegacyAreasFilter = $('#window-legacyAdvancedFilters').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesLegacyAreasFilter + '" id="top-toolbar-selection-filter" data-for="window-legacyAdvancedFilters"><span>'+polyglot.t('areasFilter')+'</span></div>');
			}
			if (tools.mapTools){
				var classesMapTools = $('#window-maptools').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesMapTools + '" id="top-toolbar-map-tools" data-for="window-maptools"><span>'+polyglot.t('mapTools')+'</span></div>');
			}
			if (tools.customViews){
				var classesCustomViews = $('#floater-custom-views-widget').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesCustomViews + '" id="top-toolbar-saved-views" data-for="floater-custom-views-widget"><span>'+polyglot.t('customViews')+'</span></div>');
			}
			if (tools.customLayers){
				var classesCustomLayers = "item";
				classesCustomLayers += $('#window-customLayers').hasClass('open') ? " open" : "";
				this._target.append('<div class="' + classesCustomLayers + '" id="top-toolbar-custom-layers" data-for="window-customLayers"><span>'+polyglot.t('addLayer')+'</span></div>');
			}
			if (tools.functionalFilrer){
				var classesFunctionalFilter = $('#floater-functional-urban-area').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesFunctionalFilter + '" id="top-toolbar-functional-urban-area" data-for="floater-functional-urban-area"><span>'+polyglot.t('functionalUrbanArea')+'</span></div>');
			}
			if (tools.snow){
				var classesSnowWidget = $('#floater-snow-widget').hasClass('open') ? "item open" : "item";
				this._target.append('<div class="' + classesSnowWidget + '" id="top-toolbar-snow-configuration" data-for="floater-snow-widget"><span>'+polyglot.t('savedConfigurations')+'</span></div>');
			}
		}
	};

	/**
	 * SNOW: add configuration widget only
	 */
	TopToolBar.prototype.handleSnow = function() {
		// hide layers floater
		$("#floater-world-wind-widget").css("display", "none");

		return {
			snow: true
		};
	};

	TopToolBar.prototype.handleClick = function(e){
		var targetId = e.target.getAttribute('data-for');
		if (!targetId){
			targetId = $(e.currentTarget).attr("data-for");
		}

		if (targetId) {
			if (targetId == 'window-customviews') Ext.ComponentQuery.query('#window-customviews')[0].show();
			if (targetId == 'window-customLayers') this.initCustomLayersWindow();
			var floater = $('#' + targetId);
			if (targetId === 'floater-map-tools-widget' && floater.hasClass("open")){
				floater.find(".widget-detach").trigger("click");
			}
			floater.toggleClass('open');

			var type = targetId.split("-")[0];
			if (type === "window"){
				window.Stores.notify('floaters#sort', {
					fromExt: false,
					xWindowJQuerySelector: floater[0]
				});
			} else {
				window.Stores.notify('floaters#sort', {
					fromExt: false,
					floaterJQuerySelector: floater
				});
			}
			$(e.currentTarget).toggleClass('open');
			Stores.notify("widget#changedState", {floater: floater});
		}
	};

	TopToolBar.prototype.handleHideClick = function(targetId){
		if (targetId) {
			$('#' + targetId).removeClass('open');
			this._target.find('div[data-for="' + targetId + '"]').removeClass('open');
		}
	};

	TopToolBar.prototype.initCustomLayersWindow = function() {
		var component = $('#custom-layers-container');
		if (!component.length) {
			new CustomLayers;
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
		var item = $(this);
		var floater = $("#floater-sharing");

		if (item.hasClass("open")){
			item.removeClass("open");
			floater.removeClass("open");
		} else {
			item.addClass("open");
			floater.addClass("open");
			window.Stores.notify('floaters#sort', {
				fromExt: false,
				floaterJQuerySelector: floater
			});
		}
	};

	TopToolBar.prototype.handle3dMapClick = function(e){
		var isIn3DMode = $('body').hasClass("mode-3d");
		if (Config.toggles.useWorldWindOnly && isIn3DMode){
			this._dispatcher.notify("map#switchProjection");
			$(e.target).toggleClass('world-wind-2d');
		} else {
			this._dispatcher.notify("map#switchFramework");
		}
	};

	/**
	 * Set top tool bar items state and wingets state according to dataview configuration
	 * @param widgets {Object}
	 */
	TopToolBar.prototype.handleDataview = function(widgets){
		var openWidgets = widgets.open;
		openWidgets.forEach(function(widget){
			var floater = $('#' + widget.floater.id);
			var toolbarItem = $('#' + widget.topToolbarItem.id);
			floater.addClass("open");
			toolbarItem.addClass("open");
			Floater.setPosition(floater, widget.floater.position);
		});
	};


	return TopToolBar;
});

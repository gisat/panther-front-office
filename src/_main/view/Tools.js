/*
 TODO think about it
 */

var widgets = {
	layerpanel: {
		xtype: 'layerpanel',
		//maxHeight: 500,
		itemId: 'layerpanel',
		helpId: 'Layers',
		tools: [{
			type: 'gear',
			tooltip: polyglot.t('configureThematicMaps'),
			itemId: 'gear'
		},{
			type: 'detach',
			cls: 'detach',
			tooltip: polyglot.t('detach'),
			itemId: 'undock',
			hidden: Config.toggles.useTopToolbar
		},{
			type: 'hide',
			cls: 'hide',
			tooltip: polyglot.t('hide'),
			itemId: 'hide',
			hidden: !Config.toggles.useTopToolbar,
			listeners: {
				click: {
					fn: function() {
						Observer.notify("Tools.hideClick.layerpanel");
					}
				}
			}
		}],
		height: 340,
		header: !Config.toggles.useTopToolbar,
		title: polyglot.t('layers')
	},
	areatree: {
		xtype: 'areatree',
		itemId: 'areatree',
		cls: 'areaTreeSelection',
		helpId: 'TreeofanalyticalunitsAREAS',
		tools: [{
			type: 'areacollapseall',
			cls: 'areacollapseall',
			tooltip: polyglot.t('collapseAll'),
			itemId: 'areacollapseall'
		},{
			type: 'areacollapselevel',
			cls: 'areacollapselevel',
			tooltip: polyglot.t('collapseLastLevel'),
			itemId: 'areacollapselevel'
		},{
			type: 'areaexpandlevel',
			cls: 'areaexpandlevel',
			tooltip: polyglot.t('expandLastLevel'),
			itemId: 'areaexpandlevel'
		},{
			type: 'detach',
			cls: 'detach',
			tooltip: polyglot.t('detach'),
			itemId: 'undock',
			hidden: Config.toggles.useTopToolbar
		},{
			type: 'hide',
			cls: 'hide',
			tooltip: polyglot.t('hide'),
			itemId: 'hide',
			hidden: !Config.toggles.useTopToolbar,
			listeners: {
				click: {
					fn: function() {
						Observer.notify("Tools.hideClick.areatree");
					}
				}
			}
		}],
		title: Config.basicTexts.areasSectionName,
		header: !Config.toggles.useTopToolbar,
		height: 340
		//,maxHeight: 500
	},
	colourSelection: {
		xtype: 'panel',
		title: polyglot.t('selections'),
		header: Config.toggles.useTopToolbar ? false : {height: 60},
		// id: 'selcolor',
		itemId: 'selcolor',
		helpId: 'Multipleselectionshighlightedbyc',
		tools: [{
			type: 'unselect',
			cls: 'unselect',
			tooltip: polyglot.t('unselectActiveSelection'),
			itemId: 'unselect'
		},{
			type: 'unselectall',
			cls: 'unselectall',
			tooltip: polyglot.t('unselectAll'),
			itemId: 'unselectall'
		},{
			type: 'detach',
			cls: 'detach',
			tooltip: polyglot.t('detach'),
			itemId: 'undock',
			hidden: Config.toggles.useTopToolbar
		},{
			type: 'hide',
			cls: 'hide',
			tooltip: polyglot.t('hide'),
			itemId: 'hide',
			hidden: !Config.toggles.useTopToolbar,
			listeners: {
				click: {
					fn: function() {
						Observer.notify("Tools.hideClick.selections");
					}
				}
			}
		}],
		layout: {
			type: 'hbox',
			align: 'middle'
		},
		height: 30,
		items: [{
			xtype: 'colorpicker',
			fieldLabel: 'CP',
			value: 'ff4c39',
			itemId: 'selectcolorpicker',
			height: 22,
			margin: '0 10',
			flex: 1,
			//width: 120,
			colors: ['ff4c39', '34ea81', '39b0ff', 'ffde58', '5c6d7e', 'd97dff']

		}]
	},
	legacyAdvancedFilters: {
		xtype: 'panel',
		// id: 'legacyAdvancedFilters0',
		collapsed: !Config.toggles.useTopToolbar,
		tools: [{
			type: 'poweron',
			tooltip: polyglot.t('activateDeactivate'),
			itemId: 'poweron'
		},{
			type: 'refresh',
			tooltip: polyglot.t('reset'),
			itemId: 'refresh'
		},{
			type: 'gear',
			tooltip: polyglot.t('Configure filters'),
			itemId: 'gear'
		},{
			type: 'detach',
			tooltip: polyglot.t('detach'),
			cls: 'detach',
			itemId: 'undock',
			hidden: Config.toggles.useTopToolbar
		},{
			type: 'hide',
			cls: 'hide',
			tooltip: polyglot.t('hide'),
			itemId: 'hide',
			hidden: !Config.toggles.useTopToolbar,
			listeners: {
				click: {
					fn: function() {
						Observer.notify("Tools.hideClick.legacyAdvancedFilters");
					}
				}
			}
		}],
		layout: {
			type: 'vbox',
			align: 'stretch'

		},
		itemId: 'advancedfilters',
		helpId: 'Filteringanalyticalunits',
		//            buttons: [{
		//                text: 'Configure',
		//                hidden: true,
		//                itemId: 'configurefilters'
		//            },{
		//                text: 'Instant',
		//                hidden: true,
		//                itemId: 'instantfilter',
		//                enableToggle: true
		//            },{
		//                text: 'Select',
		//                hidden: true,
		//                disabled: true,
		//                itemId: 'filterselect'
		//            }],
		header: !Config.toggles.useTopToolbar,
		title: Config.basicTexts.advancedFiltersName,
		bodyCls: 'tools-filters-list'
	},
	maptools: {
		xtype: 'maptools',
		collapsed: false,
		itemId: 'maptools',
		helpId: 'Maptools',
		tools: [{
			type: 'detach',
			cls: 'detach',
			tooltip: polyglot.t('detach'),
			itemId: 'undock',
			hidden: Config.toggles.useTopToolbar
		},{
			type: 'hide',
			cls: 'hide',
			tooltip: polyglot.t('hide'),
			itemId: 'hide',
			hidden: !Config.toggles.useTopToolbar,
			listeners: {
				click: {
					fn: function() {
						Observer.notify("Tools.hideClick.maptools");
					}
				}
			}
		}],
		header: !Config.toggles.useTopToolbar,
		title: 'Map tools'
	},
	customLayers: {
		xtype: 'panel',
		//collapsed: false,
		itemId: 'customLayers',
		//helpId: 'customLayers',
		hidden: !Config.toggles.useTopToolbar,
		tools: [{
			type: 'hide',
			cls: 'hide',
			tooltip: polyglot.t('hide'),
			itemId: 'hide',
			hidden: !Config.toggles.useTopToolbar,
			listeners: {
				click: {
					fn: function() {
						Observer.notify("Tools.hideClick.customLayers");
					}
				}
			}
		}],
		width: 400,
		height: 400,
		header: !Config.toggles.useTopToolbar,
		title: polyglot.t('addLayer'),
		html: "<div id='custom-layers'></div>"
	}
};


if (Config.toggles.useTopToolbar) {

	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	var offsetTop = 0;
	var offsetBottom = 0;
	if (Config.toggles.useWBHeader) offsetTop += 40;
	if (Config.toggles.useHeader) offsetTop += 45;
	if (Config.toggles.useNewViewSelector) {
		if (windowWidth > 1400) {
			offsetTop += 40;
		} else {
			offsetTop += 70;
		}
	} else {
		offsetTop += 105;
	}
	if (Config.toggles.useTopToolbar) offsetTop += 30;
	if (Config.toggles.useWBFooter) offsetBottom += 27;
	var viewportHeight = windowHeight - offsetTop - offsetBottom;
	var floaterAddedHeight = 40;
	var floaterWidth = 260;

	widgets.layerpanel.height = (viewportHeight - 9)/2 - floaterAddedHeight;
	widgets.layerpanel.ptrWindow = {
		x: 3,
		y: offsetTop + 3
	};
	widgets.areatree.height = widgets.layerpanel.height - 20; // todo fix areatree styling & remove 20
	widgets.areatree.ptrWindow = {
		x: 3,
		y: offsetTop + 3 + widgets.layerpanel.height + floaterAddedHeight + 3
	};
	widgets.colourSelection.ptrWindow = {
		x: 3 + floaterWidth + 3,
		y: offsetTop + 3
	}
	widgets.maptools.ptrWindow = {
		x: 3 + floaterWidth + 3,
		y: offsetTop + 3 + widgets.colourSelection.height + floaterAddedHeight + 3
	}
	widgets.legacyAdvancedFilters.ptrWindow = {
		x: 3 + floaterWidth + 3,
		y: offsetTop + 3 + widgets.colourSelection.height + floaterAddedHeight + 3 + 202 + 3 //202 - complete maptools
	}


	Ext.define('PumaMain.view.Tools', {
		extend: 'Ext.container.Container',
		alias: 'widget.toolspanel',
		initComponent: function () {

			// define widgets
			Object.keys(widgets).forEach(function(toolID){

				var window = Ext.widget('window',{
					itemId: "window-" + toolID,
					id: "window-" + toolID,
					layout: 'fit',
					width: widgets[toolID].width || 260,
					maxHeight: 600,
					resizable: true,
					closable: !Config.toggles.useTopToolbar,
					cls: 'detached-window',
					isdetached: 1,
					constrainHeader: true,
					tools: widgets[toolID].tools,
					title: widgets[toolID].title,
					x: widgets[toolID].ptrWindow ? widgets[toolID].ptrWindow.x : undefined,
					y: widgets[toolID].ptrWindow ? widgets[toolID].ptrWindow.y : undefined,
					items: widgets[toolID]
				});

			});

			this.callParent();

		}
	});

} else {
	Ext.define('PumaMain.view.Tools', {
		extend: 'Ext.container.Container',
		alias: 'widget.toolspanel',
		// to be removed
		width: '100%',
		autoScroll: true,
		requires: ['PumaMain.view.LayerPanel', 'PumaMain.view.MapTools', 'Gisatlib.slider.DiscreteTimeline'],
		initComponent: function () {
			this.layout = {
				type: 'accordion',
				fill: false,
				multi: true
			};
			this.defaults = {
				//hideCollapseTool: true
				collapseLeft: true
			};

			this.items = [widgets.colourSelection,widgets.layerpanel,widgets.areatree,widgets.maptools,widgets.legacyAdvancedFilters];
			if (Config.toggles.advancedFiltersFirst){
				this.items = [widgets.colourSelection,widgets.legacyAdvancedFilters,widgets.layerpanel,widgets.areatree,widgets.maptools];
			}
			if (Config.toggles.hasNewEvaluationTool){
				this.items = [widgets.colourSelection,widgets.layerpanel,widgets.areatree,widgets.maptools];
			}


			this.callParent();
		}
	})
}

/*
 TODO think about it
 */

var widgets = {
	colourSelection: {
		xtype: 'panel',
		title: 'Selections',
		header: Config.toggles.useTopToolbar ? false : {height: 60},
		// id: 'selcolor',
		itemId: 'selcolor',
		helpId: 'Multipleselectionshighlightedbyc',
		tools: [{
			type: 'unselect',
			cls: 'unselect',
			tooltip: 'Unselect active selection',
			itemId: 'unselect'
		},{
			type: 'unselectall',
			cls: 'unselectall',
			tooltip: 'Unselect all',
			itemId: 'unselectall'
		},{
			type: 'detach',
			cls: 'detach',
			tooltip: 'Detach',
			itemId: 'undock'
		}],
		layout: {
			type: 'hbox',
			align: 'middle'
		},
		height: 72,
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
		collapsed: true,
		tools: [{
			type: 'poweron',
			tooltip: 'Activate/deactivate',
			itemId: 'poweron'
		},{
			type: 'refresh',
			tooltip: 'Reset',
			itemId: 'refresh'
		},{
			type: 'gear',
			tooltip: 'Configure filters',
			itemId: 'gear'
		},{
			type: 'detach',
			tooltip: 'Detach',
			cls: 'detach',
			itemId: 'undock'
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
	layerpanel: {
		xtype: 'layerpanel',
		//maxHeight: 500,
		itemId: 'layerpanel',
		helpId: 'Layers',
		tools: [{
			type: 'gear',
			tooltip: 'Configure thematic maps',
			itemId: 'gear'
		},{
			type: 'detach',
			cls: 'detach',
			tooltip: 'Detach',
			itemId: 'undock'
		}],
		height: 300,
		header: !Config.toggles.useTopToolbar,
		title: 'Layers'
	},
	areatree: {
		xtype: 'areatree',
		itemId: 'areatree',
		cls: 'areaTreeSelection',
		helpId: 'TreeofanalyticalunitsAREAS',
		tools: [{
			type: 'areacollapseall',
			cls: 'areacollapseall',
			tooltip: 'Collapse all',
			itemId: 'areacollapseall'
		},{
			type: 'areacollapselevel',
			cls: 'areacollapselevel',
			tooltip: 'Collapse last level',
			itemId: 'areacollapselevel'
		},{
			type: 'areaexpandlevel',
			cls: 'areaexpandlevel',
			tooltip: 'Expand last level',
			itemId: 'areaexpandlevel'
		},{
			type: 'detach',
			cls: 'detach',
			tooltip: 'Detach',
			itemId: 'undock'
		}],
		title: Config.basicTexts.areasSectionName,
		header: !Config.toggles.useTopToolbar,
		height: 340
		//,maxHeight: 500
	},
	maptools: {
		xtype: 'maptools',
		collapsed: false,
		itemId: 'maptools',
		helpId: 'Maptools',
		tools: [{
			type: 'detach',
			cls: 'detach',
			tooltip: 'Detach',
			itemId: 'undock',
			hidden: Config.toggles.useTopToolbar
		}],
		header: !Config.toggles.useTopToolbar,
		title: 'Map tools'
	}
};


if (Config.toggles.useTopToolbar) {


	Ext.define('PumaMain.view.Tools', {
		extend: 'Ext.container.Container',
		alias: 'widget.toolspanel',
		initComponent: function () {

			// define widgets
			Object.keys(widgets).forEach(function(toolID){

				var widgetWindow = Ext.widget('window',{
					itemId: "window-" + toolID,
					id: "window-" + toolID,
					layout: 'fit',
					width: 260,
					maxHeight: 600,
					resizable: true,
					cls: 'detached-window',
					isdetached: 1,
					constrainHeader: true,
					tools: widgets[toolID].tools,
					title: widgets[toolID].title,

					items: widgets[toolID],

				});

				// var toolId = widgetWindow.tools.close.el.id;
				// Ext.tip.QuickTipManager.register({
				// 	target: toolId,
				// 	text: 'Attach back'
				// });
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


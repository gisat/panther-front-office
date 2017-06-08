Ext.define('PumaMain.controller.ViewMng', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: ['PumaMain.view.CommonMngGrid','PumaMain.view.CommonSaveForm'],
    init: function() {

		Observer.addListener("PumaMain.controller.ViewMng.onShare",this.onShare.bind(this));

		if (Config.toggles.useTopToolbar) {
			this.onVisOrViewManage({itemId: 'customviews'});
		}

        this.control(
                {
                    'commonmnggrid' : {
                        recmoved: this.onRecMoved,
                        recdeleted: this.onDelete,
                        urlopen: this.onUrlOpen
                    },
                    'commonsaveform #save' : {
                        click: this.onSave
                    },
                    '#savevisualization': {
                        click: this.onVisSave
                    },
                    '#managevisualization': {
                        click: this.onVisOrViewManage
                    },
                    '#savedataview': {
                        click: this.onViewSave
                    },
                    '#managedataview': {
                        click: this.onVisOrViewManage
                    },
                    '#sharedataview': {
                        click: this.onShare
                    },
                })
    },
    
    onUrlOpen: function(grid,rec) {
        var url = window.location.origin+window.location.pathname+'?id='+rec.get('_id');

        var items = [{
			xtype: 'displayfield',
			value: url
		}];
        if(Config.toggles.isUrbanTep){
            items.push({
                xtype: 'button',
                text: 'Share on portal',
                handler: function() {
                    alert('clicked');
                }
            })
        }

        var win = Ext.widget('window',{
                bodyCls: 'urlwindow',
                title: 'Data view URL',
                items: items
            });
            win.show();
    },
    
    onRecMoved: function(grid,rec, moveUp) {
        var store = Ext.StoreMgr.lookup('visualization4sel');
        var ids = store.collect('_id');
        var id = rec.get('_id')
        var idx = Ext.Array.indexOf(ids,id);
        var length = ids.length;
        Ext.Array.remove(ids,id)
        var newIdx = moveUp ? (idx-1) : (idx+1);
        if (newIdx<0 || newIdx+1>length) return;
        Ext.Array.insert(ids,newIdx,[id]);
        var themeId = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var theme = Ext.StoreMgr.lookup('theme').getById(themeId);
        theme.set('visOrder',ids);
        this.saveRecordsOrder(themeId, ids);
        //theme.save();
        store.sort();
        
    },
	/**
     * Save the order of visualizations
     * @param theme {string} id of the theme
     * @param visualizations {Array} list of visaulizations
     */
    saveRecordsOrder: function(theme, visualizations){
        $.post(Config.url + "rest/vis/saveorder", {
            theme: theme,
            visOrder: visualizations
        }).done(function(data) {
            console.log("Visualizations order saved!")
        });
    },
    onDelete: function(grid,rec) {
        rec.destroy();
    },
    onSave: function(btn) {
        var form = btn.up('form');
        var name = form.getComponent('name').getValue();
        var rec = form.rec;
        rec.set('name',name);
        rec.save({
            callback: this.onSaveFinish
        });
        btn.up('window').close();
        
    },
    onShare: function() {
        var view = Ext.create('Puma.model.DataView',this.gatherViewConfig());
        view.save({
            callback: this.onSaveFinish
        });  
    },
    onSaveFinish: function(rec,operation) {
        var isView = rec.modelName == 'Puma.model.DataView';
        var store = Ext.StoreMgr.lookup(isView ? 'dataview' : 'visualization');
        store.addWithSlaves(rec);
        if (isView) {
            var url = window.location.origin+window.location.pathname+'?id='+rec.get('_id');

            // TODO: Clean
            Widgets.sharing.url = url;
            Widgets.sharing.rebuild();
            $('#floater-sharing').show();
        }
    },
        
    onVisOrViewManage: function(btn) {
		if (btn.itemId == 'managevisualization') {
			var window = Ext.widget('window',{
				layout: 'fit',
				width: 300,
				title: 'Manage visualizations',
				id: 'window-' + btn.itemId,
				height: 400,
				y: 200,
				bodyCls: 'manageDwWindow',
				items: [{
					xtype: 'commonmnggrid',
					allowReorder: true,
					store: Ext.StoreMgr.lookup('visualization4sel')
				}]
			});
			window.show();
		} else {
			var window2 = Ext.widget('window',{
				layout: 'fit',
				width: 300,
				title: 'Custom views',
				id: 'window-' + btn.itemId,
				itemId: 'window-customviews',
				cls: Config.toggles.useTopToolbar ? 'detached-window' : undefined,
				closable: !Config.toggles.useTopToolbar,
				height: 400,
				y: 200,
				bodyCls: 'manageDwWindow',
				items: [{
					xtype: 'commonmnggrid',
					allowReorder:false,
					store: Ext.StoreMgr.lookup('dataview')
				}],
				tools: [{
					type: 'hide',
					cls: 'hide',
					tooltip: 'Hide',
					itemId: 'hide',
					hidden: !Config.toggles.useTopToolbar,
					listeners: {
						click: {
							fn: function() {
								Observer.notify("Tools.hideClick.customviews");
							}
						}
					}
				}]
			});
			//window2.show();
		}

    },
        
    onDataviewLoad: function() {
        var yearCombo = Ext.ComponentQuery.query('#selyear')[0];
        var datasetCombo = Ext.ComponentQuery.query('#seldataset')[0];
        var themeCombo = Ext.ComponentQuery.query('#seltheme')[0];
        var visualizationCombo = Ext.ComponentQuery.query('#selvisualization')[0];
        var locationCombo = Ext.ComponentQuery.query('#sellocation')[0];

        yearCombo.suspendEvents();
        datasetCombo.suspendEvents();
        themeCombo.suspendEvents();
        visualizationCombo.suspendEvents();
        locationCombo.suspendEvents();

        datasetCombo.setValue(Config.cfg.dataset);
        
        var locStore = Ext.StoreMgr.lookup('location4init');
        locStore.clearFilter(true);
        locStore.filter([
            function(rec) {
                return rec.get('dataset')==Config.cfg.dataset;
            }
        ]);

        var themeStore = Ext.StoreMgr.lookup('theme4sel');
        themeStore.clearFilter(true);
        themeStore.filter([
            function(rec) {
                return rec.get('dataset')==Config.cfg.dataset;
            }
        ]);

        var visStore = Ext.StoreMgr.lookup('visualization4sel');
        var yearStore = Ext.StoreMgr.lookup('year4sel');
        var themeYears = Ext.StoreMgr.lookup('theme').getById(Config.cfg.theme).get('years');
        
        yearStore.clearFilter(true);
        yearStore.filter([function(rec) {
            return Ext.Array.contains(themeYears,rec.get('_id'))
        }])

        visStore.clearFilter(true);
        visStore.filter([function(rec) {
            return rec.get('theme')==Config.cfg.theme
        }]);

        yearCombo.setValue(Config.cfg.years);
        visualizationCombo.setValue(Config.cfg.visualization);
        themeCombo.setValue(Config.cfg.theme);

        locationCombo.setValue(Config.cfg.location);


        yearCombo.resumeEvents();
        datasetCombo.resumeEvents();
        themeCombo.resumeEvents();
        visualizationCombo.resumeEvents();
        locationCombo.resumeEvents();

        var onlySel = Ext.ComponentQuery.query('#areapager #onlySelected')[0];
        onlySel.suspendEvents();
        onlySel.toggle(Config.cfg.pagingUseSelected);
        onlySel.resumeEvents();
        
        var selColors = Ext.ComponentQuery.query('#useselectedcolorpicker')[0];
        selColors.suspendEvents();
        if (Config.cfg.pagingSelectedColors) {
            selColors.select(Config.cfg.pagingSelectedColors);

        }
        selColors.resumeEvents();
        
        onlySel.suspendEvents();
        onlySel.toggle(Config.cfg.pagingUseSelected);
        onlySel.resumeEvents();
        
        this.getController('AttributeConfig').filterConfig = Config.cfg.filterAttrs;
        this.getController('Filter').attrs = Config.cfg.filterAttrs;
        this.getController('Filter').initialValues = Config.cfg.filterMap;
        this.getController('Filter').changeActiveState(Config.cfg.filterActive);
        var locationTheme = this.getController('LocationTheme');
        locationTheme.datasetChanged = true;
        locationTheme.visChanged = true;
        locationTheme.themeChanged = true;
        locationTheme.yearChanged = true;
        locationTheme.locationChanged = true;
        this.getController('Map').map1.controls[0].activate();
		locationTheme.onYearChange({itemId:'dataview'});

		var locStore = Ext.StoreMgr.lookup('location4init');
		var locationsData = locStore.query('dataset',Config.cfg.dataset);
		ThemeYearConfParams.allPlaces = [];
		locationsData.items.forEach(function(item){
			ThemeYearConfParams.allPlaces.push(item.raw.id);
		});
        this.getController('LocationTheme').reloadWmsLayers();

        // Figure out how does this actually work.
        var scope = Ext.StoreMgr.lookup('dataset').getById(Config.cfg.dataset);
        if(scope.get('oneLevelOnly')){
        	setTimeout(function(){
				Stores.notify('map#show3D');

				$('.areaTreeSelection').hide();
				$('#top-toolbar-areas').hide();

				// Also hide chart related stuff
				$('#window-areatree').hide();
				this.getController('DomManipulation')._onReportsSidebarToggleClick();
				$('#sidebar-reports').hide();

				// Also switch map to 3D mode
				// Remove the possibility to switch back
				$('#top-toolbar-3dmap').hide();
			}.bind(this), 2000);
		}

		if(Config.cfg.selection) {
        	window.selectionStore.deserialize(Config.cfg.selection);
		}
    },

	gatherViewConfig: function () {
		var cfg = {};
		cfg.multipleMaps = Ext.ComponentQuery.query('maptools #multiplemapsbtn')[0].pressed === true;
		cfg.years = Ext.ComponentQuery.query('#selyear')[0].getValue();
		cfg.dataset = Ext.ComponentQuery.query('#seldataset')[0].getValue();
		cfg.theme = Ext.ComponentQuery.query('#seltheme')[0].getValue();
		cfg.visualization = Ext.ComponentQuery.query('#selvisualization')[0].getValue();
		cfg.location = Ext.ComponentQuery.query('#sellocation')[0].getValue();
		cfg.expanded = this.getController('Area').getExpandedAndFids().expanded;
		cfg.selMap = this.getController('Select').selMap;
		cfg.choroplethCfg = this.getController('AttributeConfig').layerConfig;

		cfg.pagingUseSelected = Ext.ComponentQuery.query('#areapager #onlySelected')[0].pressed;
		var pagingPicker = Ext.ComponentQuery.query('#useselectedcolorpicker')[0];
		cfg.pagingSelectedColors = pagingPicker.xValue || pagingPicker.value;

		var sliders = Ext.ComponentQuery.query('#advancedfilters multislider');
		var filterMap = {};
		for (var i = 0; i < sliders.length; i++) {
			var slider = sliders[i];
			var val = slider.getValue();
			var attrName = slider.attrname;
			filterMap[attrName] = val;

		}

		cfg.filterMap = filterMap;
		cfg.filterData = this.getController('Filter').filterData;
		cfg.filterAttrs = this.getController('Filter').attrs;
		cfg.filterActive = false;

		var layers = Ext.StoreMgr.lookup('selectedlayers').getRange();
		this.getController('Layers').resetIndexes();
		var layerCfg = [];
		for (var i = 0; i < layers.length; i++) {
			var layer = layers[i];
			layerCfg.push({
				opacity: layer.get('layer1').opacity || 1,
				sortIndex: layer.get('sortIndex'),
				type: layer.get('type'),
				attributeSet: layer.get('attributeSet'),
				attribute: layer.get('attribute'),
				at: layer.get('at'),
				name: layer.get('name'),
				symbologyId: layer.get('symbologyId')
			})
		}
		cfg.layers = layerCfg;
		cfg.trafficLayer = Ext.StoreMgr.lookup('layers').getRootNode().findChild('type', 'livegroup').childNodes[0].get('checked');
		var store = Ext.StoreMgr.lookup('paging');
		cfg.page = store.currentPage;

		var map = Ext.ComponentQuery.query('#map')[0].map;
		cfg.mapCfg = {
			center: map.center,
			zoom: map.zoom
		};
		// SelectionStore
		cfg.selection = window.selectionStore.serialize();

		var cfgs = this.getController('Chart').gatherCfg();
		var queryCfgs = this.getController('Chart').gatherCfg(true);
		var viewCfgs = [];
		for (var i = 0; i < cfgs.length; i++) {
			viewCfgs.push({
				cfg: cfgs[i],
				queryCfg: queryCfgs[i]
			})
		}
		cfg.cfgs = viewCfgs;

		return {
			conf: cfg
		}
	},
    
    
    onVisSave: function() {
        var theme = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var cfgs = this.getController('Chart').gatherCfg();
        var layerCfgs = this.getController('AttributeConfig').layerConfig;
        var layers = Ext.StoreMgr.lookup('selectedlayers').getRange();
        var visibleLayers = [];
        for (var i=0;i<layers.length;i++) {
            var layer = layers[i];
            var type = layer.get('type');
            
            if (type=='topiclayer') {
                visibleLayers.push({
                    at: layer.get('at'),
                    symbologyId: layer.get('symbologyId')
                })
            }
            if (type=='chartlayer') {
                visibleLayers.push({
                    attributeSet: layer.get('attributeSet'),
                    attribute: layer.get('attribute')
                })
            }
        }

        var visOptions = ExchangeParams.options;
        // check if sidebar with reports or sidebar with tools is open or closed
        var isReportBoxOpen = true;
        var isToolBoxOpen = true;

        var reportsClass = Ext.get('sidebar-reports').dom.className;
        if (reportsClass){
            isReportBoxOpen = false;
        }

        var toolsClass = Ext.get('sidebar-tools').dom.className;
        if (toolsClass){
            isToolBoxOpen = false;
        }

        visOptions.openSidebars = {
            "sidebar-reports": isReportBoxOpen,
            "sidebar-tools": isToolBoxOpen
        };
        
        var vis = Ext.create('Puma.model.Visualization',{
            theme: theme,
            cfg: cfgs,
            choroplethCfg: layerCfgs,
            visibleLayers: visibleLayers,
            attributes: ExchangeParams.attributesState,
            options: visOptions
        });
        var window = Ext.widget('window',{
            layout: 'fit',
            width: 300,
            cls: 'window-savevisualization',
            title: 'Save visualization',
            y: 200,
            bodyCls: 'saveaswindow',
            items: [{
                xtype: 'commonsaveform',
                rec: vis
            }]
        });
        window.show();
    },
    onViewSave: function() {
        var view = Ext.create('Puma.model.DataView',this.gatherViewConfig());
        var window = Ext.widget('window',{
            layout: 'fit',
            width: 300,
            title: 'Save data view',
            y: 200,
            cls: 'window-savedataview',
            bodyCls: 'saveaswindow',
            items: [{
                xtype: 'commonsaveform',
                rec: view
            }]
        });
        window.show();
    }
    
});
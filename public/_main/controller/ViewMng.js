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

        Observer.notify('ViewMng#init');
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
                text: polyglot.t('shareOnPortal'),
                handler: function() {
                    alert('clicked');
                }
            })
        }

        var win = Ext.widget('window',{
                bodyCls: 'urlwindow',
                title: polyglot.t('dataViewUrl'),
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
    onShare: function(options) {
		const onSave = (rec,operation) => {

			const promises = []
			if(options.group.value && options.group.value !== 'null') {
				promises.push(store.groups.share(options.group.value, options.state.scope, options.state.places, rec.data._id));
			}
			if(options.user.value && options.user.value !== 'null') {
				promises.push(store.user.share(options.user.value, options.state.scope, options.state.places, rec.data._id));
			}
			Promise.all(promises).then(() => {
				this.onSaveFinish(rec, operation, options.group, options.user, options.language);
				window.Stores.notify('components#shareSetVisible', false);
			})
		}

		const store = window.store;
		options.state = window.stateStore.current();
		var view = Ext.create('Puma.model.DataView',this.gatherViewConfig(options));

		//Clear view options from share window
		view.data.conf.components.share = null;
		view.data.conf.components.windows.share = {open:false};

		view.save({
			callback: onSave
		});
	},

    onSaveFinish: function(rec, operation, group, user, language) {
        var isView = rec.modelName == 'Puma.model.DataView';
        var store = Ext.StoreMgr.lookup(isView ? 'dataview' : 'visualization');
        store.addWithSlaves(rec);
        if (isView) {
        	var id = rec.get('_id');
			var url = window.location.origin+window.location.pathname+'?id='+id;
			this.showUrl(url, group, user, language);
			Stores.notify('sharing#urlReceived', {
				dataviewId: Number(id),
				url: url
			});
			Stores.notify("DATAVIEWS_ADD", [{
				id: rec.data._id,
				key: rec.data._id,
				date: new Date(),
				// data: {
				// 	name: rec.data.conf.name,
				// 	description: rec.data.conf.description,
				// 	dataset: rec.data.conf.dataset,
				// 	language: rec.data.conf.language
				// },
				data: rec.data.conf,
				permissions: rec.data.permissions
			}]);
        }
	},

	showUrl: function(baseUrl, selectedGroup, selectedUser, language){
		let auth = "&needLogin=true";
		const isLoggedIn = stateStore.current().user.isLoggedIn;
		if (isLoggedIn && selectedGroup.value === '2'){
			auth = "";
		}
		let url = baseUrl + auth +'&lang=' + language.value;
		if(Config.toggles.isUrbanTep && selectedGroup) {
			if(selectedGroup.value !== '1' && selectedGroup.value !== '2' && selectedGroup.value !== '3') {
				UrbanTepPortalStore.share(url, selectedUser.value, selectedGroup.title);
			}
		}
		alert(polyglot.t('theStateWasCorrectlyShared') + url);
    },
        
    onVisOrViewManage: function(btn) {
		if (btn.itemId == 'managevisualization') {
			var window = Ext.widget('window',{
				layout: 'fit',
				width: 300,
				title: polyglot.t('manageVisualizations'),
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
				title: polyglot.t('customViews'),
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
					tooltip: polyglot.t('hide'),
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
		var cfg = Config.cfg;

        yearCombo.suspendEvents();
        datasetCombo.suspendEvents();
        themeCombo.suspendEvents();
        visualizationCombo.suspendEvents();
        locationCombo.suspendEvents();

        datasetCombo.setValue(cfg.dataset);

        var locStore = Ext.StoreMgr.lookup('location4init');
        locStore.clearFilter(true);
        locStore.filter([
            function(rec) {
                return rec.get('dataset')==cfg.dataset;
            }
        ]);

        var themeStore = Ext.StoreMgr.lookup('theme4sel');
        themeStore.clearFilter(true);
        themeStore.filter([
            function(rec) {
                return rec.get('dataset')==cfg.dataset;
            }
        ]);

        var visStore = Ext.StoreMgr.lookup('visualization4sel');
        var yearStore = Ext.StoreMgr.lookup('year4sel');
        var themeYears = Ext.StoreMgr.lookup('theme').getById(cfg.theme).get('years');
        
        yearStore.clearFilter(true);
        yearStore.filter([function(rec) {
            return Ext.Array.contains(themeYears,rec.get('_id'))
        }])

        visStore.clearFilter(true);
        visStore.filter([function(rec) {
            return rec.get('theme')==cfg.theme
        }]);

        yearCombo.setValue(cfg.years);
        visualizationCombo.setValue(cfg.visualization);
        themeCombo.setValue(cfg.theme);

        locationCombo.setValue(cfg.location);

        yearCombo.resumeEvents();
        datasetCombo.resumeEvents();
        themeCombo.resumeEvents();
        visualizationCombo.resumeEvents();
        locationCombo.resumeEvents();

        var onlySel = Ext.ComponentQuery.query('#areapager #onlySelected')[0];
        onlySel.suspendEvents();
        onlySel.toggle(cfg.pagingUseSelected);
        onlySel.resumeEvents();
        
        var selColors = Ext.ComponentQuery.query('#useselectedcolorpicker')[0];
        selColors.suspendEvents();
        if (cfg.pagingSelectedColors) {
            selColors.select(cfg.pagingSelectedColors);

        }
        selColors.resumeEvents();
        
        onlySel.suspendEvents();
        onlySel.toggle(cfg.pagingUseSelected);
        onlySel.resumeEvents();
        
        this.getController('AttributeConfig').filterConfig = cfg.filterAttrs;
        var locationTheme = this.getController('LocationTheme');
        locationTheme.datasetChanged = true;
        locationTheme.visChanged = true;
        locationTheme.themeChanged = true;
        locationTheme.yearChanged = true;
        locationTheme.locationChanged = true;
        locationTheme.onYearChange({itemId:'dataview'});

		var locStore = Ext.StoreMgr.lookup('location4init');
		var locationsData = locStore.query('dataset',cfg.dataset);

		ThemeYearConfParams.allPlaces = [];
		locationsData.items.forEach(function(item){
			ThemeYearConfParams.allPlaces.push(item.raw._id || item.raw.id);
		});
        this.getController('LocationTheme').reloadWmsLayers();

        // Figure out how does this actually work.
        var scope = Ext.StoreMgr.lookup('dataset').getById(cfg.dataset);
        var selection = cfg.selection;
        if(scope.get('oneLevelOnly')){
        	setTimeout(function(){
				Stores.notify('fo#adjustConfiguration');

				if(selection) {
					window.selectionStore.deserialize(selection);
				}
			}.bind(this), 2000);
		}


		var options = {};
		// set location and range of all maps
		if (Config.cfg.worldWindState){
			options.worldWindState = {
				location: Config.cfg.worldWindState.location,
				range: Config.cfg.worldWindState.range,
				is2D: Config.cfg.worldWindState.is2D,
				considerElevation: Config.cfg.worldWindState.considerElevation
			}
		}

		// set toptoolbar and widgets state
		if (Config.cfg.widgets){
			options.widgets = Config.cfg.widgets;
		}
		// redux components
		if (Config.cfg.components){
			options.components = Config.cfg.components;
		}
		// redux scenarios
		if (Config.cfg.scenarios){
			options.scenarios = Config.cfg.scenarios;
		}
		// maps metadata
		if (Config.cfg.mapsMetadata){
			options.mapsMetadata = Config.cfg.mapsMetadata;
		}
		// map defaults
		if (Config.cfg.mapDefaults){
			options.mapDefaults = Config.cfg.mapDefaults;
		}
		// active aoi
		if (Config.cfg.activeAoi){
			options.activeAoi = Config.cfg.activeAoi;
		}
		// active aoi
		if (Config.cfg.selectedMapId){
			options.selectedMapId = Config.cfg.selectedMapId;
		}

		if (Config.cfg.dataset){
			options.scope = Config.cfg.dataset;
		}
		if (Config.cfg.locations){
			options.locations = Config.cfg.locations;
		}
		if (Config.cfg.selMap){
			options.selMap = Config.cfg.selMap;
		}
		if (Config.cfg.activeChoroplethKeys){
			options.activeChoroplethKeys = Config.cfg.activeChoroplethKeys;
		}


		window.Stores.notify('fo#adjustConfigurationFromDataview', options);

		// show right panel
		if (Config.cfg.sidebarReportsOpen){
			$('#sidebar-reports').show();
		}

		Observer.notify('scopeChange');
		Observer.notify("resizeMap");
    },

	gatherViewConfig: function (options) {
		var cfg = {};
		cfg.multipleMaps = Ext.ComponentQuery.query('maptools #multiplemapsbtn')[0].pressed === true;
		cfg.years = Ext.ComponentQuery.query('#selyear')[0].getValue();
		cfg.dataset = Ext.ComponentQuery.query('#seldataset')[0].getValue();
		cfg.theme = Ext.ComponentQuery.query('#seltheme')[0].getValue();
		cfg.visualization = Ext.ComponentQuery.query('#selvisualization')[0].getValue();
		cfg.location = Ext.ComponentQuery.query('#sellocation')[0].getValue();
		cfg.expanded = this.getController('Area').getExpandedAndFids().expanded;
		cfg.selMap = {};
		var selMap = this.getController('Select').selMap;

		// fix for areas selected from areas filter
		for (var key in selMap){
			cfg.selMap[key] = selMap[key].map(function(area){
				return {
					at: area.at,
					gid: area.gid.toString(),
					loc: area.loc
				}
			});
		}

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
		// cfg.trafficLayer = Ext.StoreMgr.lookup('layers').getRootNode().findChild('type', 'livegroup').childNodes[0].get('checked');
		var store = Ext.StoreMgr.lookup('paging');
		cfg.page = store.currentPage;

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

		if (cfg.choroplethCfg){
			cfg.choroplethCfg.forEach(function(choropleth){
				if (choropleth.control){
					delete choropleth.control;
				}
			});
		}

		cfg.is3D = $('body').hasClass('mode-3d');

		if (options){
			// dataview metadata
			cfg.name = options.name;
			cfg.description = options.description;
			cfg.language = options.language.value || "en";

			// world wind map settings
			if (options.state && options.state.worldWindNavigator){
				cfg.worldWindState = {
					is2D: !options.state.isMap3D,
					range: options.state.worldWindNavigator.range,
					location: options.state.worldWindNavigator.lookAtLocation
				};
			}
			// widgets state
			if (options.state && options.state.widgets){
				cfg.widgets = options.state.widgets;
			}
			// components
			if (options.state && options.state.components){
				cfg.components = options.state.components;
			}
			// maps metadata
			if (options.state && options.state.mapsMetadata){
				cfg.mapsMetadata = options.state.mapsMetadata;
			}
			// maps defaults
			if (options.state && options.state.mapDefaults){
				cfg.mapDefaults = options.state.mapDefaults;
			}
			// scenarios
			if (options.state && options.state.scenarios){
				cfg.scenarios = options.state.scenarios;
			}
			// active aoi
			if (options.state && options.state.activeAoi){
				cfg.activeAoi = options.state.activeAoi;
			}
			// active location
			if (options.state && options.state.locations){
				cfg.locations = options.state.locations;
			}
			// selected map
			if (options.state && options.state.selectedMapId){
				cfg.selectedMapId = options.state.selectedMapId;
			}
			// active choropleths
			if (options.state.activeChoroplethKeys){
				cfg.activeChoroplethKeys = options.state.activeChoroplethKeys;
			}

			// sidebar reports settings
			cfg.sidebarReportsOpen = !$('#sidebar-reports').hasClass('hidden');
		}

		return {
			conf: cfg
		}
	},
    
    
    onVisSave: function() {
        var theme = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var cfgs = this.getController('Chart').gatherCfg();
        var layerCfgs = this.getController('AttributeConfig').layerConfig;
        if (layerCfgs){
			layerCfgs.forEach(function(layer){
				delete layer.control;
			});
		}

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
            title: polyglot.t('saveVisualization'),
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
            title: polyglot.t('saveDataView'),
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
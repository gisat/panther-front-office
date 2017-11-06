Ext.define('PumaMain.controller.LocationTheme', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: [],
    init: function() {

		Observer.addListener("PumaMain.controller.LocationTheme.reloadWmsLayers",this.reloadWmsLayers.bind(this));
		Stores.addListener(this.areaTemplateChange.bind(this));
		Stores.addListener(this.triggerConfirm.bind(this));

        this.control({
            '#initialdataset':{
                change: this.onDatasetChange
            },
            '#initiallocation':{
                change: this.onLocationChange
            },
            '#initialtheme':{
                change: this.onThemeChange
            },
            '#seldataset':{
                change: this.onDatasetChange
            },
            '#sellocation':{
                change: this.onLocationChange
            },
            '#seltheme': {
                change: this.onThemeChange
            },
            '#selyear': {
                change: this.onYearChange
            },
            '#selvisualization': {
                change: this.onVisChange
            },
            '#initialconfirm': {
                click: this.onConfirm
            },
            '#acceptAgreement': {
                click: this.onAcceptAgreement
            },
            '#cancelAgreement': {
                click: this.onCancelAgreement
            }
        })

        Observer.notify('LocationTheme#init');
    },
    triggerConfirm: function(action){
        if (action === "confirmInitialSelection"){
            this.onConfirm();
        }
    },
    onAcceptAgreement: function() {
        var checked = Ext.ComponentQuery.query('#agreementCheck')[0].getValue();
        if (!checked) {
            this.onCancelAgreement();
            return;
        }
        this.agreementAccepted = true;
        Ext.get('content-intro-terms').hide();

    },
    onCancelAgreement: function() {
        window.location = '/';
    },
    onDatasetChange: function(cnt,val) {
        ThemeYearConfParams.actions.push(cnt.itemId);
        // new URBIS change
        if (!$('body').hasClass("intro")){
            $("#loading-screen").css({
                display: "block",
                background: "radial-gradient(rgba(255, 255, 255, .75), rgba(230, 230, 230, .75))"
            })
        }
        ThemeYearConfParams.datasetChanged = true;
        if (cnt.eventsSuspended) {
            return;
        }
        this.getController('Select').selMap = {'ff4c39':[]};
        this.datasetChanged = true;
        var locationCombo = Ext.ComponentQuery.query(cnt.initial ? '#initiallocation':'#sellocation')[0];
        var locationComboAlt = Ext.ComponentQuery.query(!cnt.initial ? '#initiallocation':'#sellocation')[0] || locationCombo;
        var themeCombo = Ext.ComponentQuery.query(cnt.initial ? '#initialtheme':'#seltheme')[0];
        var themeComboAlt = Ext.ComponentQuery.query(!cnt.initial ? '#initialtheme':'#seltheme')[0] || themeCombo;
        var layersCtrl = this.getController('Layers');
        // to be set on dataset level
        if (val==4054) {
            layersCtrl.scaleBorder = layersCtrl.scaleBorderCnst;
        }
        else {
            layersCtrl.scaleBorder = 1000000000;
        }

        locationCombo.suspendEvents();
        locationComboAlt.suspendEvents();
        themeComboAlt.suspendEvents();
        themeCombo.resumeEvents();

        var locStore = Ext.StoreMgr.lookup('location4init');
        locStore.clearFilter(true);
        var locCount = locStore.query('dataset',val).getCount();

        var locationsData = locStore.query('dataset',val);
        ThemeYearConfParams.allPlaces = [];
        locationsData.items.forEach(function(item){
            ThemeYearConfParams.allPlaces.push(item.raw.id);
        });

        var stores = ['layergroup', 'attributeset', 'attribute', 'visualization', 'year', 'areatemplate', 'symbology', 'dataview'];
        stores.forEach(function(store){
            var extStore = Ext.StoreMgr.lookup(store);
            extStore.proxy.extraParams = { scope: val };
            extStore.load();
        });

        locStore.filter([
            function(rec) {
                if (locCount == 1){
                    return rec.get('dataset')==val || (!rec.get('dataset') && locCount>1);
                } else {
                    return rec.get('id') == 'custom' || rec.get('dataset')==val || (!rec.get('dataset') && locCount>1);
                }
            }
        ]);
        if (locCount == 1){
            this._hasOnlyOnePlace = true;
        }


        locationCombo.show();
        var first = locStore.findRecord('id','2450_1') || locStore.getAt(0);
        if (first && !cnt.initial) {
            locationCombo.setValue(first);

        }
        var themeStore = Ext.StoreMgr.lookup('theme4sel');
        themeStore.clearFilter(true);
        themeStore.filter([

            function(rec) {
                return rec.get('dataset')==val;
            }
        ]);
        themeCombo.eventsSuspended = 0;
        var first = themeStore.getAt(0);
        if (first && !cnt.initial) {
            themeCombo.setValue(first)
        }
        if (cnt.initial) {
            locationCombo.emptyText = 'Select place...';
            locationCombo.setValue(null);
            if (themeCombo && themeCombo.isVisible()) {
                themeCombo.emptyText = 'Select theme...';
                themeCombo.setValue(null);
            }
        }
        else {
            this.getController('Filter').clearFilters();

        }

        locationCombo.resumeEvents();
        locationComboAlt.resumeEvents();
        themeComboAlt.resumeEvents();

        Observer.notify('scopeChange');
    },

    onLocationChange: function(cnt,val) {
        ThemeYearConfParams.actions.push(cnt.itemId);
        // URBIS change
        if ((!val) && !cnt.initial && this.locationInitialized) {
            this.forceInit = true;
            this.updateLayerContext();
            this.forceInit = false;
        }
        //if ((val=='custom' || val=='Custom' || !val) && !cnt.initial && this.locationInitialized) {
        //    this.forceInit = true;
        //    this.updateLayerContext();
        //    this.forceInit = false;
        //}
        if (!cnt.initial) {
            this.locationInitialized = true;
        }

        // URBIS Change
        if (cnt.initial || !val) {

            return;
        }

        ////cnt.eventsSuspended ||
        //if (cnt.initial || val=='custom' || val=='Custom' || !val) {
        //    return;
        //}

        var locObj = this.getController('Area').getLocationObj();
        if (this.datasetChanged) {

            this.locationChanged = true;
            this.onYearChange(cnt);
            return;
        }
        var areaRoot = Ext.StoreMgr.lookup('area').getRootNode();

        var nodesToCollapse = [];
        var nodeToExpand = null;
        for (var i=0;i<areaRoot.childNodes.length;i++) {
            var node = areaRoot.childNodes[i];
            if (node.get('loc') == locObj.location && (node.get('definedplace') || node.get('gid')==locObj.locGid)) {
                nodeToExpand = node;
            }
            else {
                nodesToCollapse.push(node);
            }
        }
        for (var i=0;i<nodesToCollapse.length;i++) {
            var node = nodesToCollapse[i];
            if (nodeToExpand || i!=nodesToCollapse.length-1) {
                node.suppress = true;
            }
            node.collapse();
            node.suppress = false;
        }
        if (nodeToExpand) {
            var loaded = nodeToExpand.get('loaded') || nodeToExpand.isLeaf();
            if (!loaded) {
                this.locationChanged = true;
            }
            nodeToExpand.expand();

            if (loaded) {
                this.getController('Area').scanTree();
                if (nodesToCollapse.length) {
                    var selController = this.getController('Select');
                    this.getController('Area').colourTree(selController.colorMap);
                    this.getController('Layers').colourMap(selController.colorMap);
                }
                this.getController('Chart').reconfigureAll();
                this.getController('Layers').reconfigureAll();
                this.getController('Area').zoomToLocation();
            }
        }
        else {
            this.getController('Area').scanTree();
            if (nodesToCollapse.length) {
                var selController = this.getController('Select');
                this.getController('Area').colourTree(selController.colorMap);
                this.getController('Layers').colourMap(selController.colorMap);
                this.getController('Chart').reconfigureAll();
                this.getController('Layers').reconfigureAll();
            }
            this.getController('Area').zoomToLocation();
        }
        this.forceInit = true;
        this.updateLayerContext();
        this.forceInit = false;

		this.reloadWmsLayers();
        // new URBIS change
        this.newOnChange({
            placeChanged: true
        });

        this.checkAttrSets(this.attributeSets, this.theme);
    },

    onConfirm: function() {
        if (Config.toggles.useWBAgreement && !this.agreementAccepted){
            console.info("Access not allowed. You have to agree with Agreement.");
            return;
        }
        var val = Ext.ComponentQuery.query('#initialtheme')[0].getValue();
        this.onThemeChange({switching:true},val);
    },

    onThemeChange: function(cnt,val) {
        ThemeYearConfParams.actions.push(cnt.itemId);
        if (cnt.eventsSuspended || cnt.initial || !val) {
            return;
        }
        this.themeChanged = true;
        var themeCombo = null;
        if (cnt.switching) {
            this.getController('Area').showLoading("block");
            this.getController('DomManipulation').renderApp();
            this.getController('Render').renderApp();
            themeCombo = Ext.ComponentQuery.query('#seltheme')[0];
            var datasetVal = Ext.ComponentQuery.query('#initialdataset')[0].getValue();
            var datasetCombo = Ext.ComponentQuery.query('#seldataset')[0];
            var locationVal = Ext.ComponentQuery.query('#initiallocation')[0].getValue();
            var locationCombo = Ext.ComponentQuery.query('#sellocation')[0];
            datasetCombo.suspendEvents();
            locationCombo.suspendEvents();
            themeCombo.suspendEvents();

            datasetCombo.setValue(datasetVal);
            locationCombo.setValue(locationVal);
            themeCombo.setValue(val);

            datasetCombo.resumeEvents();
            locationCombo.resumeEvents();
            themeCombo.resumeEvents();
            this.getController('Map').map1.controls[0].activate();


        }
        themeCombo = themeCombo || Ext.ComponentQuery.query('#seltheme')[0];
        var yearCnt = Ext.ComponentQuery.query('#selyear')[0];
        var visCnt = Ext.ComponentQuery.query('#selvisualization')[0];
        yearCnt.suspendEvents();
        visCnt.suspendEvents();

        var visStore = Ext.StoreMgr.lookup('visualization4sel');
        var yearStore = Ext.StoreMgr.lookup('year4sel');

        var themeStore = Ext.StoreMgr.lookup('theme');
        var themeYears = themeStore.getById(val).get('years');

        yearStore.clearFilter(true);
        yearStore.filter([function(rec) {
            return Ext.Array.contains(themeYears,rec.get('_id'))
        }])

        visStore.clearFilter(true);
        visStore.filter([function(rec) {
            return rec.get('theme')==val
        }]);

        // add all years to ThemeYearConfParams
		ThemeYearConfParams.allYears = [];
		var yearStoreContent = yearStore.getRange();
        for(var yearIndex in yearStoreContent){
            if(!yearStoreContent.hasOwnProperty(yearIndex)) continue;
			ThemeYearConfParams.allYears.push(yearStoreContent[yearIndex].get('_id'));
        }

        var vis = visCnt.getValue();
        var first = visStore.getAt(0);
        if (first && first.get('_id')!=vis) {
                visCnt.setValue(first.get('_id'));
                this.visChanged = true;
        }
        var years = yearCnt.getValue();
        if (!years.length && !Config.toggles.hideSelectorToolbar) {
            this.yearChanged = true;
            var yearCount = yearStore.getCount();
            yearCnt.setValue([yearStore.getAt(yearCount-1).get('_id')])
        }
        yearCnt.resumeEvents();
        visCnt.resumeEvents();
        this.onYearChange(themeCombo);

        // new URBIS change
        this.newOnChange({
            themeChanged: true
        });

		this.checkAttrSets(this.attributeSets, Ext.StoreMgr.lookup('theme').getById(val));
    },

    onYearChange: function(cnt) {
		ThemeYearConfParams.actions.push(cnt.itemId);
        var val = Ext.ComponentQuery.query('#selyear')[0].getValue();
        if (!val.length || cnt.eventsSuspended) {
            //this.getController('Area').showLoading("none");
            return;
        }
		if (cnt.itemId=='selyear' ) {
            this.yearChanged = true;
        }
        var isFilter = cnt.itemId == 'filter' || cnt.itemId == 'selectfilter';
        var detailLevelChanged = cnt.itemId == 'detaillevel';

        var theme = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var dataset = Ext.ComponentQuery.query('#seldataset')[0].getValue();
        var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        var vis = Ext.ComponentQuery.query('#selvisualization')[0].getValue();
        var params = {
						theme: theme,
						years: JSON.stringify(years),
						dataset: dataset
        };
        var areaController = this.getController('Area');

		var locationObj = areaController.getLocationObj();
        var cntId = cnt.itemId;

        var root = Ext.StoreMgr.lookup('area').getRootNode();

        params['refreshLayers'] = (this.themeChanged) ? true : null;
        params['refreshAreas'] = (this.yearChanged || this.datasetChanged || this.locationChanged || detailLevelChanged || isFilter) ? true : false;

        if (params['refreshLayers']) {
            params['queryTopics'] = this.getQueryTopics(theme);
        }
        var locationId = locationObj.location;
        if (this.datasetChanged && locationId && !this._hasOnlyOnePlace) {
            var expanded = {};
            var areaTemplateId = locationObj.at;
            var locGid = locationObj.locGid;
            expanded[locationId] = {};
            expanded[locationId][areaTemplateId] = [locGid];
            params['expanded'] = JSON.stringify(expanded);
        }
        if (detailLevelChanged) {
            var parentGids = this.getController('Area').detailLevelParents;
            params['parentgids'] = JSON.stringify(parentGids);
            params['artifexpand'] = true;
        }
        if (Config.cfg) {
            params['expanded'] = JSON.stringify(Config.cfg.expanded);
        }
        if (cntId=='selyear' && root.hasChildNodes() || isFilter) {
            var expandedAndFids = this.getController('Area').getExpandedAndFids();
            params['expanded'] = JSON.stringify(expandedAndFids.loaded);
            params['fids'] = JSON.stringify(expandedAndFids.fids);
        }
        if (cntId=='slider') {
            params['parentgids'] = JSON.stringify(this.getController('Area').parentGids)
        }
        if (cntId=='selectfilter') {
            delete params['fids'];
        }

        if (!detailLevelChanged && !this.yearChanged) {
            this.reloadWmsLayers();
        }

		var me = this;
        Ext.Ajax.request({
            url: Config.url+'api/theme/getThemeYearConf',
            params: params,
            scope: this,
            originatingCnt: cnt,
            visChanged: this.visChanged,
            themeChanged: this.themeChanged,
            datasetChanged: this.datasetChanged,
            locationChanged: this.locationChanged,
            yearChanged: this.yearChanged,
            success: this.onThemeLocationConfReceived,
            failure: function() {
                me.getController('Area').showLoading("none");
            }
        });

        if (this.visChanged) {
            this.getController('Chart').loadVisualization(vis);
            this.getController('Layers').loadVisualization(vis);
        }
        this.datasetChanged = null;
        this.locationChanged = null;
        this.visChanged = null;
        this.themeChanged = null;
        this.yearChanged = null;

        // new URBIS change
        ThemeYearConfParams.action = cntId;
        this.newOnChange();
    },

    reloadWmsLayers: function() {
		var areaController = this.getController('Area');
		var layersController = this.getController('Layers');

		var dataset = Ext.ComponentQuery.query('#seldataset')[0] && Ext.ComponentQuery.query('#seldataset')[0].getValue();
		var years = Ext.ComponentQuery.query('#selyear')[0] && Ext.ComponentQuery.query('#selyear')[0].getValue();
		var location = areaController.getLocationObj() && areaController.getLocationObj().location;

		var selectedLayers = Config.cfg && Config.cfg.layers || [];
		selectedLayers = selectedLayers
            .filter(function(layer){return layer.type == "wmsLayer"})
            .map(function(layer){
		        return layer.name;
        });
		var selectedNodes = [];

		var self = this;
		$.get(Config.url+'rest/wms/layer', {
			scope: dataset,
			place: location,
			periods: years
		}, function(data){
		    // TODO: Remove the test data
			var customWms = Ext.StoreMgr.lookup('layers').getRootNode().findChild('type', 'customwms');
			var previousNodes = customWms.childNodes;

			previousNodes.forEach(function(node){
				var mapController = self.getController('Map');
				mapController.map1.removeLayer(node.get('layer1'));
				mapController.map2.removeLayer(node.get('layer2'));
            });
			Ext.StoreMgr.lookup('selectedlayers').remove(previousNodes);
			customWms.removeAll();

			if(data.data && data.data.length) {
				var nodes = data.data.map(function(layer, index) {
				    var layerAddOptions = {};
				    var coreOptions = {};
				    try{
				        layerAddOptions = JSON.parse(layer.custom) || {};
				        coreOptions = JSON.parse(layer.custom) || {};
                    } catch(e) {
				        console.error("LocationTheme#reloadWmsLayer Incorrect custom ", layer.custom);
                    }
				    layerAddOptions.visibility = false;
				    layerAddOptions.isBaseLayer = false;
				    if(layerAddOptions.srs) {
                        layerAddOptions.projection = new OpenLayers.Projection(layerAddOptions.srs);
                        coreOptions.srs = layerAddOptions.srs;
                    } else if(layerAddOptions.crs) {
                        layerAddOptions.projection = new OpenLayers.Projection(layerAddOptions.crs);
                        coreOptions.srs = layerAddOptions.crs;
                    }else {
                        layerAddOptions.projection = new OpenLayers.Projection("EPSG:3857");
                        coreOptions.srs = "EPSG:3857";
                    }

				    coreOptions.layers = layer.layer;
				    coreOptions.transparent = true;
				    var layer1 = new OpenLayers.Layer.WMS(layer.name,
						layer.url,
						coreOptions,
                        layerAddOptions);
				    var layer2 = new OpenLayers.Layer.WMS(layer.name,
						layer.url,
						coreOptions,
                        layerAddOptions);
				    var node = Ext.create('Puma.model.MapLayer', {
						name: layer.name,
                        id: layer.id,
						initialized: true,
						allowDrag: true,
						checked: false,
						leaf: true,
						sortIndex: index,
						type: 'wmsLayer',
						layer1: layer1, // Layer which is shown when only one map is visible
						layer2: layer2, // Layer to be shown when both maps are visible
					});
				    layer1.nodeRec = node;
				    layer1.initialized = true;
				    layer2.nodeRec = node;
				    layer2.initialized = true;

					var mapController = self.getController('Map');
					mapController.map1.addLayers([layer1]);
					mapController.map2.addLayers([layer2]);

					if(selectedLayers.indexOf(layer.name) != -1) {
						selectedNodes.push(node);
					}

					return node;
				});
				Ext.StoreMgr.lookup('selectedlayers').loadData(nodes,true);
				customWms.appendChild(nodes);

				selectedNodes.forEach(function(node){
					node.set('checked', true);
					layersController.onCheckChange(node, true);
                });
			}
		});
    },

    // new URBIS change
    newOnChange: function(params){
        if (!ThemeYearConfParams.datasetChanged){
            if (params && params.hasOwnProperty("placeChanged")){
                ThemeYearConfParams.placeChanged = params.placeChanged;
            }
            else {
                ThemeYearConfParams.placeChanged = false;
            }

            // detect if theme has been changed
            if (params && params.hasOwnProperty("themeChanged")){
                ThemeYearConfParams.themeChanged = params.themeChanged;
                Observer.notify("rebuild");
            }
            else {
                ThemeYearConfParams.themeChanged = false;
            }

            // detect if year has been changed
            var currentYears = Ext.ComponentQuery.query('#selyear')[0].getValue();
            var cYears = "[" + currentYears.toString() + "]";
            if (ThemeYearConfParams.years != cYears){
                Observer.notify("rebuild");
            }
        }

        // current dataset
        var dataset = Ext.ComponentQuery.query('#seldataset')[0].getValue();
        ThemeYearConfParams.dataset = dataset.toString();

        // current place
        var locObj = this.getController('Area').getLocationObj();
        if (locObj.location){
            ThemeYearConfParams.place = locObj.location.toString();
        }
        else {
            ThemeYearConfParams.place = "";
        }
        //current theme
        var theme = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        ThemeYearConfParams.theme = theme.toString();

        // current years
        var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        ThemeYearConfParams.years = "[" + years.toString() + "]";

        // current visualization
        var visualization = Ext.ComponentQuery.query('#selvisualization')[0].getValue();
        if (visualization){
            ThemeYearConfParams.visualization = visualization.toString();
        } else {
            ThemeYearConfParams.visualization = "";
        }

    },
    onVisChange: function(cnt) {
        ThemeYearConfParams.actions.push(cnt.itemId);
        if (cnt.eventsSuspended) {
            return;
        }
        var val = Ext.ComponentQuery.query('#selvisualization')[0].getValue();
        this.getController('Chart').loadVisualization(val);
        this.getController('Layers').loadVisualization(val);
        this.getController('Chart').reconfigureAll();
        //this.getController('Layers').reconfigureAll();
        this.getController('Layers').checkVisibilityAndStyles();

        ThemeYearConfParams.visualization = val.toString();
        Observer.notify("rebuild");
    },

    refreshVisualization: function() {
        this.onVisChange({});
    },
    refreshTheme: function() {
        var val = Ext.ComponentQuery.query('#seltheme')[0].getValue()
        this.onThemeChange({},val);
    },

    onFilter: function() {
        var filterCmp = null;
        this.onYearChange(filterCmp)
    },

    getQueryTopics: function(theme) {
        var layerRoot = Ext.StoreMgr.lookup('layers').getRootNode();
        var children = layerRoot.childNodes;
        var presentTopics = [];
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            var topic = node.get('topic');
            if (topic) {
                presentTopics.push(topic);
            }
        }
        var themeTopics = Ext.StoreMgr.lookup('theme').getById(theme).get('topics');
        var queryTopics = Ext.Array.difference(themeTopics, presentTopics);
        if (themeTopics.length != queryTopics.length) {
            return queryTopics;

        }
    },



    addAreas: function(areasToAdd) {
        var areaRoot = Ext.StoreMgr.lookup('area').getRootNode();
        areaRoot.removeAll();
        var data = [];
        var currentLevel = [];
        var parentLevel = null;
        var level = null;
        var leafMap = {};
        for (var i=0;i<areasToAdd.length;i++) {
            var area = areasToAdd[i];
            level = level || area.at;
            //area.children = [];
            if (area.at!=level) {
                level = area.at;
                parentLevel = currentLevel;
                currentLevel = [];
            }
            if (!area.leaf) {
                area.expandable = true;
                area.children = [];
            }
            else {
                leafMap[area.loc] = leafMap[area.loc] || {};
                leafMap[area.loc][area.at] = leafMap[area.loc][area.at] || [];
                leafMap[area.loc][area.at].push(area.gid)
            }
            area.id = area.at+'_'+area.gid;
            var node = Ext.create('Puma.model.Area',area);
            if (!area.parentgid) {
                data.push(node);
            }
            else {
                for (var j=0;j<parentLevel.length;j++) {
                    if (parentLevel[j].get('gid') == area.parentgid) {
                        parentLevel[j].set('expanded',true);
                        parentLevel[j].appendChild(node)
                    }
                }
            }
            currentLevel.push(node);
        }
        areaRoot.removeAll();
        //areaRoot.appendChild(data);
        areaRoot.suspendEvents();
        if (!OneLevelAreas.hasOneLevel){
            areaRoot.appendChild(data);
        }
        areaRoot.resumeEvents();
    },

    refreshAreas: function(add,remove) {
        var root = Ext.StoreMgr.lookup('area').getRootNode();
        var changed = false;
        var nodesToDestroy = [];

        var tree = Ext.ComponentQuery.query('#areatree')[0];

        tree.suspendEvents();

        tree.view.dontRefreshSize = true;
        for (var loc in remove) {
            var locRoot = root.findChild('loc',loc);
            for (var at in remove[loc]) {
                locRoot.cascadeBy(function(node) {
                   if (node.get('at')!=at) return;
                   if (Ext.Array.contains(remove[loc][at],node.get('gid'))) {
                       nodesToDestroy.push(node);
                       changed = true;
                   }
                });
            }
        }
        for (var i=0;i<nodesToDestroy.length;i++) {
            var node = nodesToDestroy[i]
            node.set('id',node.get('at')+'_'+node.get('gid'));
            Ext.suspendLayouts();
            node.parentNode.removeChild(node,false);
            Ext.resumeLayouts(true);
        }
        var datasetId = Ext.ComponentQuery.query('#seldataset')[0].getValue();
        var featureLayers = Ext.StoreMgr.lookup('dataset').getById(datasetId).get('featureLayers');

        var currentId = null;
        var previousNode = null;
        var areasToAppend = [];

        for (var i = 0;i<add.length;i++) {
            var area = add[i];
            var loc = area.loc;
            var at = area.at;
            var atIndex = Ext.Array.indexOf(featureLayers,at);
            var prevAtIndex = atIndex>0 ? atIndex-1 : null;
            var prevAt = featureLayers[prevAtIndex];
            var parentgid = area.parentgid;
            var foundNode = null;
            root.cascadeBy(function(node) {
                if (!parentgid && node==root) {
                    foundNode = node;
                    return false;
                }
                if (node==root) return;
                if (node.get('loc')==loc && node.get('at')==prevAt && node.get('gid')==parentgid) {
                    foundNode = node;
                    return false;
                }
            });
            if (foundNode) {
                changed = true;
                area.id = area.at+'_'+area.gid;
                //foundNode.suspendEvents();
                // foundNode.appendChild(area);
                //foundNode.resumeEvents();

                areasToAppend.push(area);
                if (foundNode.internalId != currentId && i!=0){
                    previousNode.appendChild(areasToAppend);
                    areasToAppend = [];
                } else if (i ==  (add.length-1)){
                    foundNode.appendChild(areasToAppend);
                    areasToAppend = [];
                }
                currentId = foundNode.internalId;
                previousNode = foundNode;
            }
        }

        tree.resumeEvents();

        tree.view.dontRefreshSize = false;
        if (changed) {
            //Ext.StoreMgr.lookup('area').sort();
            tree.view.refresh();
        }
        return changed;
    },


    updateLayerContext: function() {
         var cfg = this.layerRefMap;
         var mapController = this.getController('Map');
         var years = Ext.ComponentQuery.query('#selyear')[0].getValue()
         var map1Year = mapController.map1.year;
         var map2Year = mapController.map2.year;
         mapController.map1.year = years.length>1 ? years[years.length-2] : years[years.length-1];
         mapController.map2.year = years.length>1 ? years[years.length-1] : null;
         var map1Change = map1Year != mapController.map1.year ? true : false;
         var map2Change = (map2Year != mapController.map2.year && mapController.map2.year) ? true : false

         var yearStore = Ext.StoreMgr.lookup('year');
         Ext.get('app-map-map-label').setHTML(yearStore.getById(mapController.map1.year).get('name'));
         Ext.get('app-map-map2-label').setHTML(mapController.map2.year ? yearStore.getById(mapController.map2.year).get('name') : '');
         var me = this;
         if (map1Change || map2Change) {
             var colorMap = this.getController('Select').colorMap
             this.getController('Layers').colourMap(colorMap,!map1Change,!map2Change);
         }
         Ext.StoreMgr.lookup('layers').getRootNode().cascadeBy(function(node) {
            if (node.get('type')!='topiclayer') {
                return;
            }
            var layer1 = node.get('layer1');
            var layer2 = node.get('layer2');
            if (!layer1.initialized || map1Change || me.forceInit) {
                me.initializeLayer(node,layer1,mapController.map1.year,cfg)
            }
            if ((!layer2.initialized || map2Change || me.forceInit)&&years.length>1) {
                me.initializeLayer(node,layer2,mapController.map2.year,cfg)
            }
        })
    },
    initializeLayer: function(node,layer,year,cfg) {
        var at = node.get('at');
        var symbologyId = node.get('symbologyId');
        symbologyId = symbologyId=='#blank#' ? '' : symbologyId;
        var atCfg = cfg[at];
        var layers = [];
        var symbologies = [];
        var selectedLoc = this.getController('Area').getLocationObj().location;
        if (selectedLoc) {
            atCfg = {};
            atCfg[selectedLoc] = cfg[at][selectedLoc];
        }
        for (var loc in atCfg) {
            if (!atCfg[loc]) {
                return;
            }
            var locCfg = atCfg[loc][year] || [];

            for (var i=0;i<locCfg.length;i++) {
                layers.push(locCfg[i].layer);
                symbologies.push(symbologyId || '');
            }

        }
        layer.initialized = true;
        layers.sort();
        layer.mergeNewParams({
            layers: layers.join(','),
            styles: symbologies.join(',')
        })
        var src = this.getController('Layers').getLegendUrl(layers[0],null,symbologyId);
        node.set('src',src)
        if (node.get('checked')) {
            layer.setVisibility(true);
        }
    },



    removeLayers: function() {
        var themeId = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var topics = Ext.StoreMgr.lookup('theme').getById(themeId).get('topics');
        var root = Ext.StoreMgr.lookup('layers').getRootNode();
        var mapController = this.getController('Map');
        var nodesToDestroy = [];
        var thematicNodes = [];
        root.eachChild(function(node) {
            if (node.get('type')=='thematicgroup') {
                thematicNodes.push(node);
            }
        },this);
        for (var i = 0; i < thematicNodes.length; i++) {
            var thematicNode = thematicNodes[i];
            for (var j = 0; j < thematicNode.childNodes.length; j++) {
                var node = thematicNode.childNodes[j];
                var topic = node.get('topic');
                if (topic && !Ext.Array.contains(topics, parseInt(topic))) {
                    node.get('layer1').setVisibility(false);
                    node.get('layer2').setVisibility(false);
                    mapController.map1.removeLayer(node.get('layer1'))
                    mapController.map2.removeLayer(node.get('layer2'))
                    nodesToDestroy.push(node);
                }
            }
        }

        for (var i=0;i<nodesToDestroy.length;i++) {
            nodesToDestroy[i].destroy();
        }

        // deleting empty groups
        var groupsToDestroy = [];
        for (var i = 0; i < thematicNodes.length; i++) {
            if (!thematicNodes[i].childNodes.length) {
                groupsToDestroy.push(thematicNodes[i])
            }
        }
        for (var i=0;i<groupsToDestroy.length;i++) {
            groupsToDestroy[i].destroy();
        }
    },


    appendLayers: function(layerNodes) {
        layerNodes = layerNodes || [];
        var themeId = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var topics = Ext.StoreMgr.lookup('theme').getById(themeId).get('topics');
        var nodesToAdd = [];
        for (var i = 0; i < layerNodes.length; i++) {
            var topic = layerNodes[i].topic;
            if (Ext.Array.contains(this.topics || [], topic)) {
                continue;
            }
            nodesToAdd.push(layerNodes[i])
        }
        this.topics = topics;

        var root = Ext.StoreMgr.lookup('layers').getRootNode();
        var childNodes = root.childNodes;
        var areaLayerNode = null;
        var selectedLayerNode = null;
        var systemNode = null;
        var thematicNode = null;
        var layerGroupsToAdd = [];
        var layerGroupsMap = [];
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            var type = node.get('type');

            if (type == 'systemgroup') {
                systemNode = node;
            }
//                if (type=='thematicgroup') {
//                    thematicNode = node;
//                }
        }
        var layerGroupStore = Ext.StoreMgr.lookup('layergroup');
        for (var i = 0; i < nodesToAdd.length; i++) {
            var nodeToAdd = nodesToAdd[i];
            var layerGroupId = nodeToAdd.layerGroup;
            if (!layerGroupId) continue;
            var layerGroupNode = root.findChild('layerGroup', layerGroupId);
            if (!layerGroupNode) {
                var count = root.childNodes.length;
                var layerGroupRec = layerGroupStore.getById(layerGroupId);

                var priorities = Ext.Array.map(root.childNodes,function(chNode) {
                    return chNode.get('priority')
                })
                priorities = Ext.Array.clean(priorities);
                var priority = layerGroupRec.get('priority')
                priorities.push(priority);
                // from highest priority to lowest
                priorities.sort();//.reverse();
                var idx = Ext.Array.indexOf(priorities,priority);

                layerGroupNode = root.insertChild(2+idx,{
                    name: layerGroupRec.get('name'),
                    layerGroup: layerGroupId,
                    type: 'thematicgroup',
                    priority: layerGroupRec.get('priority'),
                    expanded: true,
                    checked: null
                })
            }
            layerGroupNode.appendChild(nodeToAdd)
        }


        if (!systemNode.childNodes.length) {
            selectedLayerNode = {
                type: 'selectedareas',
                name: 'Selected areas',
                sortIndex: 0,
                checked: false,
                leaf: true
            };
            selectedLayerFilledNode = {
                type: 'selectedareasfilled',
                name: 'Selected areas filled',
                sortIndex: 0,
                checked: true,
                leaf: true
            };
            areaLayerNode = {
                type: 'areaoutlines',
                sortIndex: 1,
                name: 'Area outlines',
                checked: true,
                leaf: true
            };
            systemNode.appendChild([selectedLayerNode, selectedLayerFilledNode, areaLayerNode]);
        }



        var layersToAdd = [];

        var layerDefaults = this.getController('Layers').getWmsLayerDefaults();


        var mapController = this.getController('Map');
        for (var i = 0; i < root.childNodes.length; i++) {
            var node = root.childNodes[i];
            if (node.get('type') == 'thematicgroup' || node.get('type') == 'systemgroup') {
                for (var j = 0; j < node.childNodes.length; j++) {
                    var layerNode = node.childNodes[j];
                    if (layerNode.get('layer1'))
                        continue;
                    if (node.get('type') == 'thematicgroup' && !Ext.Array.contains(topics, layerNode.get('topic')))
                        continue;
                    Ext.Array.include(layersToAdd, layerNode);
                    var params = Ext.clone(layerDefaults.params);
                    var layerParams = Ext.clone(layerDefaults.layerParams);
                    if (node.get('type')=='thematicgroup') {
                        params.tiled = true;
                        delete layerParams.singleTile;
                        layerParams.tileSize = new OpenLayers.Size(256,256)
                        layerParams.removeBackBufferDelay = 0;
                        layerParams.transitionEffect = null;
                    }
                    var layer1 = new OpenLayers.Layer.WMS('WMS', Config.url + 'api/proxy/wms', Ext.clone(params), Ext.clone(layerParams));
                    var layer2 = new OpenLayers.Layer.WMS('WMS', Config.url + 'api/proxy/wms', Ext.clone(params), Ext.clone(layerParams));
                    if (node.get('type') == 'thematicgroup') {
                        layer1.events.register('visibilitychanged',{layer:layer1,me:this},function(a,b,c) {
                            this.me.getController('Layers').onLayerLegend(null,this.layer.nodeRec,this.layer.visibility);
                        })
                    }
                    mapController.map1.addLayers([layer1]);
                    mapController.map2.addLayers([layer2]);
                    layerNode.set('layer1', layer1);
                    layerNode.set('layer2', layer2);
                    layer1.nodeRec = layerNode;
                    layer2.nodeRec = layerNode;
                }
            }
        }
        Ext.StoreMgr.lookup('selectedlayers').loadData(layersToAdd, true);
        var layerController = this.getController('Layers');
        layerController.resetIndexes();
        layerController.onLayerDrop();
    },
    updateLeafs: function(leafMap) {
        var root = Ext.StoreMgr.lookup('area').getRootNode();
        root.cascadeBy(function(node) {
            var loc = node.get('loc');
            var at = node.get('at');
            var gid = node.get('gid');
            if (leafMap[loc] && leafMap[loc][at] && leafMap[loc][at][gid]) {
                node.set('leaf', true);
                node.set('expanded', false)
            }
            else if (node.get('leaf')) {
                node.set('leaf', false)
            }
        })

    },
    onThemeLocationConfReceived: function(response) {
        var conf = JSON.parse(response.responseText).data;
        var scope = Ext.StoreMgr.lookup('dataset').getById(Number(response.request.options.params.dataset));

        if (conf.hasOwnProperty("auRefMap")){
            OlMap.auRefMap = conf.auRefMap;
            var counter = 1;
            for (var a in conf.auRefMap){
                var auLevels = Object.keys(conf.auRefMap[a]).length;
                if (auLevels > 1){
                    counter++;
                }
                else {
                    ThemeYearConfParams.auCurrentAt = Object.keys(conf.auRefMap[a])[0];
                }
            }

            OneLevelAreas.hasOneLevel = (counter == 1 && scope.get('oneLevelOnly'));

            if (OneLevelAreas.hasOneLevel){
				// Hide areas fully
				Stores.notify('map#show3D');

                $('.areaTreeSelection').hide();
				$('#top-toolbar-areas').hide();

				// Also hide chart related stuff
				$('#window-areatree').hide();
				if(scope.get("aggregated")) {
                    this.getController('DomManipulation')._onReportsSidebarToggleClick();
                }
                $('#sidebar-reports').hide();

                // Also switch map to 3D mode
                // Remove the possibility to switch back
                $('#top-toolbar-3dmap').hide();
            } else {
                var tools = scope.get('removedTools') || [];
                if(tools.indexOf('2dmap') !== -1) {
                    Stores.notify('map#show3D');
                    $('#top-toolbar-3dmap').hide();
                } else {
                    $('#top-toolbar-3dmap').show();
                }

                if(tools.indexOf('evaluationTool') !== -1) {
                    $('#top-toolbar-selection-filter').hide();
                    $('#top-toolbar-selections').hide();
                }

                if(tools.indexOf('mapTools') !== -1) {
                    $('#top-toolbar-map-tools').hide();
                }

                if(tools.indexOf('savedViews') !== -1) {
                    $('#top-toolbar-saved-views').hide();
                }

                if(tools.indexOf('visualisation') !== -1) {
                    $('.field.visualization').hide();
                }

                if(tools.indexOf('charts') !== -1) {
                    this.getController('DomManipulation')._onReportsSidebarToggleClick();
                } else {
                    $('#sidebar-reports').show();
                }

                if(tools.indexOf('snapshots') !== -1) {
                    $('#top-toolbar-snapshot').hide();
                }

                if(tools.indexOf('context-help') !== -1) {
                    $('#top-toolbar-context-help').hide();
                }

                if(tools.indexOf('scope') !== -1) {
                    $('.field.scope').hide();
                }

                if(tools.indexOf('theme') !== -1) {
                    $('.field.theme').hide();
                }

                if(tools.indexOf('areas') !== -1) {
                    $('.areaTreeSelection').hide();
                    $('#window-areatree').hide();
                    $('#top-toolbar-areas').hide();
                } else {
                    $('.areaTreeSelection').show();
                    $('#window-areatree').show();
                }

                if (!Config.toggles.isSnow) {
                    $('#top-toolbar-areas').show();
                }

                // TODO: To be removed and replaced with toggles.
                if (scope.get("aggregated")) {
                    this.getController('DomManipulation')._onReportsSidebarToggleClick();
                }
			}
        }
        if (response.request.options.originatingCnt.itemId == 'selectfilter') {
            this.getController('Select').selectInternal(conf.areas, false, false, 1);
            return;
        }
        var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
        var multiMapBtn = Ext.ComponentQuery.query('maptools #multiplemapsbtn')[0];
        multiMapBtn.leftYearsUnchanged = true;
        var multiMapPressed = multiMapBtn.pressed;
        multiMapBtn.toggle(years.length > 1);
        // manually fire change handler, because nothing has changed
        if (multiMapPressed == years.length > 1 && multiMapBtn.toBeChanged) {
            this.getController('Map').onMultipleYearsToggle(multiMapBtn, multiMapPressed);
        }
        multiMapBtn.leftYearsUnchanged = false;
        if (!conf.layerRefMap) {
            conf = {
                add: conf
            }
        }
        if (conf.layerRefMap) {
            this.getController('Area').areaTemplateMap = conf.auRefMap;
        }
        if (conf.areas) {
            this.addAreas(conf.areas);
            if (!this.initialAdd) {


                Ext.ComponentQuery.query('#areatree')[0].getView().refresh();

                this.initialAdd = true;
            }
            OneLevelAreas.data = conf.areas;
            OneLevelAreas.map = this.getController('Map').getOlMap();
        }
        if (conf.add || conf.remove) {

            var changed = this.refreshAreas(conf.add,conf.remove);
        }
        if (response.request.options.datasetChanged){
            Ext.StoreMgr.lookup('area').sort()
        }
        if (Config.cfg) {
            Ext.StoreMgr.lookup('paging').currentPage = Config.cfg.page;
            var selController = this.getController('Select');
            selController.selMap = Config.cfg.selMap;
            selController.colorMap = selController.prepareColorMap();
            this.getController('Area').colourTree(selController.colorMap);
        }
        if (true) {
            this.removeLayers();
            this.appendLayers(conf.layerNodes);
            Ext.StoreMgr.lookup('layers4outline').load();
        }
        if (conf.layerRefMap) {
            this.layerRefMap = conf.layerRefMap;
            ThemeYearConfParams.layerRefMap = conf.layerRefMap;
        }
        if (conf.layerRefMap || response.request.options.locationChanged) {
            this.updateLayerContext();
        }
        if (conf.leafMap && conf.add) {
            this.updateLeafs(conf.leafMap)
        }
        if (conf.areas || ((conf.add || conf.remove) && changed)) {
            this.getController('Area').scanTree();
            if (response.request.options.datasetChanged) {
                this.getController('Layers').colourMap();
            }
        }
        else if (response.request.options.yearChanged){
            this.getController('Layers').refreshOutlines();
            this.getController('Filter').reconfigureFiltersCall();
        }
        if (conf.attrSets) {
            this.checkFeatureLayers();
			var themeId = Ext.ComponentQuery.query('#seltheme')[0].getValue();
			var theme = Ext.StoreMgr.lookup('theme').getById(themeId);
			this.checkAttrSets(conf.attrSets, theme);
        }

        this.getController('Chart').reconfigureAll();
        this.getController('Layers').reconfigureAll();
        if (response.request.options.visChanged) {
            this.getController('Layers').checkVisibilityAndStyles();
        }
        if (Config.cfg && Config.cfg.multipleMaps) {
            multiMapBtn.toggle(true);
        }
        if (response.request.options.locationChanged || response.request.options.datasetChanged) {
            this.getController('Area').zoomToLocation();
        }
        this.getController('Map').updateGetFeatureControl();
		console.log('LocationTheme hide');
		if(!Config.dataviewId) {
			this.getController('Area').showLoading("none");
		}

        if (!this.placeInitialChange) {
             var locStore = Ext.StoreMgr.lookup('location4init');
                var customRec = locStore.getById('custom');
                // URBIS Change
                //if (customRec) {
                //    customRec.destroy();
                //}
                //customRec.set('name','Custom');
                //customRec.commit();
                this.placeInitialChange = true;
        }

        delete Config.cfg;

		Stores.notify('extRestructured');
    },
    checkFeatureLayers: function() {
        var themeId = Ext.ComponentQuery.query('#seltheme')[0].getValue();
        var theme = Ext.StoreMgr.lookup('theme').getById(themeId);
        var topics = theme.get('topics');
        var store = Ext.StoreMgr.lookup('layertemplate2choose');
        store.clearFilter(true);
        store.filter([function(rec) {
            return Ext.Array.contains(topics,rec.get('topic'));
        }]);
    },

    areaTemplateChange: function(notification){
        if (notification === "areas#areaTemplateChange"){
            this.checkAttrSets(this.attributeSets, this.theme);
        }
    },

	/**
     * Check, if attribute sets has been changed. It also check, if all attributes in menu contain relevant data and omit those,
     * which doesn'n.
	 * @param attrSets {Array} list of attribute sets for current configuration
	 * @param theme {number} id of theme
	 */
	checkAttrSets: function(attrSets, theme) {
        this.attributeSets = attrSets;
        this.theme = theme;

        if (!this.attributeSets || !this.theme){
            return;
        }

		var topics = theme.get('topics'); // get all topics (id's) of current theme
        var attrSetStore = Ext.StoreMgr.lookup('attributeset');
		var attrStore = Ext.StoreMgr.lookup('attribute');

		this.getAttributesWithData(topics, attrSetStore, attrStore)
            .then(this.rebuildAttributesTree.bind(this, topics, this.theme, attrSetStore, attrStore, this.attributeSets));
    },

	/**
     * Rebuild attribute tree with relevant attributes for current configuration. Do not show attributes without data.
	 * @param topics {Array}
     * @param theme
	 * @param attrSetStore
	 * @param attrStore
	 * @param allAttributes {Array} list of relevant attributes
     * @param attrSets
	 */
	rebuildAttributesTree: function(topics, theme, attrSetStore, attrStore, attrSets, allAttributes){
	    var attributesWithData = null;
	    if (allAttributes){
			attributesWithData = Ext.Array.filter(allAttributes.attributes, function(rec){
				return rec.distribution[0] > 0 || (rec.min === rec.max);
			});
        } else {
	        console.log("LocationTheme#rebuildAttributesTree: No attributes!");
	        return;
        }
		var prefTopics = theme.get('prefTopics'); // get pref. topics of current theme
		var a2chStore = Ext.StoreMgr.lookup('attributes2choose');
		var rootNode = a2chStore.getRootNode();

		// clear the store
		while(rootNode.firstChild){
			rootNode.removeChild(rootNode.firstChild);
		}


		// populate the store
		for(var isPref = 1; isPref >= 0; isPref--){ // iterate two bools: is preferential and isn't
			for(var topic in topics){ // iterate topics (id's) of actual theme
				if( isPref != Ext.Array.contains(prefTopics, topics[topic]) ) continue;
				rootNode.appendChild(Ext.create('Puma.model.MappedChartAttribute',{
					topic: topics[topic],
					leaf: false,
					expanded: isPref,
					checked: null
				}));
				var topicNode = rootNode.lastChild;

				attrSetStore.data.each(function(attrSet){ // iterate attrSets (objects)
					if(attrSet.get('topic') == topics[topic]){
						var attrSetAttributes = attrSet.get('attributes');

						topicNode.appendChild(Ext.create('Puma.model.MappedChartAttribute',{
							as: attrSet.get('_id'),
							topic: topics[topic],
							leaf: false,
							expanded: false,
							checked: false
						}));
						var attrSetNode = topicNode.lastChild;

						attrStore.data.each(function(attribute){ // iterate attributes (objects)
							if( Ext.Array.contains(attrSetAttributes, attribute.get('_id')) && attribute.data.type === "numeric"){
							    var attrs = Ext.Array.filter(attributesWithData, function(rec){
                                    return (rec.attribute === attribute.get('_id') && rec.attributeSet === attrSet.get('_id'));
                                });
                                if (attrs.length > 0){
									attrSetNode.appendChild(Ext.create('Puma.model.MappedChartAttribute',{
										attr: attribute.get('_id'),
										as: attrSet.get('_id'),
										topic: topics[topic],
										leaf: true,
										checked: false
									}));
                                }
							}
						});
						if(!attrSetNode.childNodes.length) attrSetNode.remove();
					}
				});
				if(!topicNode.childNodes.length) topicNode.remove();
			}
		}

		// filter store attributeset2choose
		// povoli ty, jejichz id je v poli attrSets
		var asStoreToFilter = Ext.StoreMgr.lookup('attributeset2choose');
		asStoreToFilter.clearFilter(true);
		asStoreToFilter.filter([function(rec){
			return Ext.Array.contains(attrSets,rec.get('_id'));
		}]);
    },

	/**
     * Go through all attributes for current configuration. Then make statistics request.
	 * @param topics {Object}
	 * @param attrSetStore {Object}
	 * @param attrStore {Object}
     * @returns {Promise}
	 */
	getAttributesWithData: function(topics, attrSetStore, attrStore){
		var attributes = [];
		for(var topic in topics){ // iterate topics (id's) of actual theme
			attrSetStore.data.each(function(attrSet){ // iterate attrSets (objects)
				if(attrSet.get('topic') === topics[topic]){
					var attrSetAttributes = attrSet.get('attributes');
					attrStore.data.each(function(attribute){ // iterate attributes (objects)
						if( Ext.Array.contains(attrSetAttributes, attribute.get('_id')) && attribute.data.type === "numeric"){
							var attr = attribute.data;
							attr.attributeSet = attrSet.internalId;
							attr.attribute = attribute.data._id;
						    attributes.push(attr);
						}
					});
				}
			});
		}

		return this.getAttributesStatistics(attributes);
    },

	/**
     * Get statistics about attributes
	 * @param attributes {Array} list of all attributes
	 * @returns {Promise}
	 */
	getAttributesStatistics: function(attributes){
        var dist = {
            type: 'normal',
            classes: 1
        };

		var params = this.prepareParams();
		return $.post(Config.url + "rest/filter/attribute/statistics", {
			areaTemplate: params.areaTemplate,
			periods: params.periods,
			places: params.locations,
			attributes: attributes,
			distribution: dist
		});
    },

	/**
	 * It prepares basics parameters for request according to current configuration.
	 * @returns {{areaTemplate: string, locations: [], periods: []}}
	 */
	prepareParams: function () {
        var locations;
        if (ThemeYearConfParams.place.length > 0) {
            locations = [Number(ThemeYearConfParams.place)];
        } else {
            locations = ThemeYearConfParams.allPlaces;
        }
        return {
            areaTemplate: ThemeYearConfParams.auCurrentAt,
            locations: locations,
            periods: JSON.parse(ThemeYearConfParams.years)
        }
    },

    checkUserPolygons: function(years,analysis,callback) {
        Ext.Ajax.request({
            url: Config.url+'api/userpolygon/checkAnalysis',
            params: {
                analysis: JSON.stringify(analysis || [955]),
                years: JSON.stringify(years || [277])
            },
            success: callback
        })
    },

    onVisualizationChange: function(btn,value,forceVisReinit) {
        if (!value) return;
        var itemId = btn.ownerCt.itemId;
        var visChanged = false;
        if (forceVisReinit===true || itemId == 'visualizationcontainer') {
            var vis = Ext.ComponentQuery.query('initialbar #visualizationcontainer button[pressed=true]')[0].objId;
            if (vis=='custom') return;
            this.getController('Chart').loadVisualization(vis);
            visChanged = true;
        }

        var preserveVis = false;

        var selController = this.getController('Select')
        if (Config.cfg) {
            selController.selMap = Config.cfg.selMap
            selController.colorMap = selController.prepareColorMap(selController.selMap);
        }
        this.getController('Chart').reconfigureAll();
        if (forceVisReinit===true || itemId == 'visualizationcontainer') {
            this.getController('Layers').checkVisibilityAndStyles(!visChanged,preserveVis);

        }
        if (Config.cfg) {
            this.getController('Area').colourTree(selController.colorMap);
            this.getController('Layers').colourMap(selController.colorMap);
            var map = this.getController('Map').map1;
            if (Config.cfg.multipleMaps) {
                Ext.ComponentQuery.query('initialbar #multiplemapsbtn')[0].toggle();
            }
            map.setCenter([Config.cfg.mapCfg.center.lon,Config.cfg.mapCfg.center.lat],Config.cfg.mapCfg.zoom);

        }
        delete Config.cfg;
    }

});


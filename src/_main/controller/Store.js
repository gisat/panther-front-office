Ext.define('PumaMain.controller.Store', {
	extend: 'Ext.app.Controller',
	views: [],
	requires: [
		'Puma.model.Location',
		'Puma.model.AttributeSet',
		'Puma.model.Attribute',
		'Puma.model.AreaTemplate',
		'Puma.model.Dataset',
		'Puma.model.DataView',
		'Puma.model.Topic',
		'Puma.model.Symbology',
		'Puma.model.LayerRef',
		'Puma.model.LayerServer',
		'Puma.model.Theme',
		'Puma.model.Aggregated',
		'Puma.model.Area',
		'Puma.model.Year',
		'Puma.model.Scope',
		'Puma.model.ColumnMap',
		'Puma.model.Column',
		'Puma.model.MapLayer',
		'Puma.model.LayerGroup',
		'Puma.model.MappedAttribute',
		'Puma.model.Visualization',
		'Puma.model.Screenshot',
		'Puma.model.MappedChartAttribute',
		'Ext.data.Store',
		'Gisatlib.data.SlaveStore',
		'Gisatlib.paging.PhantomStore',
		'Gisatlib.data.AggregatedStore'
	],
	init: function () {
		if (Config.exportPage) {
			return;
		}
		this.initStores();
		this.initSlaveStores();
		this.initLocalStores();
		this.initAggregatedStores();
		this.initEvents();
		this.initLocations();
		this.getController('Dataview').checkLoading();

        Observer.notify('Store#init');
	},

	initLocations: function () {
		var store = Ext.StoreMgr.lookup('location4init');
		store.loading = true;
		Ext.Ajax.request({
			url: Config.url + 'api/theme/getLocationConf',
			scope: this,
			method: 'POST',
			success: function (response) {
				var data = JSON.parse(response.responseText).data;
				store.loadData(data);
				store.loading = false;

                Observer.notify('Area#initLocations Success');
			},
			failure: function (response, opts) {
				console.log('Store.initLocations AJAX request failed. Status: ' + response.status, "Response:", response);
			}
		})
	},

	initAggregatedStores: function () {


	},
	initStores: function () {
		var autoLoad = true;
		if(Config.toggles.isUrbanTep) {
			autoLoad = false;
		}

		Ext.create('Ext.data.Store', {
			storeId: 'location',
			autoLoad: autoLoad,
			model: 'Puma.model.Location'
		});
		Ext.create('Ext.data.Store', {
			storeId: 'theme',
			autoLoad: autoLoad,
			model: 'Puma.model.Theme'
		});
        Ext.create('Ext.data.Store', {
            storeId: 'topic',
            autoLoad: autoLoad,
            model: 'Puma.model.Topic'
        });
        Ext.create('Ext.data.Store', {
            storeId: 'dataset',
            autoLoad: autoLoad,
            model: 'Puma.model.Dataset'
        });

		Ext.create('Ext.data.Store', {
			storeId: 'layergroup',
			autoLoad: autoLoad,
			model: 'Puma.model.LayerGroup'
		})

		Ext.create('Ext.data.Store', {
			storeId: 'attributeset',
			autoLoad: autoLoad,
			model: 'Puma.model.AttributeSet'
		})

		Ext.create('Ext.data.Store', {
			storeId: 'attribute',
			autoLoad: autoLoad,
			model: 'Puma.model.Attribute'
		})

		Ext.create('Ext.data.Store', {
			storeId: 'visualization',
			autoLoad: autoLoad,
			model: 'Puma.model.Visualization'
		})


		Ext.create('Ext.data.Store', {
			storeId: 'year',
			autoLoad: autoLoad,
			sorters: [{property: 'name', direction: 'ASC'}],
			model: 'Puma.model.Year'
		})




		Ext.create('Ext.data.Store', {
			storeId: 'areatemplate',
			autoLoad: autoLoad,
			model: 'Puma.model.AreaTemplate'
		})

		Ext.create('Ext.data.Store', {
			storeId: 'symbology',
			autoLoad: autoLoad,
			model: 'Puma.model.Symbology'
		})
		Ext.create('Ext.data.TreeStore', {
			model: 'Puma.model.Area',
			root: {
				expanded: false,
				children: [{text: "Child 1", leaf: true}]
			},
			sorters: [{
				property: 'name',
				direction: 'ASC'
			}],
			storeId: 'area'
		})

		Ext.create('Ext.data.Store', {
			storeId: 'dataview',
			autoLoad: autoLoad,
			filters: [function (rec) {
				return rec.get('name');
			}],
			model: 'Puma.model.DataView'
		})


	},

	initEvents: function () {
		var me = this;
		var areaStore = Ext.StoreMgr.lookup('area');
		areaStore.on('beforeload', function (store, options) {
			me.getController('Area').onBeforeLoad(store, options);
		}, this);
		areaStore.on('load', function (store, node, records) {
			me.getController('Area').onLoad(store, node, records);
		}, this);

	},

	initSlaveStores: function () {

		// active objects
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'visualization4window',
			model: 'Puma.model.Visualization'
		})

		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'activescope',
			filters: [function (rec) {
				return rec.get('active') !== false;
			}],
			model: 'Puma.model.Scope'
		})
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'activedataset',
			filters: [function (rec) {
				return rec.get('active') !== false;
			}],
			model: 'Puma.model.Dataset'
		})
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'activelocation',
			filters: [function (rec) {
				return rec.get('active') !== false;
			}],
			model: 'Puma.model.Location'
		})
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'activeattributeset',
			filters: [function (rec) {
				return rec.get('active') !== false;
			}],
			model: 'Puma.model.AttributeSet'
		})


		// objects for selection
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'theme4sel',
			filters: [function (rec) {
				return false;
			}],
			model: 'Puma.model.Theme'
		})
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'year4sel',
			filters: [function (rec) {
				return false;
			}],
			model: 'Puma.model.Year'
		})
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'visualization4sel',
			filters: [function (rec) {
				return false;
			}],
			sorters: [{
				sorterFn: function (o1, o2) {
					var activeThemeCombo = Ext.ComponentQuery.query('#seltheme')[0];
					var activeThemeId = activeThemeCombo ? activeThemeCombo.getValue() : null;
					var theme = activeThemeId ? Ext.StoreMgr.lookup('theme').getById(activeThemeId) : null;
					var order = theme ? theme.get('visOrder') : null;
					if (!order) return o1.get('name') > o2.get('name');
					var idx1 = Ext.Array.indexOf(order, o1.get('_id'));
					var idx2 = Ext.Array.indexOf(order, o2.get('_id'));
					if (idx1 < 0) return true;
					if (idx2 < 0) return false;
					return idx1 > idx2;

				}
			}],
			model: 'Puma.model.Visualization'
		})


		// layer templates vs. feature layer templates
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'featurelayertemplate',
			filters: [function (rec) {
				return !rec.get('justVisualization') && rec.get('active');
			}],
			model: 'Puma.model.AreaTemplate'
		})
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'layertemplate',
			filters: [function (rec) {
				return rec.get('justVisualization') && rec.get('active');
			}],
			model: 'Puma.model.AreaTemplate'
		})
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'layertemplate2choose',
			filters: [function (rec) {
				return false;
			}],
			model: 'Puma.model.AreaTemplate'
		})


		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'attributeset2choose',
			filters: [function (rec) {
				return false;
			}],
			model: 'Puma.model.AttributeSet'
		})


		// need advanced logic
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'attributeset4chart',
			model: 'Puma.model.AttributeSet'
		})


		// attributes based on attr sets
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'attribute4chart',
			sorters: [{
				property: 'code',
				direction: 'ASC'
			}],
			filters: [function (rec) {
				return false;
			}],
			model: 'Puma.model.Attribute'
		})
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'normattribute4chart',
			sorters: [{
				property: 'code',
				direction: 'ASC'
			}],
			filters: [function (rec) {
				return false;
			}],
			model: 'Puma.model.Attribute'
		})


		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'attribute4chart4norm',
			filters: [function (rec) {
				return false;
			}],
			model: 'Puma.model.Attribute'
		})

		// ? is needed, i think use of year4sel is sufficient
		Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			storeId: 'year4chart',
			model: 'Puma.model.Year'
		})

		Ext.create('Gisatlib.data.SlaveStore', {
			model: 'Puma.model.MapLayer',
			slave: true,
			filters: [function (rec) {
				return rec.get('type') == 'topiclayer';
			}],
			storeId: 'layers4outline'
		})
	},

	initLocalStores: function () {

		Ext.create('Gisatlib.paging.PhantomStore', {
			storeId: 'paging'
		});


		Ext.create('Ext.data.TreeStore', {
			storeId: 'attributes2choose',
			// JJJ TODO mozna i prejmenovat ten model
			model: 'Puma.model.MappedChartAttribute',
			root: {
				expanded: true
			}
		});
		Ext.create('Ext.data.TreeStore', {
			model: 'Puma.model.MapLayer',
			storeId: 'layers',
			sorters: [{
				sorterFn: function (o1, o2) {
					var type1 = o1.get('type');

					if (Ext.Array.contains(['systemgroup,choroplethgroup', 'thematicgroup', 'basegroup'], type1)) {
						return null;
					}
				}
			}],
			root: {
				expanded: true,
				children: [{
					name: polyglot.t('analyticalUnits'),
					type: 'systemgroup',
					expanded: true,
					checked: null
				}, {
					name: polyglot.t('thematicMaps'),
					type: 'choroplethgroup',
					expanded: true,
					children: [],
					checked: null
				}, {
					name: polyglot.t('backgroundLayers'),
					type: 'basegroup',
					expanded: true,
					checked: null
				}, {
					name: polyglot.t('liveData'),
					type: 'livegroup',
					expanded: true,
					checked: null
				}, {
					name: polyglot.t('customWms'),
					type: 'customwms',
					expanded: true,
					checked: null
				}]
			}
		});

		Ext.create('Ext.data.Store', {
			model: 'Puma.model.MapLayer',
			filters: [function (rec) {
				return rec.get('checked');
			}],
			slave: true,
			sorters: [{
				property: 'sortIndex',
				direction: 'ASC'
			}],
			storeId: 'selectedlayers'
		})

		Ext.create('Ext.data.Store', {
			model: 'Puma.model.Screenshot',
			data: [],
			storeId: 'screenshot'
		})


		Ext.create('Ext.data.Store', {
			fields: ['name', 'type'],
			storeId: 'classificationtype',
			data: [{
				name: polyglot.t('continuous'),
				type: 'continuous'
			}, {
				name: polyglot.t('equal'),
				type: 'equal'
			}, {
				name: polyglot.t('quantiles'),
				type: 'quantiles'
			}]
		})

		Ext.create('Ext.data.Store', {
			storeId: 'charttype4chart',
			fields: ['name', 'type'],
			data: [{
				name: polyglot.t('table'),
				type: 'grid'
			}, {
				name: polyglot.t('column'),
				type: 'columnchart'
			}, {
				name: polyglot.t('scatter'),
				type: 'scatterchart'
			}, {
				name: polyglot.t('pie'),
				type: 'piechart'
			}, {
					name: polyglot.t('extentOutline'),
					type: 'extentoutline'
				}
			]
		});

		Ext.create('Ext.data.Store', {
			storeId: 'stacking4chart',
			fields: ['name', 'type'],
			data: [{
				name: polyglot.t('none'),
				type: 'none'
			}, {
				name: polyglot.t('percent'),
				type: 'percent'
			}, {
				name: polyglot.t('normal'),
				type: 'normal'
			}, {
				name: polyglot.t('double'),
				type: 'double'
			}]
		})
		Ext.create('Ext.data.Store', {
			storeId: 'aggregate4chart',
			fields: ['name', 'type'],
			data: [{
				name: polyglot.t('none'),
				type: 'none'
			},
//            {
//                name: 'Min',
//                type: 'min'
//            },{
//                name: 'Max',
//                type: 'max'
//            },
				{
					name: polyglot.t('average'),
					type: 'avg'
				}, {
					name: polyglot.t('all'),
					type: 'topall'
				}, {
					name: polyglot.t('select'),
					type: 'select'
				}]
		})

		Ext.create('Ext.data.Store', {
			storeId: 'areas4chart',
			fields: ['name', 'type'],
			data: [{
				name: polyglot.t('justSelect'),
				type: 'select'
			}, {
				name: polyglot.t('treeAll'),
				type: 'treeall'
			}, {
				name: polyglot.t('treeLowestLevel'),
				type: 'treelowest'
			}
			]
		});

		Ext.create('Ext.data.Store', {
			storeId: 'normalization4chart',
			fields: ['name', 'type'],
			data: [
				{
					name: polyglot.t('none'),
					type: ''
				}, {
					name: polyglot.t('area'),
					type: 'area'
				}, {
					name: polyglot.t('attribute'),
					type: 'attribute'
				}, {
					name: polyglot.t('attributeSet'),
					type: 'attributeset'
				}
			]
		});

		Ext.create('Ext.data.Store', {
			storeId: 'change_units',
			fields: ['name', 'type'],
			data: [
				{
					name: polyglot.t('none'),
					type: ''
				}, {
					name: 'm2',
					type: 'm2'
				}, {
					name: 'ha',
					type: 'ha'
				}, {
					name: 'km2',
					type: 'km2'
				}, {
					name: '%',
					type: '%'
				}
			]
		});

		Ext.create('Ext.data.Store', {
			storeId: 'area_units',
			fields: ['name', 'type'],
			data: [
				{
					name: 'm2',
					type: 'm2'
				}, {
					name: 'ha',
					type: 'ha'
				}, {
					name: 'km2',
					type: 'km2'
				}
			]
		});

		// JJJ Neni to zbytecne?
		Ext.create('Ext.data.Store', {
			storeId: 'mappedattribute4chart',
			model: 'Puma.model.MappedChartAttribute',
			data: []
		})

		Ext.create('Ext.data.Store', {
			storeId: 'location4init',
			sorters: [{
				sorterFn: function (r1, r2) {
					var d1 = r1.get('dataset');
					var d2 = r2.get('dataset');
					if (!d1) return -1;
					if (!d2) return 1;
					return 0;
				}
			}, {
				property: 'name',
				direction: 'ASC'
			}],
			fields: ['name', 'locGid', 'location', 'dataset', 'at', 'bbox'],
			filters: [function (rec) {
				return false;
			}],
			data: []
		});

	}

});



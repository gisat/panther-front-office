Ext.define('PumaMain.controller.AttributeConfig', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: ['PumaMain.view.ConfigForm'],
    init: function() {
		this.control(
			{
				'attributegrid #add': {
					click: this.onAddAttribute
				},
				'attributegrid #remove': {
					click: this.onRemoveAttribute
				},
				'attributegrid #normalize': {
					click: this.onOpenAttributeSetting
				},
				'attributegrid #choroplethparams': {
					click: this.onConfigureChoropleth
				},
				'addattributetree #add': {
					click: this.onAttributeAdded
				},
				'addattributetree #back': {
					click: this.backToInitial
				},
				'addattributetree': {
					checkchange: this.onAddAttrCheck,
					itemclick: this.onAddAttrItemClick
				},
				'normalizeform #normalize': {
					click: this.onCloseAttributeSetting
				},
				'normalizeform #back': {
					click: this.backToInitial
				},
				'normalizeform #normAttributeSet': {
					change: this.onNormAttrSetChange
				},
				'normalizeform #normType': {
					change: this.onNormTypeChange
				},
				'#normalizationUnits': {
					change: this.onChangeUnitsChange
				},
				'#normAttribute': {
					change: this.onNormAttrChange
				},
				'#areaUnits': {
					change: this.onAreaUnitsChange
				},

				'choroplethform #apply': {
					click: this.onChoroplethParamsApplied
				},
				'choroplethform #classType': {
					change: this.onClassTypeChanged
				},
				'choroplethform #back': {
					click: this.backToInitial
				},

				'configform #type': {
					change: this.onChartTypeChange
				},

				'chartbar panel[cfgType=add]': {
					beforeexpand: this.onConfigureClick
				},

				'chartpanel tool[type=gear]': {
					click: this.onConfigureClick
				},
				'#configurelayers': {
					click: this.onConfigureClick
				},
				'#configurefilters': {
					click: this.onConfigureClick
				},
				'configform #configurefinish': {
					click: this.onConfigureFinish
				}

			});
    },
    
            
    onConfigureChoropleth: function(btn) {
        var attrStore = btn.up('[itemId=attributecontainer]').down('attributegrid').store;
        var recs = this.getChecked(attrStore);
        if (recs.length<1) {
            return;
        }
        
        this.setActiveCard(btn,4);
        
        var form = btn.up('[itemId=attributecontainer]').down('choroplethform');
        if (recs.length==1) {
            form.down('#classType').setValue(recs[0].get('classType'));
            form.down('#numCategories').setValue(recs[0].get('numCategories'));
        }
        else {
            form.getForm().reset();
        }
    },
    onClassTypeChanged: function(combo,val) {
        var categories = combo.up('panel').down('#numCategories');
        if (val=='continuous') {
            categories.setValue(5);
        }
        categories.setVisible(val!='continuous');
    },        
        
    onChoroplethParamsApplied: function(btn) {
        
        var form = btn.up('panel');
        var attrStore = form.up('[itemId=attributecontainer]').down('attributegrid').store;
        var recs = this.getChecked(attrStore);
        for (var i=0;i<recs.length;i++) {
            var rec = recs[i];
            rec.set('numCategories',form.getComponent('numCategories').getValue());
            rec.set('classType',form.getComponent('classType').getValue());
            rec.set('zeroesAsNull',true);
            rec.commit();
        }
        
        this.setActiveCard(btn,0);
    },
    
    onConfigureFinish: function(cmp) {
        var form = cmp.up('configform');
        var values = form.getForm().getValues();
        var attrs = values.attrs;
        var attrMap = {};
        var isSelect = null;
        for (var i=0;i<attrs.length;i++) {
            var attr = attrs[i];
            var attrName = 'as_'+attr.as+'_attr_'+attr.attr;
            if (attrMap[attrName]) {
                Puma.util.Msg.msg('Duplicate attributes not allowed','','l');
                return;
            }
            
            attrMap[attrName] = true;
            var type = attr.normType;
            if (isSelect === true && type!='select') {
                Puma.util.Msg.msg('All attributes have to be normalized to "First selected"','','l');
                return;
            }
            if (isSelect === false && type=='select') {
                Puma.util.Msg.msg('All attributes have to be normalized to "First selected"','','l');
                return;
            }
            isSelect = type == 'select';
        }
        
        
        
        delete values['normType'];
        delete values['normYear'];
        delete values['normAttribute'];
        delete values['normAttributeSet'];
        if (form.chart) {
            form.chart.cfg = values;
            this.getController('Chart').reconfigureChart(form.chart,false,false,true)
        }
        else if (form.formType=='chart') {
            this.getController('Chart').addChart(values);
        }
        else if (form.formType=='layers') {
            this.getController('Layers').reconfigureChoropleths(values);
        }
        else if (form.formType=='filters') {
            this.filterConfig = values.attrs;
            this.getController('Filter').reconfigureFilters(values);
        }
        form.up('window').close();
    },
        
    onConfigureClick: function(cmp) {
        var formType = 'chart';
        var cfg = {attrs:[]};
        var chart = null;
        if (cmp.itemId == 'configurelayers') {
            formType = 'layers';
            cfg = {attrs:this.layerConfig || []} ;
        }
        else if (cmp.itemId == 'configurefilters') {
            formType = 'filters';
            cfg = {attrs:this.filterConfig || []} ;
        }
        else if (cmp.xtype == 'tool') {
            chart = cmp.up('chartpanel').chart;
            cfg = chart.cfg;
        }
        var datasetId = Ext.ComponentQuery.query('#seldataset')[0].getValue();
        var dataset = Ext.StoreMgr.lookup('dataset').getById(datasetId);
        var levels = dataset.get('featureLayers');
        var fls = Ext.StoreMgr.lookup('layertemplate').queryBy(function(rec) {
            return Ext.Array.contains(levels,rec.get('_id'));
        }).getRange();
        var title = 'Chart configuration';
        switch (cmp.xtype=='tool' ? 'tool' : cmp.itemId) {
            case 'configurelayers':
                title = 'Thematic maps configuration'; break;
            case 'configurefilters':
                title = 'Filters configuration'; break;
            case 'tool':
                title += ' - '+cfg.title
            
        }
        var window = Ext.widget('window',{
			layout: 'fit',
            width: 710,
            height: 724,
            
            title: title,
            items: [{
                xtype: 'configform',
                featureLayers: fls,
                padding: 5,
                cls: 'configform',
                chart: chart,
                formType: formType
            }],
			listeners: {
				// JJJ jak se to dela, aby se listenery prirazovaly v this.control?
				close: this.onChartConfWindowClose
			}
        });
        window.show();
        window.down('configform').getForm().setValues(cfg);
        return false;
    },
	
	onChartConfWindowClose: function(){
		Ext.StoreMgr.lookup('attributes2choose').getRootNode().cascadeBy(function(node){
			if(node.get('checked')) node.set('checked', false);
		});
	},
    
	// triggered when AddAttributeTree opened
    onAddAttribute: function(btn) {
        this.setActiveCard(btn,1);
    },

	onRemoveAttribute: function(btn) {
        var store = btn.up('grid').store;
        var recs = this.getChecked(store);
        store.remove(recs);
    },
	
	// triggered on change of any checkbox in AddAttributeTree
	onAddAttrCheck: function(checkNode, checked){
		if(checkNode.get('attr')){
			var parentChecked = true;
			Ext.Array.each(checkNode.parentNode.childNodes, function(node){
				if( !node.get('checked') ) return parentChecked = false;
			});
			checkNode.parentNode.set('checked', parentChecked);
			
		}else if(checkNode.get('as')){
			// check/uncheck all attributes of this attribute set
			Ext.Array.each(checkNode.childNodes, function(node){
				node.set('checked', checked);
			});
			if( checked ) checkNode.expand();
		}
		
	},
	
	onAddAttrItemClick: function(view, node, item, index, e){
		if(node.get('attr') && e.target.className != 'x-tree-checkbox'){
			node.set('checked', !node.get('checked'));
			this.onAddAttrCheck(node);
		}
	},
	
	// triggered when attribute addition is confirmed in AddAttributeTree
    onAttributeAdded: function(btn) {
        var store = btn.up('addattributetree').store;
        var recs = this.getChecked(store);
        var newRecs = [];
        for (var i=0;i<recs.length;i++) {
            var rec = recs[i];
			if(!rec.get('attr')) continue;
            var newRec = Ext.create('Puma.model.MappedChartAttribute',{
                as: rec.get('as'),
                attr: rec.get('attr'),
                checked: true
            });
            newRecs.push(newRec)
        }
        var mainStore = btn.up('configform').down('attributegrid').store;
        mainStore.add(newRecs);
		
		// unselect all
		store.getRootNode().cascadeBy(function(node){
			if(node.get('checked')) node.set('checked', false);
		});

        this.setActiveCard(btn,0);
    },

	/**
	 * Event handler which runs when user opens settings page for given attribute. It gets all checked attributes and based
	 * on them either disable the form or set the current status. Form is disabled when any of the information in the form
	 * differs for any two of the attributes in the form.
	 * @param btn
	 */
	onOpenAttributeSetting: function(btn) {
		var attrStore = btn.up('[itemId=attributecontainer]').down('attributegrid').store;
		var recs = this.getChecked(attrStore);
		if (recs.length < 1) {
			return;
		}

		var form = btn.up('[itemId=attributecontainer]').down('normalizeform');

		var normType = recs[0].get('normType');
		var normAs = recs[0].get('normAs');
		var normAttr = recs[0].get('normAttr');
		var normalizationUnits = recs[0].get('normalizationUnits');
		var customFactor = recs[0].get('customFactor');
		var units = recs[0].get('units');
		var displayUnits = recs[0].get('displayUnits') || units; // Before there is anything set for the attribute the units are default.
		var areaUnits = recs[0].get('areaUnits');

		if (this.isValidToChangeSettings(recs)) {
			form.getForm().applyToFields({disabled: false});

			form.down('#normType').setValue(normType);
			form.down('#normAttributeSet').setValue(normAs);
			form.down('#normAttribute').setValue(normAttr);
			form.down('#normalizationUnits').setValue(normalizationUnits);
			form.down('#customFactor').setValue(customFactor);
			form.down('#displayUnits').setValue(displayUnits);
			form.down('#units').setValue(units);
			form.down('#areaUnits').setValue(areaUnits);

			// Set current units to the relevant ones.

			this.units = units;

			this.setActiveCard(btn, 2);
		} else {
			form.getForm().applyToFields({disabled: true});
			form.getForm().reset();

			alert('You can bulk edit configuration only for attributes with the same source units, same normalization type, change units, custom factor and for attribute and attribute set normalization also the same attribute and/or attribute set.');
		}
	},

	/**
	 * Event handler happening when User clicks on Setting in the open normalization panel. It simply gathers values in
	 * the form and sets them.
	 * It simply changes the view, when the values are invalid to be set.
	 * @param btn
	 */
	onCloseAttributeSetting: function (btn) {
		var normalize = btn.itemId == 'normalize';
		var form = btn.up('panel');

		var attrStore = form.up('[itemId=attributecontainer]').down('attributegrid').store;
		var recs = this.getChecked(attrStore);
		if(!this.isValidToChangeSettings(recs)) {
			this.setActiveCard(btn, 0);
			return;
		}

		var normType = normalize ? form.getComponent('normType').getValue() : null;
		var normAttr = normalize ? form.getComponent('normAttribute').getValue() : null;
		var normAs = normalize ? form.getComponent('normAttributeSet').getValue() : null;

		var normalizationUnits = form.getComponent('normalizationUnits').getValue();
		var customFactor = form.getComponent('customFactor').getValue();
		var displayUnits = form.getComponent('displayUnits').getValue();
		var areaUnits = form.getComponent('areaUnits').getValue();

		for (var i = 0; i < recs.length; i++) {
			var rec = recs[i];
			rec.set('normType', normType);
			rec.set('normAttr', normAttr);
			rec.set('normAs', normAs);
			rec.set('normalizationUnits', normalizationUnits);
			rec.set('customFactor', customFactor);
			rec.set('displayUnits', displayUnits);
			rec.set('areaUnits', areaUnits);
			rec.commit();
		}

		this.setActiveCard(btn, 0);
	},

	/**
	 * It verifies whether all checked attributes share the same settings. If they do, it is possible to update them in
	 * the bulk. When they don't it isn't possible.
	 * @param recs
	 * @returns {boolean}
	 */
	isValidToChangeSettings: function(recs) {
		var areEqual = true;
		var normType = recs[0].get('normType');
		var normAs = recs[0].get('normAs');
		var normAttr = recs[0].get('normAttr');
		var normalizationUnits = recs[0].get('normalizationUnits');
		var customFactor = recs[0].get('customFactor');
		var units = recs[0].get('units');
		var areaUnits = recs[0].get('areaUnits');

		for (var attribute = 0; attribute < recs.length; attribute++) {
			if (normType != recs[attribute].get('normType') || normAs != recs[attribute].get('normAs') ||
				normAttr != recs[attribute].get('normAttr') || normalizationUnits != recs[attribute].get('normalizationUnits') ||
				customFactor != recs[attribute].get('customFactor') || units != recs[attribute].get('units') ||
				areaUnits != recs[attribute].get('areaUnits')) {
				areEqual = false;
			}
		}

		return areEqual;
	},
        
    onNormAttrSetChange: function(combo,val) {
        var attrSet = val ? Ext.StoreMgr.lookup('attributeset').getById(val) : null;
        var attributes = attrSet ? attrSet.get('attributes') : [];
        var store = combo.up('panel').down('#normAttribute').store;
        store.clearFilter(true);
        store.filter([function(rec) {
            var numeric = true;
            if (rec.data.hasOwnProperty("type") && rec.data.type != "numeric"){
                numeric = false;
            }
            return Ext.Array.contains(attributes,rec.get('_id')) && numeric
        }]);

        var panel = combo.up('panel');
        var unitsToShow = '%';
		panel.down('#normalizationUnits').setValue(unitsToShow);
		panel.down('#customFactor').setValue(100);
		panel.down('#displayUnits').setValue(unitsToShow);
    },

	/**
	 * It updates the normalization attribute and based on the information it contains it also updates normalization
	 * units and display units.
	 * @param combo
	 * @param val
	 */
	onNormAttrChange: function(combo, val) {
		if(!val) {
			return;
		}
		var normalizationAttribute = val ? Ext.StoreMgr.lookup('attribute').getById(val) : null;
		this.updateCustomUnits(combo.up('panel'), normalizationAttribute && normalizationAttribute.get('units'));
	},

	/**
	 * It gets current units and normalization units and updates values in the Normalization Units, Custom Factor and
	 * current units.
	 * If the normalization units and source units are the same it sets % as the valid unit.
	 * If they differ but both of them are are area units then % is also set as the valid unit.
	 * If at least one isn't area unit, then the unit / normalization unit is displayed.
	 * @param panel
	 * @param normalizationUnits {String} Units to be used for normalization.
	 */
	updateCustomUnits: function(panel, normalizationUnits) {
		normalizationUnits = normalizationUnits || '';

		var validUnits = ['m2', 'ha', 'km2'];
		var unitsToShow = this.units;
		if(normalizationUnits) {
			unitsToShow += '/' + normalizationUnits;
		}

		if(this.units == normalizationUnits || validUnits.indexOf(this.units) != -1 && validUnits.indexOf(normalizationUnits) != -1) {
			unitsToShow = '%';
			panel.down('#normalizationUnits').setValue(unitsToShow);
			panel.down('#customFactor').setValue(100);
		}

		panel.down('#displayUnits').setValue(unitsToShow);
	},

	/**
	 * This is event handler which happens when type of the normalization changes. If the normalization changes to area
	 * or to none the custom units are cleansed
	 * @param combo
	 * @param val
	 */
	onNormTypeChange: function (combo, val) {
		var panel = combo.up('panel');
		var attrCombo = panel.down('#normAttribute');
		var attrSetCombo = panel.down('#normAttributeSet');
		var areaUnits = panel.down('#areaUnits');

		if (val == 'attributeset') {
			attrSetCombo.show();
			attrCombo.hide();
			areaUnits.hide();
		} else if (val == 'attribute') {
			attrSetCombo.show();
			attrCombo.show();
			areaUnits.hide();
		} else if (val == 'area') {
			attrSetCombo.hide();
			attrCombo.hide();

			var allowedUnits = ['m2','ha','km2'];
			if(allowedUnits.indexOf(this.units) == -1) {
				areaUnits.show();
				if(!areaUnits.getValue()) {
					areaUnits.setValue('m2');
				}
			}

			this.updateCustomUnits(combo.up('panel'), areaUnits.getValue() || 'm2');
		} else {
			attrCombo.reset();
			attrSetCombo.reset();

			attrSetCombo.hide();
			attrCombo.hide();
			areaUnits.hide();
		}
	},

	onAreaUnitsChange: function(combo, val) {
		var areaUnits = combo.up('panel').down('#areaUnits');
		this.updateCustomUnits(combo.up('panel'), areaUnits.getValue());
	},

	onChartTypeChange: function(combo,val) {
        var configForm = combo.up('configform');
        var advanced = Ext.ComponentQuery.query('#advancedfieldset',configForm)[0];
        var cardContainer = Ext.ComponentQuery.query('#attributecontainer',configForm)[0];
        cardContainer.show();
        if (val!='extentoutline') {
            cardContainer.getLayout().setActiveItem(0);
        }
        else {
            cardContainer.getLayout().setActiveItem(3);
        }
        if (val=='columnchart') {
            advanced.show();
        }
        else {
            advanced.hide();
        }
    },

	/**
	 * Event handler which happens when Change units change. In this case the display units are updated to current change
	 * units and the custom factor is updated based on all the available information.
	 * @param combo
	 * @param value
	 */
    onChangeUnitsChange: function(combo, value) {
		var customFactor = combo.up('configform').down('#customFactor');
		var currentAttributeUnits = this.units;
		var validUnits = ['m2', 'ha', 'km2'];

		if(value == '%') {
			customFactor.setValue(100);
		} else if(validUnits.indexOf(value) != -1) {
			customFactor.setValue(this.getCustomFactor(currentAttributeUnits, value));
		}

		var normAttribute = combo.up('panel').down('#normalizationUnits').getValue();
		combo.up('panel').down('#displayUnits').setValue(normAttribute);
	},

	getCustomFactor: function(source, result) {
		var factors = {
			"m2": 1,
			"ha": 10000,
			"km2": 1000000
		};

		return factors[source] / factors[result]
	},
    
    backToInitial: function(btn) {
        this.setActiveCard(btn,0);
    },
    setActiveCard: function(cmp,idx) {
        cmp.up('[itemId=attributecontainer]').getLayout().setActiveItem(idx);
    },
    
    getChecked: function(store) {
		if(!store.tree){
	        return store.query('checked',true).getRange();
		}else{
			var checkedNodes = [];
			store.getRootNode().cascadeBy(function(node){
				if(node.get('checked')) checkedNodes.push(node);
			});
			return checkedNodes;
		}
    }
});



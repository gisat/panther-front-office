Ext.define('PumaMain.controller.AttributeConfig', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: ['PumaMain.view.ConfigForm'],
    init: function() {
		this.addInfoOnClickListener(),
    	this.standardUnits = ['m2', 'ha', 'km2'];

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
				'#normalizationAreaUnits': {
					change: this.onNormalizationAreaUnitsChange
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

        Observer.notify('AttributeConfig#init');
    },
	addInfoOnClickListener: function(){
		$("body").on("click", ".form-label-help", function(){
			$(".form-label-help p").removeClass("open");
			var info = $(this).find("p");
			if (info.hasClass("open")){
				info.removeClass("open");
			} else {
				info.addClass("open");
			}
		});
		$("body").on("click", ".x-window", function(e){
			var cls = e.target.className;
			if (cls != "form-label-help" && cls != "form-label-help-button"){
				$(".form-label-help p").removeClass("open");
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
                Puma.util.Msg.msg(polyglot.t('duplicateAttributesNotAllowed'),'','l');
                return;
            }
            
            attrMap[attrName] = true;
            var type = attr.normType;
            if (isSelect === true && type!='select') {
                Puma.util.Msg.msg(polyglot.t('allAttributesHaveToBeNormalized'),'','l');
                return;
            }
            if (isSelect === false && type=='select') {
                Puma.util.Msg.msg(polyglot.t('allAttributesHaveToBeNormalized'),'','l');
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
                title = polyglot.t('thematicMapsConfiguration'); break;
            case 'configurefilters':
                title = polyglot.t('filtersConfiguration'); break;
            case 'tool':
                title += ' - '+cfg.title
            
        }
        var window = Ext.widget('window',{
			layout: 'fit',
			cls: 'thematic-maps-settings',
            width: 800,
            height: 600,
            
            title: title,
            items: [{
                xtype: 'configform',
                featureLayers: fls,
                padding: 0,
                cls: 'configform',
                chart: chart,
                formType: formType,
				resizable: false
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
		var form = btn.up('configform');
		var values = form.getForm().getValues();
		var type = values.type;

		Ext.StoreMgr.lookup('attributes2choose').getRootNode().cascadeBy(function(node){
			node.collapseChildren();
			if (node.data.attrType === "text"){
				if (type !== "grid"){
					node.data.cls = "nonnumeric-attribute";
				} else {
					node.data.cls = "";
				}
			}
		});
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
			
		} else if(checkNode.get('as')){
			// check/uncheck all attributes of this attribute set
			Ext.Array.each(checkNode.childNodes, function(node){
				node.set('checked', checked);
			});
			if( checked ){
				checkNode.expand();
			}
		}
		
	},
	
	onAddAttrItemClick: function(view, node, item, index, e){
		if(node.get('attr') && e.target.className != 'x-tree-checkbox'){
			node.set('checked', !node.get('checked'));
			this.onAddAttrCheck(node);
		}

		if (node.get('as') && !node.get('attr')){
			node.set('checked', !node.get('checked'));
			this.onAddAttrCheck(node, node.get('checked'));
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
		var customFactor = recs[0].get('customFactor');
		var units = recs[0].get('units');
		var displayUnits = recs[0].get('displayUnits') || units; // Before there is anything set for the attribute the units are default.
		var overwriteUnits = recs[0].get('normalizationUnits');
		var areaUnits = recs[0].get('areaUnits');

		if (this.isValidToChangeSettings(recs)) {
			form.getForm().applyToFields({disabled: false});

			form.down('#normType').setValue(normType);
			form.down('#normAttributeSet').setValue(normAs);
			form.down('#normAttribute').setValue(normAttr);
			form.down('#normalizationUnits').setValue(overwriteUnits);
			form.down('#customFactor').setValue(customFactor);
			form.down('#displayUnits').setValue(displayUnits);
			form.down('#units').setValue(units);
			form.down('#areaUnits').setValue(areaUnits);

			// Set current units to the relevant ones.
			this.units = units;

			var normalizationAreaUnits = null;
			if(normAttr) {
				var normAttributeVal = form.down('#normAttribute').getValue();
				var normalizationAttribute = normAttributeVal ? Ext.StoreMgr.lookup('attribute').getById(normAttributeVal) : null;
				normalizationAreaUnits = normalizationAttribute && normalizationAttribute.units;

			}
			this.toggleNormalizationAreaUnits(form.down('#normalizationAreaUnits'), units, normalizationAreaUnits);
			this.disableCustomFactorIfOnlyStandard(form.down('#customFactor'), units, normalizationAreaUnits);

			this.updateDisplayedUnits(form.down('#displayUnits'), units, normalizationAreaUnits, displayUnits);
			this.setActiveCard(btn, 2);
		} else {
			form.getForm().applyToFields({disabled: true});
			form.getForm().reset();

			alert(polyglot.t('bulkEditConfiguration'));
		}
	},

	// TODO: Area units in custom factor.
	// TODO: Change to attribute has incorrect information.

	/**
	 * It takes source units and normalization units and based on this information it either enables or disables the
	 * custom factor field
	 * @param customFactorField
	 * @param sourceUnits
	 * @param normalizationUnits
	 */
	disableCustomFactorIfOnlyStandard: function(customFactorField, sourceUnits, normalizationUnits) {
		var validUnits = this.standardUnits;
		if(validUnits.indexOf(sourceUnits) == -1 || (normalizationUnits && validUnits.indexOf(normalizationUnits) == -1)) {
			customFactorField.enable();
		} else {
			customFactorField.disable();
		}
	},

	/**
	 * Show the possibility to update normalization area units in case normalization area is in standard units and the
	 * units are custom.
	 * @param normalizationAreaUnitsField
	 * @param normalizationUnits
	 */
	toggleNormalizationAreaUnits: function(normalizationAreaUnitsField, sourceUnits, normalizationUnits) {
		var validUnits = this.standardUnits;
		if(normalizationUnits && validUnits.indexOf(normalizationUnits) != -1 && validUnits.indexOf(sourceUnits) == -1) {
			normalizationAreaUnitsField.setValue(normalizationUnits);
			normalizationAreaUnitsField.show();
		} else {
			normalizationAreaUnitsField.hide();
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

	/**
	 * It is triggered when normalization attribute set is changed. This means when it is reset or when normalization
	 * type is attribute or attribute set.
	 * @param combo
	 * @param val
	 */
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
		if(panel.down('#normType').getValue() == 'attributeset') {
			var unitsToShow = '%';
			panel.down('#normalizationUnits').setValue(unitsToShow);
			panel.down('#customFactor').setValue(100);
			this.updateDisplayedUnits(panel.down('#displayUnits'), null, null, unitsToShow);
		}
    },

	/**
	 * It updates the normalization attribute and based on the information it contains it also updates normalization
	 * units and display units. It also then update the state of custom factor and either show or hide the possibility
	 * to select the normalization area units.
	 * @param combo
	 * @param val
	 */
	onNormAttrChange: function(combo, val) {
		if(!val) {
			return;
		}
		var normalizationAttribute = val ? Ext.StoreMgr.lookup('attribute').getById(val) : null;
		var normalizationUnits = normalizationAttribute && normalizationAttribute.get('units');
		var panel = combo.up('panel');
		this.updateCustomUnits(panel, normalizationUnits);

		var sourceUnits = panel.down('#units').getValue();
		this.toggleNormalizationAreaUnits(
			panel.down('#normalizationAreaUnits'),
			sourceUnits,
			normalizationUnits
		);
		this.disableCustomFactorIfOnlyStandard(
			panel.down('#customFactor'),
			sourceUnits,
			normalizationUnits
		);
	},

	/**
	 * This happens when user updates the standard units to be shown to the user. It happens when source unit is non standard and
	 * normalization unit is standard.
	 * @param combo
	 * @param val
	 */
	onNormalizationAreaUnitsChange: function(combo, val) {
		var normAttributeVal = combo.up().down('#normAttribute').getValue();
		var normalizationAttribute = normAttributeVal ? Ext.StoreMgr.lookup('attribute').getById(normAttributeVal) : null;
		var sourceUnits = normalizationAttribute && normalizationAttribute.get('units');
		var customFactor = this.getCustomFactor(val, sourceUnits);
		combo.up().down('#customFactor').setValue(customFactor);
		// Update display unit.
		this.updateDisplayedUnits(combo.up().down('#displayUnits'), this.units, val, null);
		combo.up().down('#normalizationUnits').setValue('');
		this.updateCustomFactor(combo.up().down('#customFactor'), sourceUnits, val, null);
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

		this.updateDisplayedUnits(panel.down('#displayUnits'), this.units, normalizationUnits, null);
	},

	/**
	 * Based on the rules it update displayed units.
	 *   By default overwrite units, overwrite all other options
	 *   If both source and normalization unit is standard the result is in percent
	 *   If either source or normalization unit is nonstandard it is source / normalization
	 * @param displayUnitsField
	 * @param sourceUnit
	 * @param normalizationUnit
	 * @param overwriteUnit
	 */
	updateDisplayedUnits: function(displayUnitsField, sourceUnit, normalizationUnit, overwriteUnit) {
		var displayUnit = '';
		var standardUnits = this.standardUnits;

		if(overwriteUnit) {
			displayUnit = overwriteUnit;
		} else if(standardUnits.indexOf(sourceUnit) != -1 && standardUnits.indexOf(normalizationUnit) != -1) {
			displayUnit = '%';
		} else if(sourceUnit == normalizationUnit) {
			displayUnit = '%';
		} else {
			displayUnit = sourceUnit + '/' + normalizationUnit;
		}

		displayUnitsField.setValue(displayUnit);
	},

	/**
	 * It updates custom factor based on similar rules to displayed units.
	 *   If there are overwrite units then get custom factor based on the source units and overwrite units.
	 *   If the source units and normalization units are both
	 * @param customFactorField
	 * @param sourceUnit
	 * @param normalizationUnit
	 * @param overwriteUnit
	 */
	updateCustomFactor: function(customFactorField, sourceUnit, normalizationUnit, overwriteUnit) {
		var customFactor = 1;
		var standardUnits = this.standardUnits;

		if(overwriteUnit) {
			customFactor = this.getCustomFactor(sourceUnit, overwriteUnit);
		} else if(standardUnits.indexOf(sourceUnit) != -1 && standardUnits.indexOf(normalizationUnit) != -1) {
			customFactor = this.getCustomFactor(sourceUnit, normalizationUnit);
		} else if(sourceUnit == normalizationUnit) {
			customFactor = 100;
		} else {
			customFactor = 1;
		}

		customFactorField.setValue(customFactor);
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
		var normalizationAreaUnits = panel.down('#normalizationAreaUnits');
		var customFactor = panel.down('#customFactor');
		var changeUnits = panel.down('#normalizationUnits');
		var displayUnits = panel.down('#displayUnits');
		customFactor.reset();
		attrCombo.reset();
		attrSetCombo.reset();
		normalizationAreaUnits.reset();

		changeUnits.setValue('');
		displayUnits.setValue(this.units);

		if (val == 'attributeset') {
			attrSetCombo.show();
			attrCombo.hide();
			areaUnits.hide();
			normalizationAreaUnits.hide();
		} else if (val == 'attribute') {
			attrSetCombo.show();
			attrCombo.show();
			areaUnits.hide();
		} else if (val == 'area') {
			attrSetCombo.hide();
			attrCombo.hide();
			normalizationAreaUnits.hide();

			var allowedUnits = ['m2','ha','km2'];
			if(allowedUnits.indexOf(this.units) == -1) {
				areaUnits.show();
				if(!areaUnits.getValue()) {
					areaUnits.setValue('m2');
				}
			}

			this.updateCustomUnits(combo.up('panel'), areaUnits.getValue() || 'm2');
		} else {
			attrSetCombo.hide();
			attrCombo.hide();
			areaUnits.hide();
			normalizationAreaUnits.hide();
		}
	},

	/**
	 * When normalization over area it is possible to update the units which will be then used. It must update the
	 * dispayed units and custom factor
	 * @param combo
	 * @param val
	 */
	onAreaUnitsChange: function(combo, val) {
		this.updateCustomUnits(combo.up('panel'), val);
		this.updateCustomFactor(combo.up('panel').down('#customFactor'), val, 'm2', null);
	},

	onChartTypeChange: function(combo,val) {
        var configForm = combo.up('configform');
        var advanced = Ext.ComponentQuery.query('#advancedfieldset',configForm)[0];
		var periodsSettings = Ext.ComponentQuery.query('#periodsSettings',configForm)[0];
        var cardContainer = Ext.ComponentQuery.query('#attributecontainer',configForm)[0];
		var periods = Ext.ComponentQuery.query('#selyear')[0].getValue();
        cardContainer.show();
        if (val!='extentoutline') {
            cardContainer.getLayout().setActiveItem(0);
        }
        else {
            cardContainer.getLayout().setActiveItem(3);
        }
        if (val=='columnchart') {
            advanced.show();
        } else {
            advanced.hide();
        }
		if (val=='columnchart' && periods.length > 1 ) {
			periodsSettings.show();
		} else {
			periodsSettings.hide();
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
		var validUnits = this.standardUnits;

		if(value == '%') {
			customFactor.setValue(100);
		} else if(validUnits.indexOf(value) != -1) {
			customFactor.setValue(this.getCustomFactor(currentAttributeUnits, value));
		}

		var normAttribute = combo.up('panel').down('#normalizationUnits').getValue();
		this.updateDisplayedUnits(combo.up('panel').down('#displayUnits'), this.units, null, normAttribute);
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
    	var component = cmp.up('[itemId=attributecontainer]');
    	var layout = component.getLayout();
        layout.setActiveItem(idx);
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



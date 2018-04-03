Ext.define('PumaMain.view.NormalizeForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.normalizeform',
	frame: true,
	header: true,
	title: polyglot.t('attributeConfiguration'),
	initComponent: function () {
		this.attrStore = Ext.create('Gisatlib.data.SlaveStore', {
			slave: true,
			autoLoad: true,
			filters: [function (rec) {
				return false;
			}],
			model: 'Puma.model.Attribute'
		});
		this.bodyStyle = {
			padding: '0px',
		};
		this.style = {
			marginTop: '10px'
		};
		this.items = [{
			xtype: 'textfield',
			fieldLabel: polyglot.t('attributeUnitOriginal'),
			labelWidth: 170,
			name: 'units',
			valueField: 'type',
			itemId: 'units',
			disabled: true
		}, {
			xtype: 'textfield',
			fieldLabel: polyglot.t('attributeUnitDisplayed'),
			labelWidth: 170,
			name: 'displayUnits',
			valueField: 'type',
			itemId: 'displayUnits',
			disabled: true
		},{
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('change_units'),
			fieldLabel: polyglot.t('modifyDisplayedUnits'),
			labelWidth: 170,
			afterLabelTpl: new Ext.XTemplate(
				'<div class="form-label-help">',
					'<i class="form-label-help-button fa fa-info-circle"></i>',
					polyglot.t('modifyDisplayedUnitsText'),
				'</div>'
			),
			name: 'normalizationUnits',
			valueField: 'type',
			itemId: 'normalizationUnits'
		}, {
			xtype: 'textfield', // TODO: Validate that it is Number.
			fieldLabel: polyglot.t('customFactor'),
			labelWidth: 170,
			afterLabelTpl: new Ext.XTemplate(
				'<div class="form-label-help">',
					'<i class="form-label-help-button fa fa-info-circle"></i>',
					polyglot.t('customFactorTooltip'),
				'</div>'
			),
			name: 'customFactor',
			valueField: 'type',
			itemId: 'customFactor'
		}, {
			xtype: 'label',
			text: polyglot.t('normalization'),
			cls: 'form-section-title'
		},{
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('normalization4chart'),
			fieldLabel: polyglot.t('normalizationType'),
			labelWidth: 170,
			name: 'normType',
			valueField: 'type',
			itemId: 'normType'
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('area_units'),
			fieldLabel: polyglot.t('areaUnits'),
			labelWidth: 170,
			name: 'areaUnits',
			hidden: true,
			valueField: 'type',
			itemId: 'areaUnits'
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('attributeset2choose'),
			fieldLabel: polyglot.t('normalizationAttrSet'),
			labelWidth: 170,
			name: 'normAttributeSet',
			hidden: true,
			itemId: 'normAttributeSet'
		}, {
			xtype: 'pumacombo',
			store: this.attrStore,
			fieldLabel: polyglot.t('normalizationAttribute'),
			labelWidth: 170,
			name: 'normAttribute',
			hidden: true,
			itemId: 'normAttribute'
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('area_units'),
			fieldLabel: polyglot.t('normalizationAttributeAreaUnits'),
			name: 'normalizationAreaUnits',
			hidden: true,
			valueField: 'type',
			itemId: 'normalizationAreaUnits'
		}];

		this.buttons = [{
			text: polyglot.t('changeSettings'),
			itemId: 'normalize'
		}, {
			text: polyglot.t('back'),
			itemId: 'back'
		}];
		this.callParent();

	}
})



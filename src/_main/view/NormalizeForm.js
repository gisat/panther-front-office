Ext.define('PumaMain.view.NormalizeForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.normalizeform',
	frame: true,
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
			padding: '0px'
		};

		this.items = [{
			xtype: 'textfield',
			fieldLabel: 'Units displayed to the User',
			labelWidth: 170,
			name: 'displayUnits',
			valueField: 'type',
			itemId: 'displayUnits',
			disabled: true
		}, {
			xtype: 'textfield',
			fieldLabel: 'Units of the source attribute',
			labelWidth: 170,
			name: 'units',
			valueField: 'type',
			itemId: 'units',
			disabled: true
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('change_units'),
			fieldLabel: 'Change Displayed Units',
			labelWidth: 170,
			afterLabelTpl: new Ext.XTemplate(
				'<div class="form-label-help">',
					'<i class="form-label-help-button">i</i>',
					'<p>Change Displayed Units description</p>',
				'</div>'
			),
			name: 'normalizationUnits',
			valueField: 'type',
			itemId: 'normalizationUnits'
		}, {
			xtype: 'textfield', // TODO: Validate that it is Number.
			fieldLabel: 'Custom factor',
			labelWidth: 170,
			afterLabelTpl: new Ext.XTemplate(
				'<div class="form-label-help">',
				'<i class="form-label-help-button">i</i>',
				'<p>Custom factor description</p>',
				'</div>'
			),
			name: 'customFactor',
			valueField: 'type',
			itemId: 'customFactor'
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('normalization4chart'),
			fieldLabel: 'Norm type',
			labelWidth: 170,
			name: 'normType',
			valueField: 'type',
			itemId: 'normType'
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('area_units'),
			fieldLabel: 'Area units',
			labelWidth: 170,
			name: 'areaUnits',
			hidden: true,
			valueField: 'type',
			itemId: 'areaUnits'
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('attributeset2choose'),
			fieldLabel: 'Normalization Attr set',
			labelWidth: 170,
			name: 'normAttributeSet',
			hidden: true,
			itemId: 'normAttributeSet'
		}, {
			xtype: 'pumacombo',
			store: this.attrStore,
			fieldLabel: 'Normalization Attribute',
			labelWidth: 170,
			name: 'normAttribute',
			hidden: true,
			itemId: 'normAttribute'
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('area_units'),
			fieldLabel: 'Normalization attribute area units',
			name: 'normalizationAreaUnits',
			hidden: true,
			valueField: 'type',
			itemId: 'normalizationAreaUnits'
		}];

		this.buttons = [{
			text: 'Change Settings',
			itemId: 'normalize'
		}, {
			text: 'Back',
			itemId: 'back'
		}];
		this.callParent();

	}
})



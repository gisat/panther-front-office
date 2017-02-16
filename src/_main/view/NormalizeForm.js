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
			name: 'displayUnits',
			valueField: 'type',
			itemId: 'displayUnits',
			disabled: true
		}, {
			xtype: 'textfield',
			fieldLabel: 'Units of the source attribute',
			name: 'units',
			valueField: 'type',
			itemId: 'units',
			disabled: true
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('change_units'),
			fieldLabel: 'Change Units',
			name: 'normalizationUnits',
			valueField: 'type',
			itemId: 'normalizationUnits'
		}, {
			xtype: 'textfield', // TODO: Validate that it is Number.
			fieldLabel: 'Custom factor',
			name: 'customFactor',
			valueField: 'type',
			itemId: 'customFactor'
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup(this.formType == 'chart' ? 'normalization4chart' : 'normalization4chartlimited'),
			fieldLabel: 'Norm type',
			name: 'normType',
			valueField: 'type',
			itemId: 'normType'
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('area_units'),
			fieldLabel: 'Area units',
			name: 'areaUnits',
			hidden: true,
			valueField: 'type',
			itemId: 'areaUnits'
		}, {
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('attributeset2choose'),
			fieldLabel: 'Normalization Attr set',
			name: 'normAttributeSet',
			hidden: true,
			itemId: 'normAttributeSet'
		}, {
			xtype: 'pumacombo',
			store: this.attrStore,
			fieldLabel: 'Normalization Attribute',
			name: 'normAttribute',
			hidden: true,
			itemId: 'normAttribute'
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



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
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('normalization_units'),
			fieldLabel: 'Change Units',
			name: 'normalizationUnits',
			valueField: 'type',
			itemId: 'normalizationUnits'
		}, {
			xtype: 'textfield',
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
		}, {
			xtype: 'textfield',
			fieldLabel: 'Current result units of normalization: ',
			name: 'currentUnits',
			valueField: 'type',
			itemId: 'currentUnits',
			disabled: true
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



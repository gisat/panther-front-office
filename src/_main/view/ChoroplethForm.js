Ext.define('PumaMain.view.ChoroplethForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.choroplethform',
	frame: true,
	header: false,
	initComponent: function () {
		this.bodyStyle = {
			padding: '0px'
		}
		this.items = [{
			xtype: 'pumacombo',
			forChoro: 1,
			store: Ext.StoreMgr.lookup('classificationtype'),
			fieldLabel: polyglot.t('classType'),
			itemId: 'classType',
			name: 'classType',
			value: 'quantiles',
			valueField: 'type'
		}, {
			xtype: 'numberfield',
			fieldLabel: polyglot.t('numCategories'),
			name: 'numCategories',
			forChoro: 1,
			value: 5,
			minValue: 2,
			allowDecimals: false,
			itemId: 'numCategories'
		}
		]
		this.buttons = [{
			text: polyglot.t('apply'),
			itemId: 'apply'
		}, {
			text: polyglot.t('back'),
			itemId: 'back'
		}]
		this.callParent();

	}
})



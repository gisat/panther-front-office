Ext.define('PumaMain.view.ConfigForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.configform',
	autoScroll: true,
	frame: true,
	header: false,
	resizable: true,
	requires: ['Ext.ux.CheckColumn', 'PumaMain.view.AddAttributeTree', 'PumaMain.view.ChoroplethForm', 'PumaMain.view.AttributeGrid', 'Gisatlib.container.StoreContainer', 'PumaMain.view.NormalizeForm'],
	initComponent: function () {
		this.attrStore = Ext.create('Ext.data.Store', {
			data: [],
			model: 'Puma.model.MappedChartAttribute'
		});
		this.items = [{
			xtype: 'textfield',
			name: 'title',
			marginLeft: 5,
			width: 300,
			hidden: this.formType != 'chart',
			fieldLabel: polyglot.t('name')
		}, {
			xtype: 'pumacombo',
			marginLeft: 5,
			hidden: this.formType != 'chart',
			store: Ext.StoreMgr.lookup('charttype4chart'),
			fieldLabel: polyglot.t('type'),
			valueField: 'type',
			width: 300,
			name: 'type',
			itemId: 'type'
		},
			{
				xtype: 'storefield',
				itemId: 'attrs',
				name: 'attrs',
				hidden: true,
				store: this.attrStore
			}, {
				xtype: 'container',
				hidden: this.formType == 'chart',
				height: 350,
				itemId: 'attributecontainer',
				marginBottom: 30,
				helpId: 'test',
				layout: 'card',
				cls: 'attribute-container',
				items: [
					{
						xtype: 'attributegrid',
						formType: this.formType,
						store: this.attrStore
					}, {
						xtype: 'addattributetree'
					}, {
						xtype: 'normalizeform',
						cls: 'attribute-configuration',
						formType: this.formType
					}, {
						xtype: 'form',
						bodyStyle: {
							padding: '0px'
						},
						frame: true,
						items: [{
							xtype: 'pumacombo',
							store: Ext.StoreMgr.lookup('layers4outline'),
							valueField: 'atWithSymbology',
							fieldLabel: polyglot.t('layer'),
							name: 'featureLayer',
							width: 300
						}, {
							xtype: 'numberfield',
							minValue: 0,
							value: 70,
							maxValue: 100,
							fieldLabel: polyglot.t('opacity'),
							name: 'featureLayerOpacity',
							width: 300
						}]

					}, {
						xtype: 'choroplethform'
					}]
			}, {
				xtype: 'multislider',
				itemId: 'constrainFl',
				name: 'constrainFl',
				values: [0, this.featureLayers.length - 1],
				hidden: true,
				width: 500,
				useTips: {
					getText: function (thumb) {
						return thumb.slider.up('form').featureLayers[thumb.value].get('name')
					}
				},
				increment: 1,
				minValue: 0,
				maxValue: this.featureLayers.length - 1
			}, {
				xtype: 'fieldset',
				itemId: 'advancedfieldset',
				collapsible: true,
				collapsed: true,
				hidden: true,
				title: polyglot.t('advanced'),
				items: [{
					xtype: 'pumacombo',
					store: Ext.StoreMgr.lookup('periods4chart'),
					fieldLabel: polyglot.t('periods'),
					valueField: 'type',
					value: 'all',
					width: 500,
					name: 'periodsSettings',
					itemId: 'periodsSettings',
					hidden: true
				},{
					xtype: 'pumacombo',
					store: Ext.StoreMgr.lookup('stacking4chart'),
					fieldLabel: polyglot.t('stacking'),
					valueField: 'type',
					value: 'none',
					width: 350,
					name: 'stacking',
					itemId: 'stacking'
				}, {
					xtype: 'pumacombo',
					store: Ext.StoreMgr.lookup('aggregate4chart'),
					fieldLabel: polyglot.t('aggregate'),
					valueField: 'type',
					value: 'none',
					width: 350,
					name: 'aggregate',
					itemId: 'aggregate'
				}]
			}];
		this.buttons = [{
			text: polyglot.t('ok'),
			itemId: 'configurefinish'
		}];
		this.callParent();

	}
});


Ext.define('PumaMain.view.NormalizeForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.normalizeform',
	frame: true,
	header: true,
	title: 'Attribute configuration',
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
			fieldLabel: 'Attribute unit - original',
			labelWidth: 170,
			name: 'units',
			valueField: 'type',
			itemId: 'units',
			disabled: true
		}, {
			xtype: 'textfield',
			fieldLabel: 'Attribute unit - displayed',
			labelWidth: 170,
			name: 'displayUnits',
			valueField: 'type',
			itemId: 'displayUnits',
			disabled: true
		},{
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('change_units'),
			fieldLabel: 'Modify Displayed Units',
			labelWidth: 170,
			afterLabelTpl: new Ext.XTemplate(
				'<div class="form-label-help">',
					'<i class="form-label-help-button">i</i>',
					'<p>Modify units to be displayed in chart only in case you want to display the attribute in units other than those which are set as default for the attribute. e.g. default units are m2 and you want to display the values in km2. <br>',
					'Then the values will be multiplied by the Custom Factor (0,000001 in this case).</p>',
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
					'<p>The factor by which the default units of the attribute should be multiplied to get the units which will be displayed in this chart.</p>',
				'</div>'
			),
			name: 'customFactor',
			valueField: 'type',
			itemId: 'customFactor'
		}, {
			xtype: 'label',
			text: 'Normalization',
			cls: 'form-section-title'
		},{
			xtype: 'pumacombo',
			store: Ext.StoreMgr.lookup('normalization4chart'),
			fieldLabel: 'Normalization type',
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



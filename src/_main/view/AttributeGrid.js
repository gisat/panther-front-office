Ext.define('PumaMain.view.AttributeGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.attributegrid',
	colspan: 2,
	border: 0,
	autoScroll: true,
	header: false,
	requires: ['Ext.ux.CheckColumn', 'Ext.grid.plugin.CellEditing'],
	initComponent: function () {
		this.editing = Ext.create('Ext.grid.plugin.CellEditing');
		this.plugins = [this.editing];
		this.columns = [{
			xtype: 'checkcolumnwithheader',
			store: this.store,
			columnHeaderCheckbox: true,
			width: 40,
			menuDisabled: true,
			resizable: false,
			dataIndex: 'checked'
		}, {
			dataIndex: 'attrName',
			flex: 2,
			resizable: false,
			menuDisabled: true,
			text: polyglot.t("attribute"),
			tooltip: polyglot.t("attribute")
		}, {
			dataIndex: 'asName',
			flex: 2,
			resizable: false,
			menuDisabled: true,
			text: polyglot.t("attributeSet"),
			tooltip: polyglot.t("attributeSet")
		}, {
			dataIndex: 'attrType',
			flex: 1,
			resizable: false,
			menuDisabled: true,
			text: polyglot.t("type"),
			tooltip: polyglot.t("type"),
			renderer: function(value){
				return polyglot.t(value);
			}
		}, {
			dataIndex: 'asName',
			flex: 2,
			resizable: false,
			menuDisabled: true,
			text: polyglot.t('normalizationBase'),
			tooltip: polyglot.t('normalizationBase'),
			renderer: function (value, metadata, record) {
				var type = record.get('normType');
				var attrStore = Ext.StoreMgr.lookup('attribute');
				var attrSetStore = Ext.StoreMgr.lookup('attributeset');
				if (type == 'attribute') {
					var normAs = attrSetStore.getById(record.get('normAs'));
					var normAttr = attrStore.getById(record.get('normAttr'));
					if (!normAs || !normAttr) {
						return '';
					}
					var newVal = normAs.get('name') + '-' + normAttr.get('name');
					metadata.tdAttr = 'data-qtip="' + newVal + '"';
					return newVal
				}
				else if (type == 'attributeset') {
					var normAs = attrSetStore.getById(record.get('normAs'));
					if (!normAs) {
						return '';
					}
					var newVal = normAs.get('name');

					metadata.tdAttr = 'data-qtip="' + newVal + '"';
					return newVal
				}
				else return '';
			}
		}, {
			dataIndex: 'normType',
			flex: 2,
			resizable: false,
			menuDisabled: true,
			formType: this.formType,
			text: polyglot.t('normalization'),
			tooltip: polyglot.t('normalization'),
			renderer: function (value, metadata, record) {
				var store = Ext.StoreMgr.lookup('normalization4chart');
				var rec = store.findRecord('type', value);
				return rec ? rec.get('name') : '';
			}
		}, {
			dataIndex: 'units',
			flex: 1,
			resizable: false,
			menuDisabled: true,
			formType: this.formType,
			text: polyglot.t('units'),
			tooltip: polyglot.t('units')
		}, {
			dataIndex: 'displayUnits',
			flex: 1,
			resizable: false,
			menuDisabled: true,
			formType: this.formType,
			text: polyglot.t('displayedUnits'),
			tooltip: polyglot.t('displayedUnits'),
			renderer: function (value, metadata, record) {
				return record.get('displayUnits') || record.get('units');
			}
		}, {
			dataIndex: 'classType',
			flex: 2,
			hidden: this.formType != 'layers',
			resizable: false,
			menuDisabled: true,
			text: polyglot.t('classification'),
			tooltip: polyglot.t('classification'),
			renderer: function (value, metadata, record) {
				value = value || 'quantiles';
				var store = Ext.StoreMgr.lookup('classificationtype');
				var rec = store.findRecord('type', value);
				return rec ? rec.get('name') : '';
			}
		}, {
			dataIndex: 'numCategories',
			flex: 1,
			hidden: this.formType != 'layers',
			resizable: false,
			menuDisabled: true,
			text: polyglot.t('cat'),
			tooltip: polyglot.t('cat'),
			renderer: function (value, metadata, record) {
				value = value || 5;
				return value;
			}
		}, {
			dataIndex: 'name',
			flex: 3,
			hidden: this.formType != 'layers',
			resizable: false,
			menuDisabled: true,
			text: polyglot.t('name'),
			tooltip: polyglot.t('name'),
			field: {
				type: 'textfield'
			}
		}];
		this.tbar = [{
			xtype: 'button',
			itemId: 'add',
			text: polyglot.t('add')
		}, {
			xtype: 'button',
			itemId: 'remove',
			text: polyglot.t('remove'),
		}, {
			xtype: 'button',
			//disabled: this.formType=='filters',
			itemId: 'normalize',
			text: polyglot.t('setting')
		}, {
			xtype: 'button',
			hidden: this.formType != 'layers',
			itemId: 'choroplethparams',
			text: polyglot.t('choroplethParams')
		}];
		this.viewConfig = {
			plugins: {
				ptype: 'gridviewdragdrop'
			}
		};
		this.callParent();

	}
});



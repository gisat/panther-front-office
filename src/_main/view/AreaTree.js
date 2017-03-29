Ext.define('PumaMain.view.AreaTree', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.areatree',

	// itemId: 'areatree',
	// cls: 'areaTreeSelection',
	// helpId: 'TreeofanalyticalunitsAREAS',

	collapsed: true,
	title: Config.basicTexts.areasSectionName,
	selModel: {
		mode: 'MULTI'
	},
	rootVisible: false,
	displayField: 'name',
	height: 340,
	//,maxHeight: 500

	requires: ['Ext.ux.CheckColumn', 'Ext.grid.plugin.CellEditing'],
	initComponent: function () {
		this.store = Ext.StoreMgr.lookup('area');

		this.callParent();
	}
});
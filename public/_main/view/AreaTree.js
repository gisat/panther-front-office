Ext.define('PumaMain.view.AreaTree', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.areatree',

	// itemId: 'areatree',
	// cls: 'areaTreeSelection',
	// helpId: 'TreeofanalyticalunitsAREAS',

	collapsed: !Config.toggles.useTopToolbar,
	selModel: {
		mode: 'MULTI'
	},
	rootVisible: false,
	displayField: 'name',

	requires: ['Ext.ux.CheckColumn', 'Ext.grid.plugin.CellEditing'],
	initComponent: function () {
		this.store = Ext.StoreMgr.lookup('area');

		this.callParent();
	}
});
Ext.define('PumaMain.view.CommonMngGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.commonmnggrid',
    autoScroll: true,
    requires: [],
    initComponent: function() {
        var me = this;

        var actionItems = [
            {
                icon: 'images/icons/remove-16.png', // Use a URL in the icon config
                tooltip: polyglot.t('remove'),
                width: 16,
                height: 16,
                handler: function(grid, rowIndex, colIndex, item, e, record) {
                    me.fireEvent('recdeleted', me, record)
                }
            }];

        this.columns = [{
                dataIndex: 'name',
                flex: 1,
                resizable: false,
                menuDisabled: true,
                sortable: false,
                text: polyglot.t('name'),
            },
            {
                xtype: 'actioncolumn',
                width: 30,
                items: actionItems
            }
        ]
        this.callParent();

        this.addEvents('recmoved', 'recdeleted','urlopen');
    }
})



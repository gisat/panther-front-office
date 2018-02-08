Ext.define('Puma.view.CommonGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.commongrid',
    requires: ['Ext.ux.grid.FiltersFeature'],
    padding: 10,
    frame: true,
    initComponent: function() {


        var filtersCfg = {
            ftype: 'filters',
            local: true,
            filters: [{
                    type: 'string',
                    dataIndex: 'name'
                }]
        };

        if (!this.disableFilter) {
            this.features = [filtersCfg];
        }
        this.columns = this.columns || [{
            dataIndex: 'name',
            header: polyglot.t('name'),
            flex: 1
        }]
        this.buttons = this.buttons || [];
        this.buttons = Ext.Array.merge(this.buttons,[{
                text: polyglot.t('delete'),
                itemId: 'deletebtn',
                disabled: true,
            }, {
                text: polyglot.t('createCopy'),
                disabled: true,
                itemId: 'copybtn'
            }, {
                text: polyglot.t('createBlank'),
                itemId: 'createbtn'
            }])
        this.selModel = {
            allowDeselect: true
        }
        this.callParent();
    }
});



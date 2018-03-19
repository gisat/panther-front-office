Ext.define('PumaMain.view.ChartBar', {
    extend: 'Ext.container.Container',
    alias: 'widget.chartbar',
    requires: ['PumaMain.view.ScreenshotView'],
    autoScroll: true,
    //overflowY: 'scroll',
    height:"100%",
    initComponent: function() {

        this.layout = {
            type: 'accordion',
            multi: true,
            fill: false
        };
        this.items = [
            {
                xtype: 'panel',
                cls: 'chart-panel panel-snapshots',
                collapsed: false,
                layout: 'fit',
                iconCls: 'cmptype-snapshot',
                collapseLeft: true,
                //hidden: true,
                itemId: 'screenshotpanel',
                helpId: 'Snapshots',
                items: [{
                    xtype: 'screenshotview'
                }],
                cfgType: 'screenshots',  
                height: 400,
                title: polyglot.t('snapshots')
            }
        ];
        this.callParent();
    }
});



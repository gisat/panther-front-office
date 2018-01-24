Ext.define('PumaMain.view.LayerMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.layermenu',
    initComponent: function() {
        
        this.items = [{
            text: polyglot.t('opacity'),
            hidden: this.layerName==null,
            itemId: 'opacity'
        },{
            text: polyglot.t('config'),
            hidden: this.bindChart==null,
            itemId: 'config'
        },{
            text: polyglot.t('remove'),
            hidden: this.bindChart==null,
            itemId: 'remove'
        }, {
            text: polyglot.t('exportPng'),
            hidden: this.map==null,
            itemId: 'exportpng'
        }, {
            text: polyglot.t('URL'),
            hidden: this.map==null,
            itemId: 'url'
        }]
        this.callParent();
        
    }
})


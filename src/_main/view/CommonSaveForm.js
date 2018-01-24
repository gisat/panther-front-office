Ext.define('PumaMain.view.CommonSaveForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.commonsaveform',
    frame: true,
    initComponent: function() {
        this.items = [{
            xtype: 'textfield',
            fieldLabel: polyglot.t('name'),
            name: 'name',
            itemId: 'name',
            allowBlank: false
        }]
        this.buttons = [{
                text: polyglot.t('save'),
                itemId: 'save'
            }]
        this.callParent();

    }
})


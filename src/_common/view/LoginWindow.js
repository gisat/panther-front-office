Ext.define('Puma.view.LoginWindow' ,{
    extend: 'Ext.window.Window',
    
    alias : 'widget.loginwindow',
    requires: ['Ext.button.Button','Ext.form.field.Display','Ext.form.field.Text'],
    padding: 5,

    initComponent: function() {
        
        var me = this;
        this.form = {
            xtype: 'form',
            frame: true,
            padding: 10,
            items: [{
                    xtype: 'textfield',
                    fieldLabel: polyglot.t('user'),
                    margin: '5 0',
                    itemId: 'username'
                }, {
                    xtype: 'textfield',
                    fieldLabel: polyglot.t('password'),
                    inputType: 'password',
                    margin: '5 0',
                    itemId: 'password'
                }],
                buttons: [{
                    xtype: 'button',
                    text: polyglot.t('login'),
                    margin: '5 0',
                    itemId: 'loginbtn'
                }, {
                    xtype: 'button',
                    text: polyglot.t('cancel'),
                    margin: '5 0',
                    handler: function() {
                        me.close();
                    }
                }]
        }
        this.items = [this.form]
        this.callParent();
    }
})



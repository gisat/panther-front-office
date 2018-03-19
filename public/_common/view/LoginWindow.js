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
            padding: 40,
            items: [{
                    xtype: 'textfield',
                    fieldLabel: " ",
                    componentCls: "login-username",
                    labelPad: 0,
                    labelSeparator: "",
                    labelAlign: "right",
                    labelWidth: 30,
                    width: 300,
                    itemId: 'username',
                    emptyText: 'Username or email'
                }, {
                    xtype: 'textfield',
                    fieldLabel: " ",
                    componentCls: "login-password",
                    labelPad: 0,
                    labelSeparator: "",
                    labelAlign: "right",
                    labelWidth: 30,
				    width: 300,
                    margin: "10 0",
                    inputType: 'password',
                    itemId: 'password',
				    emptyText: 'Password'
                }],
                buttons: [{
                    xtype: 'button',
                    text: polyglot.t('login'),
                    margin: '5 5',
                    height: 36,
                    itemId: 'loginbtn'
                }, {
                    xtype: 'button',
                    text: polyglot.t('cancel'),
                    margin: '5 2',
					height: 36,
                    handler: function() {
                        me.close();
                        $("#hideAllExceptLogin").css("display","none");
                    }
                }]
        }
        this.items = [this.form]
        this.callParent();
    }
})



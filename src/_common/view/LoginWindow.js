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
                    fieldLabel: 'User',
                    margin: '5 0',
                    itemId: 'username'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Password',
                    inputType: 'password',
                    margin: '5 0',
                    itemId: 'password'
                }],
                buttons: [{
                    xtype: 'button',
                    text: 'Login',
                    margin: '5 0',
                    itemId: 'loginbtn'
                }, {
                    xtype: 'button',
                    text: 'Cancel',
                    margin: '5 0',
                    handler: function() {
                        me.close();
                    }
                }],

        };
        this.info = {
			xtype: 'component',
			itemId: 'logininfolink',
            cls: 'logininfolink',
			html: '<a href="#">Forgotten password?</a>',
		};
        this.infoContent = {
			xtype: 'component',
			itemId: 'logininfocontent',
			cls: 'logininfocontent',
            hidden: true,
			html: '<span>Contact us via email ' + Config.contactEmail + '</span>'
		};
        this.items = [this.form];

        if (Config.toggles.isSnow){
			this.items.push(this.info, this.infoContent);
			this.addEvents({
				logininfoclick: true
			});
			$('.logininfolink a').live('click',function() {
				me.fireEvent('logininfoclick');
				return false;
			});
        }
        this.callParent();
    }
});



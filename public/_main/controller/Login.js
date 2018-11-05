Ext.define('PumaMain.controller.Login',{
    extend: 'Ext.app.Controller',
    views: [],
    requires: [],
  
    init: function() {
        var me = this;
        // this.getApplication().on('login',function() {
        //     me.onLogin();
        // })
        //
        // Observer.notify('Login#init');
    },
        
    onLogin: function() {
        var isAdmin = false;
        var isUser = false;
        var userId = null;
        if (Config.auth) {
            isUser = true;
            userId = Config.auth.userId;
            $("#header .login").addClass("logged");
			$("#header .signup").addClass("logout");
        } else {
            if(Config.toggles.onlyLoggedIn) {
                window.location = Config.notAuthenticatedUrl
            }
			$("#header .login").removeClass("logged");
			$("#header .signup").removeClass("logout");
        }
        if ((Config.auth && Config.auth.groups && Ext.Array.contains(Config.auth.groups, 'admingroup')) || (Config.auth && Config.auth.userId === 1)) {
            Config.auth.isAdmin = true;
            isAdmin = true;
        }

        this.reloadStores();
        var saveVis = Ext.ComponentQuery.query('#savevisualization')[0];
		window.Stores.notify('user#changed', {
		    isLoggedIn: isUser,
            isAdmin: isAdmin,
            userId : userId,
            groups: Config.auth && Config.auth.groups || []
        });
        if (!saveVis) return;
        var manageVis = Ext.ComponentQuery.query('#managevisualization')[0];
        var saveView = Ext.ComponentQuery.query('#savedataview')[0];
        var manageView = Ext.ComponentQuery.query('#managedataview')[0];
        var shareView = Ext.ComponentQuery.query('#sharedataview')[0];
        saveVis.setVisible(isUser);
        manageVis.setVisible(isUser);
        saveView.setVisible(isUser);
        manageView.setVisible(isUser);
        shareView.setVisible(isUser);
        // Ext.StoreMgr.lookup('dataview').load();
        Observer.notify('user#onLogin');
    },

    reloadStores: function() {
        var stores = ['location', 'theme', 'dataset', 'topic'];
        stores.forEach(function(store){
			Ext.StoreMgr.lookup(store).load();
        });
    }
})



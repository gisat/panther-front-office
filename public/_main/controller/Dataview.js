Ext.define('PumaMain.controller.Dataview', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: [],
    init: function() {
        this.colorBackComp = {
            'ff0000':'ff4c39',
            '00ff00':'34ea81',
            '0000ff':'39b0ff',
            'ffff00':'ffde58',
            '00ffff':'5c6d7e',
            'ff00ff':'d97dff'
        }

        Observer.notify('Dataview#init');
    },
        
        
    checkLoading: function() {
        var runner = new Ext.util.TaskRunner();
        var task = null;
        var me = this;
        task = runner.start({
            run: function() {
                var loading = false;
                Ext.StoreMgr.each(function(store) {
                    if (store.isLoading()) {
                        loading = true;
                        return false;
                    }
                })
                if (!loading) {
                    me.onLoadingFinished();
                    runner.destroy();
                    Observer.notify('Dataview#checkLoading Loading finished');
                }
            },
            interval: 1000
        })
    },

    onLoadingFinished: function(data) {
        if (data){
            console.log(`##### Ext Dataview#onLoadingfinished dataview: ${data}`);
            Config.cfg = data.data;
			Config.dataviewId = data.key;
			this.getController('ViewMng').onDataviewLoad();
        }
    },
});



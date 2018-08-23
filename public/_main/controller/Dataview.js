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

    onLoadingFinished: function() {
        var me = this;
        if (Config.dataviewId) {
            Ext.Ajax.request({
                url: Config.url + 'rest/dataview/'+Config.dataviewId,
                scope: this,
                method: 'GET',
                success: function(response) {
					var respText = response.responseText
                    for (var oldColor in this.colorBackComp) {
                        respText = respText.replace(oldColor,this.colorBackComp[oldColor]);
                    }
                    
                    
                    var cfg = JSON.parse(respText).data;
                    if (!cfg.length) {
                        alert(polyglot.t('noSuchDataview'));
                        return;
                    }
                    Config.cfg = cfg[0].conf;
                    console.log(`#### cfg[0]`, cfg[0]);
					me.getController('ViewMng').onDataviewLoad();
                    window.Stores.notify(`ActiveViewLoaded`, cfg[0]);
				},
                failure: function(response) {
					$("#loading-screen").css("display", "none");
				}
            })
        }
    },
    
    
    onDatasetLoad: function() {
        var recs = Ext.StoreMgr.lookup('activedataset').getRange();
        var confs = [];
        for (var i=0;i<recs.length;i++) {
            confs.push({text:recs[i].get('name'),objId:recs[i].get('_id'),allowDepress:false})
        }
        var container = Ext.ComponentQuery.query('initialbar #datasetcontainer')[0]
        container.add(confs);
        var search = window.location.search.split('?')[1];
        var id = search ? search.split('=')[1] : null;
        if (id) {
            Ext.Ajax.request({
            url: Config.url + 'api/urlview/getView',
            params: {_id: id},
            scope: this,
            //method: 'GET',
            success: function(response) {
                var cfg = JSON.parse(response.responseText).data;
                Config.cfg = cfg;
                var datasetBtn = Ext.ComponentQuery.query('initialbar #datasetcontainer button[objId='+cfg.dataset+']')[0];
                datasetBtn.toggle();
                this.getController('LocationTheme').onDatasetChange();
            }
        })
        }
    },
    onThemeLoad: function() {
    }
        
});



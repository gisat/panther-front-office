Ext.define('PumaMain.controller.UserPolygon', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: [],
    init: function() {
        this.control({
            'initialbar #addpolygonbtn': {
                toggle: this.onAddPolygonToggle
            },
            'initialbar #addpointbtn': {
                toggle: this.onAddPointToggle
            },
            'initialbar #deleteareabtn': {
                toggle: this.onDeleteAreaToggle
            }
        })

        Observer.notify('UserPolygon#init');
    },
    onAddPolygonToggle: function(btn, toggled) {

    },
    onAddPointToggle: function(btn, toggled) {

    },
    onDeleteAreaToggle: function(btn, toggled) {

    },
    onFeatureDragged: function(feature) {
        var format = new OpenLayers.Format.WKT();
        var geom = format.write(feature);
        //console.log(feature.gid)
        Ext.Ajax.request({
            url: Config.url + 'api/userpolygon/userPolygon',
            params: {
                geom: geom,
                id: feature.gid,
                method: 'update'
            },
            feature: feature,
            scope: this,
            success: this.onFeatureDraggedCallback
        })
    },
    onFeatureDraggedCallback: function(response) {
        var treeBtn = Ext.ComponentQuery.query('initialbar #treecontainer button[pressed=true]')[0];
        var year = Ext.ComponentQuery.query('initialbar #yearcontainer button[pressed=true]')[0].objId;
        var theme = Ext.ComponentQuery.query('initialbar #themecontainer button[pressed=true]')[0].objId;
        if (!treeBtn || treeBtn.objId != -1)
            return;
        var me = this;
        var themeObj = Ext.StoreMgr.lookup('theme').getById(theme);
        var analysis = themeObj.get('analysis');
        this.getController('LocationTheme').checkUserPolygons([year], analysis, function() {
            me.getController('Chart').reconfigureAll();
            var store = Ext.StoreMgr.lookup('layers');
            var root = store.getRootNode();
            root.cascadeBy(function(node) {
                var at = node.get('at');
                if (at==-1 || node.get('layerName') == 'areaoutline') {
                    node.get('layer').redraw();
                }

            })
        })
    }
})



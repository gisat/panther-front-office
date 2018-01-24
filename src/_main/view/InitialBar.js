Ext.define('PumaMain.view.InitialBar', {
    extend: 'Ext.container.Container',
    alias: 'widget.initialbar',
    requires: ['Ext.picker.Color'],
    initComponent: function() {


        this.layout = {
            type: 'vbox',
            align: 'stretch'
        }
        this.items = [{
                xtype: 'container',
                hidden: true,
                height: 24,
                itemId: 'focuscontainer',
                margin: '0 0 5 0',
                defaultType: 'button',
                layout: {
                    type: 'hbox',
                    pack: 'left'
                },
                items: [{
                    xtype: 'displayfield',
                    width: 80,
                    value: polyglot.t('focus')
                }
//                ,{
//                    text: 'Global',
//                    itemId: 'global',
//                    allowDepress: false
//                },{
//                    text: 'Regional',
//                    allowDepress: false,
//                    itemId: 'regional'
//                }
            ],
                defaults: {
                    cls: 'focusbutton',
                    toggleGroup: 'focus',
                    margin: '0 3',
                    height: 24
                }
            },{
                xtype: 'container',
                height: 24,
                itemId: 'datasetcontainer',
                margin: '0 0 5 0',
                defaultType: 'button',
                layout: {
                    type: 'hbox',
                    pack: 'left'
                },
                items: [{
                    xtype: 'displayfield',
                    width: 80,
                    value: polyglot.t('dataset')
                }
//                ,{
//                    text: 'Global',
//                    itemId: 'global',
//                    allowDepress: false
//                },{
//                    text: 'Regional',
//                    allowDepress: false,
//                    itemId: 'regional'
//                }
            ],
                defaults: {
                    cls: 'datasetbutton',
                    toggleGroup: 'dataset',
                    margin: '0 3',
                    height: 24
                }
            },{
                xtype: 'container',
                itemId: 'themecontainer',
                height: 24,
                margin: '0 0 5 0',
                defaultType: 'button',
                layout: {
                    type: 'hbox',
                    pack: 'left'
                },
                defaults: {
                    cls: 'themebutton',
                    toggleGroup: 'theme',
                    margin: '0 3',
                    height: 24
                },
                items: [{
                    xtype: 'displayfield',
                    width: 80,
                    value: polyglot.t('theme')
                }]
            },{
                xtype: 'container',
                itemId: 'yearcontainer',
                margin: '0 0 5 0',
                height: 24,
                defaultType: 'button',
                layout: {
                    type: 'hbox',
                    pack: 'left'
                },
                defaults: {
                    cls: 'yearbutton',
                    enableToggle: true,
                    //toggleGroup: 'year',
                    margin: '0 3',
                    height: 24
                },
                items: [{
                    xtype: 'displayfield',
                    width: 80,
                    value: polyglot.t('year')
                }]
            },{
                xtype: 'container',
                itemId: 'visualizationcontainer',
                margin: '0 0 5 0',
                height: 24,
                defaultType: 'button',
                layout: {
                    type: 'hbox',
                    pack: 'left'
                },
                defaults: {
                    cls: 'visualizationbutton',
                    toggleGroup: 'visualization',
                    margin: '0 3',
                    height: 24
                },
                items: [{
                    xtype: 'displayfield',
                    width: 80,
                    value: polyglot.t('visualization')
                }]
            },{
                xtype: 'toolbar',
//                layout: {
//                    type: 'hbox',
//                    pack: 'center'
//                },
                items: [{
                    xtype: 'colorpicker',
                    itemId: 'selectcolorpicker',
                    height: 20,
                    width: 120,
                    value: 'ff4c39',
                    colors: ['ff4c39', '34ea81', '39b0ff', 'ffde58', '5c6d7e', 'd97dff']
                },{
                        xtype: 'button',
                        itemId: 'selectinmapbtn',
                        enableToggle: true,
                        toggleGroup: 'mapmodal',
                        text: polyglot.t('selectInMap')
                },{
                        xtype: 'button',
                        itemId: 'hoverbtn',
                        enableToggle: true,
                        text: polyglot.t('hover')
                },{
                xtype: 'button',
                itemId: 'zoomselectedbtn',
                text: polyglot.t('zoomSelected')
            },{
                xtype: 'button',
                itemId: 'measurelinebtn',
                enableToggle: true,
                toggleGroup: 'mapmodal',
                text: polyglot.t('measureLine')
            },{
                xtype: 'button',
                itemId: 'measurepolygonbtn',
                enableToggle: true,
                toggleGroup: 'mapmodal',
                text: polyglot.t('measurePolygon')
            },{
                xtype: 'button',
                itemId: 'multiplemapsbtn',
                enableToggle: true,
                disabled: true,
                text: polyglot.t('multipleMaps')
            }]},{
                xtype: 'toolbar',
                items: [
            
//            {
//                xtype: 'pumacombo',
//                store: Ext.StoreMgr.lookup('visualization'),
//                itemId: 'visualizationcombo'
//            }, {
//                xtype: 'button',
//                itemId: 'loadvisbtn',
//                text: 'Load'
//            }, {
//                xtype: 'button',
//                itemId: 'savevisbtn',
//                text: 'Save'
//            }, 
            {
                xtype: 'button',
                itemId: 'visualizationsbtn',
                text: polyglot.t('visualizations')
            },
//            {
//                xtype: 'button',
//                itemId: 'viewsbtn',
//                text: 'Views'
//            },
//            {
//                xtype: 'button',
//                itemId: 'aggregatesbtn',
//                text: 'Aggregates'
//            },
//            {
//                xtype: 'button',
//                itemId: 'useaggregatebtn',
//                enableToggle: true,
//                text: 'Use aggregate'
//            },
            {
                xtype: 'button',
                itemId: 'chartbtn',
                text: polyglot.t('addChart')
            },{
                xtype: 'button',
                itemId: 'savevisbtn',
                text: polyglot.t('save')
            }]},{
                xtype: 'toolbar',
                items: [
//            {
//                xtype: 'button',
//                enableToggle: true,
//                itemId: 'addpolygonbtn',
//                toggleGroup: 'mapmodal',
//                hidden: true,
//                text: 'P'
//            },{
//                xtype: 'button',
//                itemId: 'addpointbtn',
//                enableToggle: true,
//                toggleGroup: 'mapmodal',
//                hidden: true,
//                text: 'C'
//            },{
//                xtype: 'button',
//                itemId: 'deleteareabtn',
//                enableToggle: true,
//                toggleGroup: 'mapmodal',
//                hidden: true,
//                text: 'D'
//            },
//            {
//                xtype: 'button',
//                itemId: 'featureinfobtn',
//                enableToggle: true,
//                toggleGroup: 'mapmodal',
//                text: '?'
//            },
//            {
//                xtype: 'button',
//                itemId: 'exportallpdfbtn',
//                text: 'Export PDF'
//            },
            {
                xtype: 'button',
                itemId: 'exportallzipbtn',
                text: polyglot.t('exportZip')
            },
            {
                xtype: 'button',
                itemId: 'urlbtn',
                text: polyglot.t('URL')
            },
            {
                xtype: 'button',
                itemId: 'helpbtn',
                enableToggle: true,
                text: polyglot.t('help')
            },
            
            ]
        }]
            

        this.callParent();
    }
});



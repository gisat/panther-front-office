Ext.define('PumaMain.view.LayerPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.layerpanel',
    requires: ['Ext.ux.RowExpander'],
    cls: 'layerpanel',
    initComponent: function() {

        var me = this;
        this.tabBar = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {flex: 1}
        };

        this.items = [
            {
                xtype: 'treepanel',
                itemId: 'layerpanel',
                id: 'layeravailablepanel',
                helpId: 'Availablelayers',
                hideHeaders: true,
                store: Ext.StoreMgr.lookup('layers'),
                displayField: 'name',
                rootVisible: false,
                title: 'Layers available',
                border: true,
                viewConfig: {
                    autoScroll: false,
                    overflowY: 'auto',
                    getRowClass: function(rec) {
                        return rec.get('type')=='topiclayer' ? 'has-metadata' : '';
                    }
                },
                columns: [{
                        xtype: 'treecolumn',
                        dataIndex: 'name',
                        sortable: false,
                        menuDisabled: true,
                        flex: 1,
                        renderer : function(value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        },
                        header: 'Name'
                    }
                ],
                style: {
                    borderRadius: '0px'
                }
            },

            {
                xtype: 'grid',
                itemId: 'layerselectedpanel',
                helpId: 'Selectedlayers',
                hideHeaders: true,
                id: 'layerselectedpanel',
                store: Ext.StoreMgr.lookup('selectedlayers'),
                viewConfig: {
                    plugins: {ptype: 'gridviewdragdrop'}
                },
                displayField: 'name',
                title: 'Layers selected',
                bodyCls: 'layers-selected',
                border: true,
                columns: [
                    {
                        dataIndex: 'name',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true,
                        renderer : function(value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        },
                        header: 'Name'
                    }
                    , {
                        xtype: 'actioncolumn',
                        sortable: false,
                        menuDisabled: true,
                        width: 65,
                        items: [
                            {
                                icon: 'images/icons/opacity.png', // Use a URL in the icon config
                                tooltip: 'Opacity',
                                helpId: 'Settinglayersopacity',
                                width: 16,
                                height: 16,
                                handler: function(grid, rowIndex, colIndex,item,e,record) {
                                    me.fireEvent('layeropacity',me,record)
                                }
                            },{
                                icon: 'images/icons/info.png', // Use a URL in the icon config
                                tooltip: 'Metadata', 
                                width: 16,
                                height: 16,
                                getClass: function(v,metadata,rec) {
                                    
                                    if (rec.get('type')!='topiclayer') {
                                        return 'invisible'
                                    }
                                },
                                handler: function(grid, rowIndex, colIndex,item,e,record) {
                                    me.fireEvent('showmetadata',me,record)
                                }
                            }
                            ,{
                                icon: 'images/icons/legend.png', // Use a URL in the icon config
                                tooltip: 'Open Legend', 
                                width: 16,
                                height: 16,
                                getClass: function(v,metadata,rec) {
                                    
                                    if (rec.get('type')!='chartlayer' && rec.get('type')!='topiclayer') {
                                        return 'invisible'
                                    }
                                    if (rec.get('legend')) {
                                        return 'invisiblecomplete';
                                    }
                                },
                                handler: function(grid, rowIndex, colIndex,item,e,record) {
                                    me.fireEvent('layerlegend',me,record,true)
                                }
                            }
                            
                            ,{
                                icon: 'images/icons/legend-active.png', // Use a URL in the icon config
                                tooltip: 'Close legend', 
                                width: 16,
                                height: 16,
                                getClass: function(v,metadata,rec) {
                                    
                                    if (rec.get('type')!='chartlayer' && rec.get('type')!='topiclayer') {
                                        return 'invisible'
                                    }
                                    if (!rec.get('legend')) {
                                        return 'invisiblecomplete';
                                    }
                                },
                                handler: function(grid, rowIndex, colIndex,item,e,record) {
                                    me.fireEvent('layerlegend',me,record,false)
                                }
                            }
                        ]
                    }
                    ],
                style: {
                    borderRadius: '0px'
                }
            }
        ];
        
        this.callParent();
        this.query('#layerselectedpanel')[0].on('afterrender',function() {
            Ext.get('layerselectedpanel').on('click',function(e,dom) {
                var el = Ext.get(dom);
                var panel = Ext.ComponentQuery.query('#layerselectedpanel')[0]
                var rec = panel.getView().getRecord(el.up('.x-grid-row'))
                var cls = el.getAttribute('class');
                var name = 'layeropacity';
                if (cls.search('legend')>-1) {
                    name = 'layerlegend';
                    el.toggleCls('checked')
                }
                else if (cls.search('metadata')>-1) {
                    name = 'showmetadata'
                }
                this.fireEvent(name,this,rec,el);
                
            },this,{delegate:'.layertool'})
        
          
            
            
        },this);

        this.query('#layerpanel')[0].on('afterrender',function() {
              Ext.get('layeravailablepanel').on('click',function(e,dom) {
                var el = Ext.get(dom);
                var panel = Ext.ComponentQuery.query('#layerpanel')[0]
                var rec = panel.getView().getRecord(el.up('.x-grid-row'))
                this.fireEvent('showmetadata',this,rec,el);
                
            },this,{delegate:'.x-tree-icon-leaf'})    
        },this);
        
        this.addEvents('choroplethreconfigure','choroplethremove','layerremove','layeropacity','layerup','layerdown','checkchange','showmetadata','layerlegend');
    }
})



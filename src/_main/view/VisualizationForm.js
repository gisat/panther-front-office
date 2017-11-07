Ext.define('PumaMain.view.VisualizationForm', {
    extend: 'Puma.view.container.Common',
    alias: 'widget.visualizationform',
    requires: ['Puma.view.CommonForm', 'Puma.view.CommonGrid', 'Puma.view.form.DefaultComboBox', 'Gisatlib.form.HiddenStoreField', 'Puma.model.ColumnMap', 'Puma.model.Column'],
    padding: 5,
    initComponent: function() {
        
        

        var grid = Ext.widget('commongrid', {
            width: 450,
            //disabled: true,
            itemId: 'visualizationgrid',
            margin: '0 10 0 0',
            disableFilter: true,
            title: polyglot.t('visualizations'),
            columns: [{
                    dataIndex: 'name',
                    flex: 1,
                    header: 'Name'
                }],
            selModel: {
                allowDeselect: true
            },
            store: Ext.StoreMgr.lookup('visualization4window')
        })

        var form = Ext.widget('commonform', {
            title: polyglot.t('visu'),
            model: 'Visualization',
            itemId: 'layerrefform',
            width: 300,
            items: [{
                    xtype: 'textfield',
                    name: 'name',
                    allowBlank: false,
                    fieldLabel: polyglot.t('name')
                },{
                    xtype: 'hiddenfield',
                    name: 'theme',
                    value: this.theme
                }
                  
            ]
        })

        

        this.items = [grid, form];
        this.callParent();
        
    }
        

    });



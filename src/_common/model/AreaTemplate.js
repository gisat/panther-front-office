Ext.define('Puma.model.AreaTemplate', {
    extend: 'Ext.data.Model',
    fields: [

    '_id','name','justVisualization','active','symbologies','topic','layerGroup'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url : Config.url+'/rest/areatemplate',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});



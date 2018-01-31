Ext.define('Puma.model.MappedChartAttribute', {
    extend: 'Ext.data.Model',
    fields: [
		
		// ostatni/puvodni
		'as','attr','normType','normAs','normAttr','normYear','normalizationUnits','customFactor','attrName',
		'attrNameNormalized','asName','checked','numCategories','classType', 'units', 'displayUnits', 'areaUnits',
		'zeroesAsNull','name','attrType',
		{
			name: 'attrName',
			convert: function(value,record) {
				var attrStore = Ext.StoreMgr.lookup('attribute');
				var attr = attrStore.getById(record.get('attr'));
				return attr ? attr.get('name') : "";
			}
		},
		{
			name: 'asName',
			convert: function(value,record) {
				var attrSetStore = Ext.StoreMgr.lookup('attributeset');
				var attrSet = attrSetStore.getById(record.get('as'));
				return attrSet ? attrSet.get('name') : "";
			}
		},
		{
			name: 'units',
			convert: function(value, record) {
				var attrStore = Ext.StoreMgr.lookup('attribute');
				var attr = attrStore.getById(record.get('attr'));
				return attr ? attr.get('units') : "";
			}
		},
		{
			name: 'attrType',
			convert: function(value,record) {
				var attrStore = Ext.StoreMgr.lookup('attribute');
				var attr = attrStore.getById(record.get('attr'));
				return attr ? attr.get('type') : "";
			}
		},


		// AddAttribute
		'topic',
		{
			name: 'treeNodeText',
			convert: function(value, record) {
				if(record.get('attr')) return record.get('attrName');
				else if(record.get('as')) return record.get('asName');
				else if(record.get('topic')){
					var topicStore = Ext.StoreMgr.lookup('topic');
					var topic = topicStore.getById(record.get('topic'));
					return topic ? topic.get('name') : "###";
				}
			}
		}

	
	],
    idProperty: '_id',
    proxy: 'memory'
});



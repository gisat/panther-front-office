Ext.define('PumaMain.view.MapTools', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.maptools',
    columns: 4,
    helpId: 'Maptools',
    initComponent: function() { 
        this.defaults = {
            height: 90,
            width: 60
        };
        this.layout = {
            type: 'table',
            columns: 4
        };
        var selectionButton = {
			xtype: 'button',
			enableToggle: true,
			itemId: 'hoverbtn',
			helpId: 'Selectiononhover',
			text: polyglot.t('hover'),
			iconAlign: 'top',
			icon: 'images/icons/tools-hover.png',
			cls: 'custom-button btn-map-tool btn-tool-hover',
			scale: 'large'
		};
		if (Config.toggles.useTopToolbar) {
			selectionButton = {
				xtype: 'button',
				enableToggle: true,
				itemId: 'selectinmapbtn',
				helpId: 'Selectingunitsinmap',
				text: polyglot.t('selectInMap'),
				iconAlign: 'top',
				icon: 'images/new/map-select.png',
				cls: 'custom-button btn-map-tool btn-tool-select',
				scale: 'large'
			};
		}
        this.items = [selectionButton,{
            xtype: 'button',
            itemId: 'zoomselectedbtn',
            helpId: 'Zoomingtoselectedunits',
            text: polyglot.t('zoomSelected'),
            iconAlign: 'top',
            icon: 'images/icons/tools-zoom.png',
            cls: 'custom-button btn-map-tool btn-tool-zoom-selected',
            scale: 'large'
        },{
            xtype: 'button',
            enableToggle: true,
            helpId: 'Measuringdistance',
            toggleGroup: 'mapmodal',
            itemId: 'measurelinebtn',
            text: polyglot.t('measureLine'),
            iconAlign: 'top',
            icon: 'images/icons/tools-measure-line.png',
            cls: 'custom-button btn-map-tool btn-tool-measure-line',
            scale: 'large'
        },{
            xtype: 'button',
            enableToggle: true,
            toggleGroup: 'mapmodal',
            itemId: 'measurepolygonbtn',
            helpId: 'Measuringpolygonarea',
            text: polyglot.t('measurePolygon'),
            iconAlign: 'top',
            icon: 'images/icons/tools-measure-polygon.png',
            cls: 'custom-button btn-map-tool btn-tool-measure-polygon',
            scale: 'large'
        },{
            xtype: 'button',
            itemId: 'multiplemapsbtn',
            helpId: 'Multiplemaps',
            enableToggle: true,
            hidden: Config.toggles.useNewViewSelector,
            text: polyglot.t('multipleMaps'),
            iconAlign: 'top',
            icon: 'images/icons/tools-maps-multiple.png',
            cls: 'custom-button btn-map-tool btn-tool-multiple-maps',
            scale: 'large'
        },{
            xtype: 'button',
            text: polyglot.t('saveAsImage'),
            itemId: 'savemapbtn',
            helpId: 'Savingmapasimage',
            icon: 'images/icons/tools-save.png',
            iconAlign: 'top',
            cls: 'custom-button btn-map-tool btn-tool-save-image',
            scale: 'large',
			hidden: true //to be removed, duplicates functionality of snapshots
        }];
        if(Config.toggles.hasOwnProperty("hasNewFeatureInfo") && Config.toggles.hasNewFeatureInfo){
            this.items.unshift({
                xtype: 'button',
                enableToggle: true,
                itemId: 'featureInfoBtn',
                helpId: 'FeatureInfo',
                text: polyglot.t('featureInfo'),
                iconAlign: 'top',
                icon: 'images/new/tool-feature-info.png',
                cls: 'custom-button btn-map-tool btn-tool-feature-info',
                scale: 'large'
            })
        }
        
        this.callParent();
        
    }
})


Ext.define('PumaMain.controller.Select', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: [],
    init: function() {
        Observer.addListener("selectInternal",this.selectInternal.bind(this));
        Stores.addListener(this._onEvent.bind(this));
        this.control({
            '#selectcolorpicker': {
                select: this.onChangeColor
            },
            '#useselectedcolorpicker': {
                select: this.onChangeChartColor
            },
            'tool[type=unselect]': {
                click: this.clearSelections
            },
            'tool[type=unselectall]': {
                click: this.clearSelectionsAll
            }
            
        });
        this.selMap = {'ff4c39':[]};
        this.colorMap = {};
        this.hoverMap = [];
        Select.actualColor = this.actualColor = 'ff4c39';
        this.defaultColor = 'ff4c39';

        Select.select = this.select.bind(this);
        Select.selectedAreasMap = {};
        Select.selectedAreasMap[this.actualColor] = [];
        Select.controller = this;

        Observer.notify('Select#init');
    },
    onAfterUnselectRender: function() {
        //Ext.get('app-tools-colors-unselect').on('click',this.clearSelections,this);
    },

        
    select: function(areas,add,hover) {
        
        if (!this.actualColor) return;
        if (hover) {
            this.fromChart = null;
        }
        if (this.task) {
            this.task.cancel();
        }
        this.task = new Ext.util.DelayedTask();
        this.task.delay(hover ? 100 : 1,this.selectInternal,this,arguments);


        if (!window.Charts.selectedAreas){
			window.Charts.selectedAreas = {};
        }

		var selectedAreas = areas.map(function(area){return area.gid});

        if (add && window.Charts.selectedAreas[this.actualColor]){
            let oldAreas = window.Charts.selectedAreas[this.actualColor];
			window.Charts.selectedAreas[this.actualColor] = Ext.Array.difference(Ext.Array.merge(oldAreas, selectedAreas), Ext.Array.intersect(oldAreas, selectedAreas));
        } else {
			window.Charts.selectedAreas[this.actualColor] = selectedAreas;
        }

        window.Stores.notify("selection#selectionChanged");
    },
        
    onToggleHover: function(btn,value) {

        
    },
        
    onToggleSelectInMap: function(btn,value) {

    },
    onChangeChartColor: function(picker, value) {
        this.updateCounts();
        this.selectDelayed(null,null,null,true);
    },
    onChangeColor: function(picker,value) {
        Select.actualColor = this.actualColor = value;
        Observer.notify('Select#onChangeColor');
        this.selMap[value] = this.selMap[value] || [];
        if (this.hoverMap.length) {
            this.hoverMap = [];
            this.selectInternal([],true,false);
        }
    },
    
    selectInternal: function(areas,add,hover,delay) {
        if (OneLevelAreas.hasOneLevel){
            areas = SelectedAreasExchange.data.data;
        }
        if (!hover) {
            var sel = this.selMap[this.actualColor];
        }
        else {
            var sel = this.hoverMap;
        }
        var newSel = [];
        if (!add || hover) {
            
            areas = areas.concat([]);
            for (var i=0;i<areas.length;i++) {
                areas[i].equals = function(b) {
                    return this.gid === b.gid && this.at === b.at && this.loc === b.loc
                }
            }
            newSel = areas;
        }
        else {
            for (var i=0;i<areas.length;i++) {
                areas[i].equals = function(b) {
                    return this.gid === b.gid && this.at === b.at && this.loc === b.loc
                }
            }
            var diff = this.arrDifference(sel,areas);
            var add = this.arrDifference(areas,sel);
            newSel = Ext.Array.merge(diff,add);
        }
        
        if (!hover) {
            this.selMap[this.actualColor] = newSel;
            for (var col in this.selMap) {
                if (col==this.actualColor) continue;
                var diff = this.arrDifference(this.selMap[col],newSel);
                this.selMap[col] = diff;
			}
        }
        else {
            this.hoverMap = newSel;
        }

        this.colorMap = this.prepareColorMap();

        if (OneLevelAreas.hasOneLevel){
            this.getController('Chart').reconfigure('immediate');
            return;
        }

        this.getController('Area').colourTree(this.colorMap); 
        this.getController('Chart').reconfigure('immediate'); 
        
        this.updateCounts();

		Select.selectedAreasMap = this.selMap;
        
        if (this.selectTask) {
            this.selectTask.cancel();
        }
        this.selectTask = new Ext.util.DelayedTask();
        this.selectTask.delay(delay || 500,this.selectDelayed,this,arguments);
        
    },
    
    updateCounts: function() {
        var lowestMap = this.getController('Area').lowestMap;
        var outerCount = 0;
        var overallCount = 0;
        var picker = Ext.ComponentQuery.query('#useselectedcolorpicker')[0]
        var selectColors = picker.xValue || picker.value;
        selectColors = Ext.isArray(selectColors) ? selectColors : [selectColors]
        for (var color in this.selMap) {
            if (!Ext.Array.contains(selectColors,color)) {
                continue;
            }
            for (var i=0;i<this.selMap[color].length;i++) {
                var obj = this.selMap[color][i];
                overallCount++;
                if (lowestMap[obj.loc] && lowestMap[obj.loc][obj.at] && Ext.Array.contains(lowestMap[obj.loc][obj.at],obj.gid)) {}
                else {
                    this.outerSelect = true;
                    outerCount++;
                }
            }
        }
        this.outerCount = outerCount;
        this.overallCount = overallCount;
        if (overallCount==0) {
            this.switchToAllAreas();
        }
    },
    switchToAllAreas: function() {
        var cmp = Ext.ComponentQuery.query('#areapager #onlySelected')[0];
        cmp.suspendEvents();
        cmp.toggle(false);
        cmp.resumeEvents();
    },
        
    selectDelayed: function(areas,add,hover,bypassMapColor) {
        if (!bypassMapColor) {
            this.getController('Layers').colourMap(this.colorMap); 
        }
        
        if (!hover) {
            var lowestCount = this.getController('Area').lowestCount;
            var onlySel = Ext.ComponentQuery.query('#areapager #onlySelected')[0].pressed;
            var count = onlySel ? (this.overallCount) : (lowestCount+this.outerCount)
            
            Ext.StoreMgr.lookup('paging').setCount(count);
            
            var outer = !this.fromChart || this.outerSelect || (!this.outerSelect && this.prevOuterSelect) || onlySel;
            var type = outer  ? 'outer' : 'inner';
            if (outer && this.fromScatterChart && !this.fromChart) type = 'outerscatter';
            
            this.getController('Chart').reconfigure(type);  
            
            this.fromChart = null;
            this.fromScatterChart = null;
        }
        this.prevOuterSelect = this.outerSelect;
        this.outerSelect = false;
    },
      
    // taken from Ext.Array
    arrDifference: function(arrayA, arrayB) {
        var clone = arrayA ? Ext.Array.slice(arrayA,0) : [];
        var ln = clone.length,
            i, j, lnB;
        for (i = 0, lnB = arrayB.length; i < lnB; i++) {
            for (j = 0; j < ln; j++) {
                //if (clone[j] === arrayB[i]) {
                clone[j].equals = clone[j].equals || function(b) {
                    return this.gid === b.gid && this.at === b.at && this.loc === b.loc
                }
                    
                if (clone[j].equals(arrayB[i])) {
                    Ext.Array.erase(clone, j, 1);
                    j--;
                    ln--;
                }
            }
        }

        return clone;
    },
        
    clearSelectionsAll: function() {
        if (this.hoverMap.length > 0 || !Ext.isEmpty(this.colorMap)){
			this.selMap = {'ff4c39':[]};
			this.hoverMap = [];
			this.colorMap = {};
			this.getController('Area').colourTree(this.colorMap);
			this.updateCounts();
			this.selectDelayed();

			Select.selectedAreasMap = null;
			Stores.notify("selection#everythingCleared");
        }
    },
    clearSelections: function() {
        this.selMap[this.actualColor] = [];
        this.prepareColorMap();
        this.getController('Area').colourTree(this.colorMap); 
        this.getController('Chart').reconfigure('immediate'); 
        this.updateCounts();
        this.selectDelayed();

        Stores.notify("selection#activeCleared", {color: this.actualColor});
        var clearAll = true;
        for (var key in this.selMap){
            if (this.selMap[key].length > 0){
                clearAll = false;
            }
        }
        if (clearAll){
            Stores.notify("selection#everythingCleared");
        }
    },    
    
    prepareColorMap: function() {
        var resultMap = {};
        for (var color in this.selMap) {
            var actual = this.selMap[color];
            for (var i=0;i<actual.length;i++) {
                var area = actual[i];
                resultMap[area.loc] = resultMap[area.loc] || {};
                resultMap[area.loc][area.at] = resultMap[area.loc][area.at] || {};
                resultMap[area.loc][area.at][area.gid] = color;               
            }
        }
        for (var i=0;i<this.hoverMap.length;i++) {
            var area = this.hoverMap[i];
            resultMap[area.loc] = resultMap[area.loc] || {};
            resultMap[area.loc][area.at] = resultMap[area.loc][area.at] || {};
            resultMap[area.loc][area.at][area.gid] = this.actualColor;
        }
        this.colorMap = resultMap;

		if (area && window.location.origin === 'http://dromas.gisat.cz' && actual.length === 1 && area.index > 0){
        // if (area && actual.length === 1 && area.index > 0){
			var gid = area.gid;
			Stores.notify("map#selectFromAreas", gid);
        }

        setTimeout(function(){
			Stores.notify('selection#selected');
        },1000);

        return resultMap;
    },

    _onEvent: function(type, options){
        if (type === "selection#clearAll"){
            this.clearSelectionsAll();
        } else if (type === "selection#select"){
			this.actualColor = options.color;
			var colorpicker = Ext.ComponentQuery.query('#selectcolorpicker')[0];
            if (colorpicker){
                colorpicker.select(options.color);
            }
			this.select(options.areas);
        }
    }
    
});


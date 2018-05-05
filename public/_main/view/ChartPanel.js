Ext.define('PumaMain.view.ChartPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.chartpanel',
    layout: 'fit',
    frame: false,
    border: 0,
    collapseLeft: true,
    cls: 'chart-panel',
    padding: 0,
    initComponent: function() {
        this.toolMap = {
			description: {
				type: 'description',
				tooltip: polyglot.t('description'),
				cls: 'tool-icon tool-chart-description'
			},
            gear: {
                type: 'gear',
                helpId: 'Modifyingcharts',
                tooltip: polyglot.t('settings'),
				cls: 'tool-icon tool-chart-settings'
            },
            close: {
                type: 'close',
                helpId: 'Removingcharts',
                tooltip: polyglot.t('remove'),
                cls: 'tool-icon tool-chart-close'
            },
            help: {
                type: 'help',
                helpId: 'Displayingchartlegend',
				cls: 'tool-icon tool-chart-help',
                tooltip: polyglot.t('legend')
            },
            collapse: {
                type: 'collapse',
                helpId: 'Exportingchartsastables',
				cls: 'tool-icon tool-chart-export-csv',
                tooltip: polyglot.t('exportCsv')
            },
            search: {
                type: 'search',
                tooltip: polyglot.t('switchZooming'),
				cls: 'tool-icon tool-chart-search',
                width: 22,
                height: 22
            }
        }
        this.tools = [];
        
        var toolNames = ['description','gear','help','collapse','search','close'];
        for (var i=0;i<toolNames.length;i++) {
            this.tools.push(this.toolMap[toolNames[i]]);
        }
        this.callParent();
        this.updateToolVisibility();
    },
        
    updateToolVisibility: function() {
        var toolNames = [];
        switch (this.cfgType) {
            case 'polarchart': // TODO do we want also 'help'?
            case 'grid':
                toolNames = ['description','gear','collapse','close']; break;
            case 'piechart':
                toolNames = ['description','gear','help','collapse','close']; break;
            case 'columnchart':
                toolNames = ['description','gear','help','collapse','close']; break;
            case 'scatterchart':
                toolNames = ['description','gear','help','collapse','search','close']; break;
            case 'extentoutline':
                toolNames = ['description','gear','close']; break;
            case 'filter':
                toolNames = ['close']; break;
        }
        for (var i=0;i<this.tools.length;i++) {
            var tool = this.tools[i];
			if (tool.type === 'collapse-top' || tool.type === 'expand-bottom') {
				tool.addCls('tool-icon tool-chart-collapse');
				continue;
			}
            var vis = Ext.Array.contains(toolNames,tool.type);
            if (tool.rendered) {
                tool.setVisible(vis);
            }
            else if (!vis) {
                tool.hidden = true;
            }
        }
    }
})



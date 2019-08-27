import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import Uuid from '../../util/Uuid';

/**
 * D3.js chart class
 * @param options {Object}
 * @constructor
 */
let $ = window.$;
let Highcharts, Ext, Config, PumaMain;
class Chart {
    constructor(options) {
        Highcharts = window.Highcharts;
        Ext = window.Ext;
        Config = window.Config;
        PumaMain = window.PumaMain;
        if (!options) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Chart", "constructor", "missingOptions"));
        }

        this.id = new Uuid().generate();
        this.containerComponent = options.containerComponent;
        this.renderTo = this.containerComponent && this.containerComponent.el && this.containerComponent.el.dom || {};

        window.Stores.addListener(this.onEvent.bind(this));
    };

    rebuild() {
        // to be rewritten
    };

    destroy() {

    };

    onEvent(){

    };


///////////////////// ze stareho ///////////////////////


    dummyPolar(response) {
        let cmp = response.cmp || response.request.options.cmp;

        // remove old chart
        if (cmp.chart) {
            try {
                cmp.chart.destroy();
            } catch (e) {
            }
        }

        // get and parse graph data
        let data = response.responseText ? JSON.parse(response.responseText).data : null;
        if (cmp.queryCfg.type === 'filter') {
            //this.onFilterReceived(data, cmp);
            return;
        }

        // create NoData chart
        if (!data || data.noData) {
            // this.createNoDataChart(cmp);
            console.warn("Chart#dummyPolar: NoData");
            return;
        }

        // Make sure that the results are Numbers.
        if (data.series) {
            data.series.forEach(function (serie) {
                if (serie.data) {
                    serie.data.forEach(function (dataItem) {
                        if (dataItem.x) {
                            dataItem.x = Number(dataItem.x);
                        }
                        if (dataItem.y) {
                            dataItem.y = Number(dataItem.y);
                        }
                    })
                }
            });
        }

        let singlePage = response.request.options.singlePage;
        //let legendBtn = singlePage ? Ext.widget('button') : Ext.ComponentQuery.query('#legendbtn', cmp.ownerCt)[0];

        cmp.noData = false;

        // if (Ext.Array.contains(['extentoutline'], cmp.cfg.type)) {
        // 	if (singlePage) {
        // 		data.colorMap = JSON.parse(response.request.options.params.colorMap);
        // 	}
        // 	this.onOutlineReceived(data, cmp);
        // 	return;
        // }

        cmp.layout = {
            type: 'fit'
        };
        cmp.getLayout();

        //if (!Ext.Array.contains(['grid', 'featurecount'], cmp.cfg.type)) {
        //    legendBtn.show();
        //}

        let isGrid = cmp.queryCfg.type === 'grid';
        // if (isGrid) {
        // 	this.onGridReceived(response);
        // 	return;
        // }

        data.chart.events = {};
        let me = this;
        data.chart.events.selection = function()
        {
            // me.onScatterSelected(evt);
            console.error("WTF is onScatterSelected?");
        }
        ;
        data.chart.events.click = function()
        {
            if (Config.contextHelp) {
                PumaMain.controller.Help.onHelpClick({
                    stopPropagation: function () {
                    },
                    preventDefault: function () {
                    },
                    currentTarget: cmp.el
                });
            }
        }
        ;

        data.tooltip.formatter = function()
        {
            let obj = this;
            let type = obj.series.type;
            let attrConf = [];
            let yearName = '';
            let areaName = '';
            if (type === 'column') {
                areaName = obj.x;
                yearName = obj.point.yearName;
                attrConf.push({
                    name: obj.series.name,
                    val: obj.y,
                    units: obj.point.units
                });
            }
            else if (type === 'pie') {
                areaName = obj.series.name;
                yearName = obj.series.userOptions.yearName;
                attrConf.push({
                    name: obj.point.swap ? 'Other' : obj.key,
                    val: obj.y,
                    units: obj.point.units
                });
            }
            else {
                areaName = obj.key;
                yearName = obj.series.name;
                attrConf.push({
                    name: obj.point.yName,
                    val: obj.point.y,
                    units: obj.point.yUnits
                });
                attrConf.push({
                    name: obj.point.xName,
                    val: obj.point.x,
                    units: obj.point.xUnits
                });
                if (obj.point.zName) {
                    attrConf.push({
                        name: obj.point.zName,
                        val: obj.point.z,
                        units: obj.point.zUnits
                    });
                }
            }
            return me.getTooltipHtml(areaName, yearName, attrConf);
        }
        ;
        data.plotOptions = data.plotOptions || {series: {events: {}}};

        data.plotOptions.series.events.click = function(evt)
        {
            if (Config.contextHelp) {
                PumaMain.controller.Help.onHelpClick({
                    stopPropagation: function () {
                    },
                    preventDefault: function () {
                    },
                    currentTarget: this.chart.cmp.el
                });
                return;
            }
            me.onPointClick(this.chart.cmp, evt, false);
        }
        ;
        if (cmp.cfg.type === 'piechart') {
            data.plotOptions.series.events.mouseOver = function(evt)
            {
                me.onPointClick(this.chart.cmp, evt, true);
            }
        }
        else if (cmp.cfg.type !== 'featurecount') {
            data.plotOptions.series.point.events.mouseOver = function(evt)
            {
                me.onPointClick(this.series.chart.cmp, evt, true);
            }
            ;
            if (cmp.cfg.type === 'scatterchart') {
                data.plotOptions.series.point.events.mouseOut = function()
                {
                    $('path[linecls=1]').hide();
                }
            }
        }

        if (cmp.cfg.type === 'piechart') {
            data.plotOptions.pie.point.events.legendItemClick = function(evt)
            {
                evt.preventDefault();
                let isSingle = this.series.chart.options.chart.isPieSingle;
                if (!isSingle) {
                    me.onLegendToggle(this);
                }
            }
        }

        data.exporting = {
            enabled: false
        };

        data.chart.renderTo = cmp.el.dom;

        data.chart.events.load = function()
        {
            if (this.options.chart.isPieSingle) {
                let chart = this;
                let rend = chart.renderer;
                for (let i = 0; i < chart.series.length; i++) {
                    let serie = chart.series[i];
                    let left = chart.plotLeft + serie.center[0];
                    let top = chart.plotTop + serie.center[1] + serie.options.pieFontShift;
                    let text = rend.text(serie.options.pieText, left, top)
                        .attr({
                            'style': '',
                            'text-anchor': 'middle',
                            'font-size': serie.options.pieFontSize,
                            'fill': serie.options.pieFontColor
                        })
                        .add();
                }
            }
            if (cmp.cfg.scrollLeft && singlePage) {
                $('.x-container').scrollLeft(cmp.cfg.scrollLeft);
                $('.x-container').css('overflow', 'hidden');
            }
            if (singlePage) {
                console.log('loadingdone');
            }
        }
        ;
        if (singlePage) {
            for (let i = 0; i < data.series.length; i++) {
                data.series[i].animation = false;
            }
        }

        this.setLabelsView(data);

        let chart = new Highcharts.Chart(data);

        cmp.chart = chart;
        chart.cmp = cmp;
        let panel = cmp.ownerCt;
        if (!singlePage) {
            me.toggleLegendState(chart, cmp.legendOn);
        }
        // this.colourChart(cmp);
    };

    getTooltipHtml(areaName, yearName, attrConf) {
        let html = areaName + ' (' + yearName + ')';
        for (let i = 0; i < attrConf.length; i++) {
            html += '<br/>';
            let conf = attrConf[i];
            html += conf.name + ': ';
            html += '<b>' + this.formatVal(conf.val) + '</b> ';
            html += conf.units
        }
        return html;
    };

    formatVal(val) {
        val = Number(val);
        if (this.isInt(val)) return val;
        let deci = 3;
        if (val > 1) deci = 2;
        if (val > 100) deci = 1;
        if (val > 10000) deci = 0;
        return val != null ? val.toFixed(deci) : val;
    };

    isInt(value) {
        return !isNaN(parseInt(value, 10)) && (parseFloat(value, 10) == parseInt(value, 10));
    };


    onPointClick(cmp, evt, hovering) {
        if (hovering && !this.hovering && cmp.cfg.type !== 'scatterchart')
            return;
        let at = null;
        let gid = null;
        let loc = null;
        let point, serie;
        if (cmp.cfg.type === 'piechart') {
            serie = hovering ? evt.target : evt.point.series;
            at = serie.options.at;
            loc = serie.options.loc;
            gid = serie.options.gid;
        }
        else {
            point = evt.point || evt.target;
            at = point ? point.at : null;
            gid = point ? point.gid : null;
            loc = point ? point.loc : null;
        }
        if (!at || !gid || !loc)
            return;
        if (!this.hovering && hovering && cmp.cfg.type === 'scatterchart') {
            let years = Ext.ComponentQuery.query('#selyear')[0].getValue();
            if (years.length < 2) return;
            $('path[linecls=1]').hide();
            if (point.yearLines) {
                for (let i = 0; i < point.yearLines.length; i++) {
                    $(point.yearLines[i].element).show();
                    point.yearLines[i].toFront();
                }
            }
            else {
                let points = [];
                for (let i = 0; i < cmp.chart.series.length; i++) {
                    points = Ext.Array.merge(points, cmp.chart.series[i].points);
                }
                for (let i = 0; i < points.length; i++) {
                    let iterPoint = points[i];
                    if (point === iterPoint) {
                        continue;
                    }
                    if (point.at === iterPoint.at && point.gid === iterPoint.gid && point.loc === iterPoint.loc) {
                        let xPlus = point.graphic.renderer.plotBox.x;
                        let yPlus = point.graphic.renderer.plotBox.y;
                        let line = point.graphic.renderer.path(['M', point.plotX + xPlus, point.plotY + yPlus, 'L', iterPoint.plotX + xPlus, iterPoint.plotY + yPlus])
                            .attr({
                                'stroke-width': 2,
                                linecls: 1,
                                stroke: '#888'
                            });

                        line.add();
                        line.toFront();
                        point.yearLines = point.yearLines || [];
                        point.yearLines.push(line)
                    }
                }
            }
            if (!this.hovering) {
                return;
            }
        }
        let areas = [{at: at, gid: gid, loc: loc}];
        let add = evt.originalEvent ? evt.originalEvent.ctrlKey : evt.ctrlKey;
        let fromChart = cmp.cfg.type === 'grid' || cmp.cfg.type === 'piechart' || cmp.cfg.type === 'columnchart';
        //this.
        if (!Config.exportPage) {
            this.getController('Select').fromChart = fromChart;
            this.getController('Select').select(areas, add, hovering);
        }
        evt.preventDefault();
    };

    onLegendToggle(point) {
        let as = point.as;
        let attr = point.attr;
        let chart = point.series.chart;
        let series = chart.series;
        for (let i = 0; i < series.length; i++) {
            let serie = series[i];
            for (let j = 0; j < serie.data.length; j++) {
                let point = serie.data[j];
                if (point.attr === attr && point.as === as) {
                    serie.isDirty = true;
                    point.setVisible();
                    break;
                }
            }
        }
        chart.redraw();
    };


    /**
     * Set view of chart labels
     * @param data {Object}
     */
    setLabelsView(data) {
        // set labels for pie chart
        if (data.labels.hasOwnProperty("items")) {
            let items = data.labels.items;
            this.setPieChartLabels(items);
        } else if (data.hasOwnProperty("xAxis") && data.xAxis.hasOwnProperty("labels")) {
            data.xAxis.labels.formatter = function()
            {
                let label = this.axis.defaultLabelFormatter.call(this);
                if (label.length > 15) {
                    label = label.slice(0, 13) + "...";
                }
                return label;
            }
            ;
        }
    };

    /**
     * Set pie chart labels view
     * @param labels {Array}
     */
    setPieChartLabels(labels) {
        let count = labels.length;
        labels.forEach(function (label) {
            let text = label.html;
            if (count <= 3) {
                if (text.length > 25) {
                    label.html = text.slice(0, 23) + "...";
                }
            }
            if (count > 3 && count <= 8) {
                label.style.fontSize = "11px";
                if (text.length > 22) {
                    label.html = text.slice(0, 20) + "...";
                }
            } else if (count > 8) {
                label.style.fontSize = "11px";
                if (text.length > 15) {
                    label.html = text.slice(0, 13) + "...";
                }
            }
        });
    };

    toggleLegendState(chart, on) {
        let id = chart.container.id;
        let selector = '#' + id + ' .highcharts-legend';
        if (on) {
            $(selector).show();
        } else {
            $(selector).hide();
        }
    };

}


export default Chart;
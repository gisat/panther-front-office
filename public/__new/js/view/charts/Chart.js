define([
	'../../error/ArgumentError',
	'../../util/Logger',
	'../../util/Uuid',

	'd3',
	'jquery'
], function (ArgumentError,
			 Logger,
			 Uuid,

			 d3,
			 $) {
	"use strict";

	/**
	 * D3.js chart class
	 * @param options {Object}
	 * @constructor
	 */

	var Chart = function (options) {
		if (!options){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Chart", "constructor", "missingOptions"));
		}
		this._options = options;

		this.id = new Uuid().generate();
		this.renderTo = this._options.containerComponent.el.dom;

		this.rebuild();

		this._options.containerComponent.chart = this;
	};

	Chart.prototype.rebuild = function () {
		// to be rewritten
	};

	Chart.prototype.destroy = function () {

	};























	///////////////////// ze stareho ///////////////////////


	Chart.prototype.dummyPolar = function (response) {
		var cmp = response.cmp || response.request.options.cmp;

		// remove old chart
		if (cmp.chart) {
			try {
				cmp.chart.destroy();
			} catch (e) {
			}
		}

		// get and parse graph data
		var data = response.responseText ? JSON.parse(response.responseText).data : null;
		if (cmp.queryCfg.type == 'filter') {
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
		if(data.series) {
			data.series.forEach(function(serie) {
				if(serie.data) {
					serie.data.forEach(function(dataItem){
						if(dataItem.x) {
							dataItem.x = Number(dataItem.x);
						}
						if(dataItem.y) {
							dataItem.y = Number(dataItem.y);
						}
					})
				}
			});
		}

		var singlePage = response.request.options.singlePage;
		//var legendBtn = singlePage ? Ext.widget('button') : Ext.ComponentQuery.query('#legendbtn', cmp.ownerCt)[0];

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

		var isGrid = cmp.queryCfg.type == 'grid';
		// if (isGrid) {
		// 	this.onGridReceived(response);
		// 	return;
		// }

		data.chart.events = {};
		var me = this;
		data.chart.events.selection = function(evt) {
			// me.onScatterSelected(evt);
			console.error("WTF is onScatterSelected?");
		};
		data.chart.events.click = function(evt) {
			if (Config.contextHelp) {
				PumaMain.controller.Help.onHelpClick({
					stopPropagation: function() {},
					preventDefault: function() {},
					currentTarget: cmp.el
				});
			}
		};

		data.tooltip.formatter = function() {
			var obj = this;
			var type = obj.series.type;
			var attrConf = [];
			var yearName = '';
			var areaName = '';
			if (type=='column') {
				areaName = obj.x;
				yearName = obj.point.yearName;
				attrConf.push({
					name: obj.series.name,
					val: obj.y,
					units: obj.point.units
				});
			}
			else if (type=='pie') {
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
				attrConf.push ({
					name: obj.point.yName,
					val: obj.point.y,
					units: obj.point.yUnits
				});
				attrConf.push ({
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
			return me.getTooltipHtml(areaName,yearName,attrConf);
		};
		data.plotOptions = data.plotOptions || {series: {events: {}}};

		data.plotOptions.series.events.click = function(evt) {
			if (Config.contextHelp) {
				PumaMain.controller.Help.onHelpClick({
					stopPropagation: function() {},
					preventDefault: function() {},
					currentTarget: this.chart.cmp.el
				});
				return;
			}
			me.onPointClick(this.chart.cmp, evt, false);
		};
		if (cmp.cfg.type == 'piechart') {
			data.plotOptions.series.events.mouseOver = function(evt) {
				me.onPointClick(this.chart.cmp, evt, true);
			}
		}
		else if (cmp.cfg.type != 'featurecount') {
			data.plotOptions.series.point.events.mouseOver = function(evt) {
				me.onPointClick(this.series.chart.cmp, evt, true);
			};
			if (cmp.cfg.type == 'scatterchart') {
				data.plotOptions.series.point.events.mouseOut = function(evt) {
					$('path[linecls=1]').hide();
				}
			}
		}

		if (cmp.cfg.type == 'piechart') {
			data.plotOptions.pie.point.events.legendItemClick = function(evt) {
				evt.preventDefault();
				var isSingle = this.series.chart.options.chart.isPieSingle;
				if (!isSingle) {
					me.onLegendToggle(this);
				}
			}
		}

		data.exporting = {
			enabled: false
		};

		data.chart.renderTo = cmp.el.dom;

		data.chart.events.load = function() {
			if (this.options.chart.isPieSingle) {
				var chart = this;
				var rend = chart.renderer;
				for (var i=0;i<chart.series.length;i++) {
					var serie = chart.series[i];
					var left = chart.plotLeft + serie.center[0];
					var top = chart.plotTop + serie.center[1]+serie.options.pieFontShift;
					var text = rend.text(serie.options.pieText, left, top)
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
				$('.x-container').css('overflow','hidden');
			}
			if (singlePage) {
				console.log('loadingdone');
			}
		};
		if (singlePage) {
			for (var i = 0; i < data.series.length; i++) {
				data.series[i].animation = false;
			}
		}

		this.setLabelsView(data);

		var chart = new Highcharts.Chart(data);

		cmp.chart = chart;
		chart.cmp = cmp;
		var panel = cmp.ownerCt;
		if (!singlePage) {
			me.toggleLegendState(chart, cmp.legendOn);
		}
		// this.colourChart(cmp);
	};

	Chart.prototype.getTooltipHtml = function(areaName,yearName,attrConf) {
		var html = areaName+' ('+yearName+')';
		for (var i=0;i<attrConf.length;i++) {
			html += '<br/>';
			var conf = attrConf[i];
			html += conf.name+': ';
			html +=  '<b>'+this.formatVal(conf.val)+'</b> ';
			html += conf.units
		}
		return html;
	};
	Chart.prototype.formatVal = function(val) {
		val = Number(val);
		if (this.isInt(val)) return val;
		var deci = 3;
		if (val>1) deci = 2;
		if (val>100) deci = 1;
		if (val>10000) deci = 0;
		return val!=null ? val.toFixed(deci) : val;
	};
	Chart.prototype.isInt = function(value) {
		return !isNaN(parseInt(value,10)) && (parseFloat(value,10) == parseInt(value,10));
	};


	Chart.prototype.onPointClick = function(cmp, evt, hovering) {
		if (hovering && !this.hovering && cmp.cfg.type != 'scatterchart')
			return;
		var at = null;
		var gid = null;
		var loc = null;
		if (cmp.cfg.type == 'piechart') {
			var serie = hovering ? evt.target : evt.point.series;
			at = serie.options.at;
			loc = serie.options.loc;
			gid = serie.options.gid;
		}
		else {
			var point = evt.point || evt.target;
			at = point ? point.at : null;
			gid = point ? point.gid : null;
			loc = point ? point.loc : null;
		}
		if (!at || !gid || !loc)
			return;
		if (!this.hovering && hovering && cmp.cfg.type == 'scatterchart') {
			var years = Ext.ComponentQuery.query('#selyear')[0].getValue();
			if (years.length<2) return;
			$('path[linecls=1]').hide();
			if (point.yearLines) {
				for (var i = 0; i < point.yearLines.length; i++) {
					$(point.yearLines[i].element).show();
					point.yearLines[i].toFront();
				}
			}
			else {
				var points = [];
				for (var i = 0; i < cmp.chart.series.length; i++) {
					points = Ext.Array.merge(points, cmp.chart.series[i].points);
				}
				for (var i = 0; i < points.length; i++) {
					var iterPoint = points[i];
					if (point == iterPoint) {
						continue;
					}
					if (point.at == iterPoint.at && point.gid == iterPoint.gid && point.loc == iterPoint.loc) {
						var xPlus = point.graphic.renderer.plotBox.x;
						var yPlus = point.graphic.renderer.plotBox.y;
						var line = point.graphic.renderer.path(['M', point.plotX + xPlus, point.plotY + yPlus, 'L', iterPoint.plotX + xPlus, iterPoint.plotY + yPlus])
							.attr({
								'stroke-width': 2,
								linecls: 1,
								stroke: '#888'
							})

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
		var areas = [{at: at, gid: gid, loc: loc}]
		var add = evt.originalEvent ? evt.originalEvent.ctrlKey : evt.ctrlKey;
		var fromChart = cmp.cfg.type=='grid' || cmp.cfg.type=='piechart' || cmp.cfg.type=='columnchart';
		//this.
		if (!Config.exportPage) {
			this.getController('Select').fromChart = fromChart;
			this.getController('Select').select(areas, add, hovering);
		}
		evt.preventDefault();
	};

	Chart.prototype.onLegendToggle = function(point) {
		var as = point.as;
		var attr = point.attr;
		var chart = point.series.chart;
		var series = chart.series;
		for (var i = 0; i < series.length; i++) {
			var serie = series[i];
			for (var j = 0; j < serie.data.length; j++) {
				var point = serie.data[j];
				if (point.attr == attr && point.as == as) {
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
	Chart.prototype.setLabelsView = function(data){
		// set labels for pie chart
		if (data.labels.hasOwnProperty("items")){
			var items = data.labels.items;
			this.setPieChartLabels(items);
		} else if (data.hasOwnProperty("xAxis") && data.xAxis.hasOwnProperty("labels")){
			data.xAxis.labels.formatter = function () {
				var label = this.axis.defaultLabelFormatter.call(this);
				if (label.length > 15){
					label = label.slice(0, 13) + "...";
				}
				return label;
			};
		}
	};

	/**
	 * Set pie chart labels view
	 * @param labels {Array}
	 */
	Chart.prototype.setPieChartLabels = function(labels){
		var count = labels.length;
		labels.forEach(function(label){
			var text = label.html;
			if (count <= 3){
				if (text.length > 25){
					label.html = text.slice(0, 23) + "...";
				}
			}
			if (count > 3 && count <= 8){
				label.style.fontSize = "11px";
				if (text.length > 22){
					label.html = text.slice(0, 20) + "...";
				}
			} else if (count > 8) {
				label.style.fontSize = "11px";
				if (text.length > 15){
					label.html = text.slice(0, 13) + "...";
				}
			}
		});
	};

	Chart.prototype.toggleLegendState = function(chart, on) {
		var id = chart.container.id;
		var selector = '#' + id + ' .highcharts-legend';
		if (on) {
			$(selector).show();
		} else {
			$(selector).hide();
		}
	};

	return Chart;
});
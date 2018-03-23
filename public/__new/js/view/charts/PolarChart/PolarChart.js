define([
	'../../../error/ArgumentError',
	'../../../util/Logger',

	'../Chart',

	'lib/d3-radar-chart',
	'jquery'
], function (ArgumentError,
			 Logger,

			 Chart,

			 RadarChart,
			 $) {

	var PolarChart = function (options) {
		Chart.call(this, options);
	};


	PolarChart.prototype = Object.create(Chart.prototype);


	PolarChart.prototype.rebuild = function () {
		var cmp = this._options.containerComponent;

		// get and parse graph data
		var data = this._options.backendResponse.responseText ? JSON.parse(this._options.backendResponse.responseText).data : null;


		var w = 350,
			h = 350;

		// var colorscale = d3.scale.category10();

		// Legend titles
		// var LegendOptions = ['Smartphone','Tablet'];

		// Options for the Radar chart, other than default
		var chartConfig = {
			w: w,
			h: h,
			// maxValue: 0.6,
			levels: 10,
			levelCaptions: false,
			ExtraWidthX: 200,
			ExtraWidthY: 50
		};


		// Call function to draw the Radar chart
		RadarChart.draw(cmp.el.dom, data.chartData, chartConfig);

	};

	return PolarChart;
});
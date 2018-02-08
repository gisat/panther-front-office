define([
	'../../../error/ArgumentError',
	'../../../util/Logger',

	'../Chart',

	'jquery'
], function (ArgumentError,
			 Logger,

			 Chart,

			 $) {

	var PolarChart = function (options) {
		Chart.call(this, options);
	};


	PolarChart.prototype = Object.create(Chart.prototype);


	PolarChart.prototype.rebuild = function () {

		// Draw to this._options.containerComponent.el.dom

	};

	return PolarChart;
});
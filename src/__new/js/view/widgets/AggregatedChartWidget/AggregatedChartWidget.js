define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Color',
	'../inputs/checkbox/Checkbox',
	'../../../util/Logger',
	'../../map/Map',
	'../../../util/MapExport',
	'../inputs/multiselectbox/MultiSelectBox',
	'../../../util/Remote',
	'../inputs/selectbox/SelectBox',
	'../inputs/sliderbox/SliderBox',
	'../Widget',

	'd3',
	'resize',
	'jquery',
	'string',
	'underscore',

	'css!./AggregatedChartWidget'
], function (ArgumentError,
			 NotFoundError,
			 Color,
			 Checkbox,
			 Logger,
			 Map,
			 MapExport,
			 MultiSelectBox,
			 Remote,
			 SelectBox,
			 SliderBox,
			 Widget,
			 d3,
			 resize,
			 $,
			 S,
			 _) {

	/**
	 * @param options {Object}
	 * @param options.elementId {String} ID of widget
	 * @param options.filter {Filter} instance of class for data filtering
	 * @param options.targetId {String} ID of an element in which should be the widget rendered
	 * @param options.name {String} Name of the widget
	 * @param options.stateStore {StateStore}
	 * @constructor
	 */
	var AggregatedChartWidget = function (options) {
		Widget.apply(this, arguments);

		this._settings = null;

		this._filter = options.filter;
		this._stateStore = options.stateStore;
	};

	AggregatedChartWidget.prototype = Object.create(Widget.prototype);

	/**
	 * It rebuilds the widget.
	 */
	AggregatedChartWidget.prototype.build = function (sets) {
		console.log('AggregatedChartWidget build: ', sets);
		if (!this._resizeListener) {
			this._resizeListener = true;
			this.addOnResizeListener();
		}
		this._initializeResize = false;
		this.handleLoading("hide");

		$('#floater-functional-urban-area-result').addClass('open');
		$('#floater-functional-urban-area-result .floater-body').empty();
		// Append chart for each Set.
		var charts = Object.keys(sets).map(function(set){
			return '<h3>'+sets[set].name+'</h3><svg id="stacked-'+set+'" width="500" height="500"></svg>';
		}).join(' ');
		$('#floater-functional-urban-area-result .floater-body').append(
			'<div id="chart">' + charts + '</div>'
		);

		var setsToSend = [];
		Object.keys(sets).forEach(function(setName){
			var set = {
				id: sets[setName].id,
				name: sets[setName].name,
				categories: sets[setName].categories
			};
			set.categories = Object.keys(set.categories).map(function(category){
				set.categories[category].attributes = set.categories[category].data;
				return set.categories[category];
			});

			setsToSend.push(set);
		});

		var self = this;
		var current = this._stateStore.current();
		$.post(Config.url + 'rest/data/aggregated', {
			sets: setsToSend,
			areaTemplate: current.analyticalUnitLevel,
			periods: current.periods,
			places: current.places
		}, result => {
			result.sets.forEach(function(set){
				var colors = set.set.categories.map(function(category){
					return category.color;
				});
				self.generateChart(set.csv, 'svg#stacked-' + set.set.id, colors);
			})
		});
	};

	AggregatedChartWidget.prototype.generateChart = function(csv, chartId, colors) {
		var svg = d3.select(chartId),
			margin = {top: 20, right: 20, bottom: 30, left: 40},
			width = +svg.attr("width") - margin.left - margin.right,
			height = +svg.attr("height") - margin.top - margin.bottom,
			g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var x = d3.scaleBand()
			.rangeRound([0, width])
			.paddingInner(0.05)
			.align(0.1);

		var y = d3.scaleLinear()
			.rangeRound([height, 0]);

		var z = d3.scaleOrdinal()
			.range(colors); // The colors needs to be retrieved as part.

		var data = d3.csvParse(csv, function (d, i, columns) {
			for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
			d.total = t;
			return d;
		});

		var keys = data.columns.slice(1);

		data.sort(function (a, b) {
			return b.total - a.total;
		});
		x.domain(data.map(function (d) {
			return d.State;
		}));
		y.domain([0, d3.max(data, function (d) {
			return d.total;
		})]).nice();
		z.domain(keys);

		g.append("g")
			.selectAll("g")
			.data(d3.stack().keys(keys)(data))
			.enter().append("g")
			.attr("fill", function (d) {
				return z(d.key);
			})
			.selectAll("rect")
			.data(function (d) {
				return d;
			})
			.enter().append("rect")
			.attr("x", function (d) {
				return x(d.data.State);
			})
			.attr("y", function (d) {
				return y(d[1]);
			})
			.attr("height", function (d) {
				return y(d[0]) - y(d[1]);
			})
			.attr("width", x.bandwidth());

		g.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		g.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y).ticks(null, "s"))
			.append("text")
			.attr("x", 2)
			.attr("y", y(y.ticks().pop()) + 0.5)
			.attr("dy", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "start")
			.text("Amount");

		var legend = g.append("g")
			.attr("font-family", "sans-serif")
			.attr("font-size", 10)
			.attr("text-anchor", "end")
			.selectAll("g")
			.data(keys.slice().reverse())
			.enter().append("g")
			.attr("transform", function (d, i) {
				return "translate(0," + i * 20 + ")";
			});

		legend.append("rect")
			.attr("x", width - 19)
			.attr("width", 19)
			.attr("height", 19)
			.attr("fill", z);

		legend.append("text")
			.attr("x", width - 24)
			.attr("y", 9.5)
			.attr("dy", "0.32em")
			.text(function (d) {
				return d;
			});
	};

	AggregatedChartWidget.prototype.rebuild = function() {};

	/**
	 * Rebuild widget on resize
	 */
	AggregatedChartWidget.prototype.addOnResizeListener = function () {
		var self = this;
		var id = this._widgetSelector.attr("id");
		var resizeElement = document.getElementById(id);

		var timeout;
		resize.addResizeListener(resizeElement, function () {
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				if (self._initializeResize) {
					self.build();
				}
				self._initializeResize = true;
			}, 500);
		});
	};

	return AggregatedChartWidget;
});
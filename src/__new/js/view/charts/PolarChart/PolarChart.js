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


		var w = 300,
			h = 300;

		// var colorscale = d3.scale.category10();

		// Legend titles
		// var LegendOptions = ['Smartphone','Tablet'];

		// Options for the Radar chart, other than default
		var chartConfig = {
			w: w,
			h: h,
			// maxValue: 0.6,
			// levels: 6
		};


		// Call function to draw the Radar chart
		RadarChart.draw(cmp.el.dom, data.chartData, chartConfig);


		// TODO make legend (from data.categories)

	};

	/*
	Object.defineProperties(SharingWidget.prototype, {
		url: {
			get: function() {
				return this._url;
			},
			set: function(url) {
				this._url = url;
			}
		}
	});

	SharingWidget.prototype.rebuild = function(){
		var name = $('#floater-sharing .floater-body #sharing-name').val() || '';
		$('#floater-sharing .floater-body').empty();
		$('#floater-sharing .floater-body').append(
			'<div>' +
			'	<span>'+this.url+'</span>' +
			'</div>'
		);

		$('#floater-sharing .floater-footer').empty();


		if(Config.toggles.isUrbanTep) {
			var self = this;

			UrbanTepPortalStore.communities().then(function(communities){
				var optionsHtml = communities.map(function(community){
					return '<option value="'+community.identifier+'">'+community.title+'</option>';
				}).join(' ');
				$('#floater-sharing .floater-body').append(
					'<div>' +
					'	<div><label>Name: <input id="sharing-name" type="text" value="'+name+'"/></label></div>' +
					'	<div><label>Community: ' +
					'		<select id="sharing-community">' + optionsHtml +
					'		</select>' +
					'	</label></div>' +
					'</div>'
				);
				$('#floater-sharing .floater-footer').append('<div class="widget-button" id="sharing-portal">Share on the portal.</div>');

				$('#sharing-portal').off();
				$('#sharing-portal').on('click', function(){
					UrbanTepPortalStore.share(self.url, $('#floater-sharing .floater-body #sharing-name').val(), $( "#floater-sharing .floater-body #sharing-community option:checked" ).val());
				});
			});
		}
	};

	SharingWidget.prototype.build = function() {
		this.handleLoading("hide");

		$(this._widgetSelector).find(".widget-minimise").off();
		$(this._widgetSelector).find(".widget-minimise").on("click", function(){
			$('#floater-sharing').hide();
		});

		this.rebuild();
	};*/

	return PolarChart;
});
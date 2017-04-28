define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../table/TableSnowConfigurations',
	'../Widget',

	'jquery',
	'string',
	//'text!./WorldWindWidget.html',
	'css!./SnowWidget'
], function(ArgumentError,
			NotFoundError,
			Logger,

			TableSnowConfigurations,
			Widget,

			$,
			S
			//htmlBody
){
	/**
	 * Class representing widget for handling with saved configurations of snow portal
	 * @param options {Object}
	 * @constructor
	 */
	var SnowWidget = function(options){
		Widget.apply(this, arguments);
		if (!options.iFrame){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SnowWidget", "constructor", "missingIFrame"));
		}
		this._iFrame = options.iFrame;

		this.build();
		this.deleteFooter(this._widgetSelector);

		var record = {
			area: "Czech Republic",
			dateFrom: "20/12/2016",
			dateTo: "24/12/2016",
			sensors: {
				modis: ["Terra", "Aqua"],
				slstr: ["Sentinel 3"]
			},
			composites: [4,16],
			url: "http://35.165.51.145/snow/czech-republic/20170103-20170111/modis-terra-aqua_slstr-sentinel3/4-16"
		};
		this._currentMock = [record];
		this._savedMock = [record, record, record, record, record, record];
	};

	SnowWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Build basic view of the widget
	 */
	SnowWidget.prototype.build = function(){
		this.addMinimiseButtonListener();

		this._widgetBodySelector.append('<div id="snow-widget-container"></div>');
		this._container = $('#snow-widget-container');

		this._container.append('<h3 class="snow-table-caption">Current configuration</h3>');
		this._currentConfigurationTable = this.buildTable('snow-current-cfg-table');

		this._container.append('<h3 class="snow-table-caption">Saved configurations</h3>');
		this._savedConfigurationTable = this.buildTable('snow-saved-cfg-table');
	};

	SnowWidget.prototype.rebuild = function(){
		// todo get current snow configuration, then:
		this.rebuildCurrentCfgTable(this._currentMock);

		// todo get saved configurations, then:
		this.rebuildSavedCfgTable(this._savedMock);

		this.handleLoading("hide");
	};

	/**
	 * @param data {Array}
	 */
	SnowWidget.prototype.rebuildCurrentCfgTable = function(data){
		this._currentConfigurationTable.clear();
		var self = this;
		data.forEach(function(record){
			self._currentConfigurationTable.addRecord(record, false);
		})
	};

	/**
	 * @param data {Array}
	 */
	SnowWidget.prototype.rebuildSavedCfgTable = function(data){
		this._savedConfigurationTable.clear();
		var self = this;
		data.forEach(function(record){
			self._savedConfigurationTable.addRecord(record, true);
		})
	};

	SnowWidget.prototype.buildTable = function(id){
		return new TableSnowConfigurations({
			elementId: id,
			class: "snow-cfg-table",
			targetId: this._container.attr("id")
		});
	};

	/**
	 * Add listener to the minimise button
	 */
	SnowWidget.prototype.addMinimiseButtonListener = function(){
		var self = this;
		this._widgetSelector.find(".widget-minimise").on("click", function(){
			var id = self._widgetSelector.attr("id");
			self._widgetSelector.removeClass("open");
			$(".item[data-for=" + id + "]").removeClass("open");
		});
	};

	return SnowWidget;
});
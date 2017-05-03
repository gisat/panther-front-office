define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/RemoteJQ',

	'./SnowUrlParser',
	'../../table/TableSnowConfigurations',
	'../Widget',

	'jquery',
	'string',
	//'text!./WorldWindWidget.html',
	'css!./SnowWidget'
], function(ArgumentError,
			NotFoundError,
			Logger,
			RemoteJQ,

			SnowUrlParser,
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
		this._urlParser = new SnowUrlParser();

		this.build();
		this.deleteFooter(this._widgetSelector);
	};

	SnowWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Build basic view of the widget
	 */
	SnowWidget.prototype.build = function(){
		this._widgetBodySelector.append('<div id="snow-widget-container"></div>');
		this._container = $('#snow-widget-container');

		this._container.append('<h3 class="snow-table-caption">Current configuration</h3>');
		this._currentConfigurationTable = this.buildTable('snow-current-cfg-table');

		this._container.append('<h3 class="snow-table-caption">Saved configurations</h3>');
		this._savedConfigurationTable = this.buildTable('snow-saved-cfg-table');

		this.addEventListeners();
	};

	/**
	 * Rebuild widget
	 */
	SnowWidget.prototype.rebuild = function(){
		// todo get current snow configuration, then:
		var currentConfiguration = [{
				url: "http://35.165.51.145/snow/germany/20170103-20170111/slstr-sentinel3",
				user: 1
			}];
		var currentData = this.parseDataForTable(currentConfiguration);
		this.redrawCurrentCfgTable(currentData);

		this.rebuildSavedConfigurations();

		this.handleLoading("hide");
	};

	/**
	 * Rebuild table with saved configurations
	 */
	SnowWidget.prototype.rebuildSavedConfigurations = function(){
		var self = this;
		this.getConfigurations().then(function(data){
			var records = self.parseDataForTable(data.data);
			self.redrawSavedCfgTable(records);
		});
	};

	/**
	 * Redraw table with current configurations
	 * @param data {Array}
	 */
	SnowWidget.prototype.redrawCurrentCfgTable = function(data){
		this._currentConfigurationTable.clear();
		var self = this;
		data.forEach(function(record){
			self._currentConfigurationTable.addRecord(record, false);
		})
	};

	/**
	 * Redraw table with saved configurations
	 * @param data {Array}
	 */
	SnowWidget.prototype.redrawSavedCfgTable = function(data){
		this._savedConfigurationTable.clear();
		var self = this;
		data.forEach(function(record){
			self._savedConfigurationTable.addRecord(record, true);
		})
	};

	/**
	 * Prepare data for tables
	 * @param cfg {Array} list with objects, where url property represents saved configuration
	 * @returns {Array}
	 */
	SnowWidget.prototype.parseDataForTable = function(cfg){
		var configurations = [];
		var self = this;
		cfg.forEach(function(record){
			configurations.push(self._urlParser.parse(record.url));
		});
		return configurations;
	};

	/**
	 * Build table with configurations
	 * @param id {string} id of the table
	 * @returns {TableSnowConfigurations}
	 */
	SnowWidget.prototype.buildTable = function(id){
		return new TableSnowConfigurations({
			elementId: id,
			class: "snow-cfg-table",
			targetId: this._container.attr("id")
		});
	};

	/**
	 * Add event listeners
	 */
	SnowWidget.prototype.addEventListeners = function(){
		this.addMinimiseButtonListener();
		this.addIFrameChangeListener();
		this.addSaveButtonListener();
	};


	SnowWidget.prototype.addIFrameChangeListener = function(){
		var self = this;
		var snow = $("#snow-iframe");
		snow.on("hashchange", function(){
			debugger;
		});
		snow.on("load", function(){
			self.rebuild();
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

	/**
	 * Add listener to save button
	 */
	SnowWidget.prototype.addSaveButtonListener = function(){
		var self = this;
		this._currentConfigurationTable.getTable().on("click", ".save-composites", function(){
			var button = $(this);
			var url = button.parents("tr").attr("data-url");
			self.saveConfigurations(url).then(function(){
				button.attr("disabled", true);
				self.rebuildSavedConfigurations();
			});
		});
	};

	/**
	 * Get configurations from server
	 * @returns {Promise}
	 */
	SnowWidget.prototype.getConfigurations = function(){
		return new RemoteJQ({
			url: "rest/snow/getconfigurations"
		}).get();
	};

	/**
	 * Save configurations
	 * @options {string} current iframe url
	 * @returns {Promise}
	 */
	SnowWidget.prototype.saveConfigurations = function(location){
		return new RemoteJQ({
			url: "rest/snow/saveconfigurations",
			params: {
				url: location
			}
		}).post();
	};

	return SnowWidget;
});
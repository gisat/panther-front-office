define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'../../../../util/RemoteJQ',
	'./InfoLayersPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Remote,
			InfoLayersPanel,

			$,
			S
){
	/**
	 * Class representing AU Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var AuLayersPanel = function(options){
		InfoLayersPanel.apply(this, arguments);
	};

	AuLayersPanel.prototype = Object.create(InfoLayersPanel.prototype);

	/**
	 * Add content to panel
	 */
	AuLayersPanel.prototype.addContent = function(){
		this.addEventsListeners();
	};

	/**
	 * Rebuild panel with current configuration
	 * @param configuration {Object} configuration from global object ThemeYearConfParams
	 */
	AuLayersPanel.prototype.rebuild = function(configuration){
		if (!configuration){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "AuLayersPanel", "rebuild", "missingParameter"));
		}
		this.clear();

		var self = this;
		this.getLayers(configuration).then(function(result){
			if (result.hasOwnProperty("data") && result.data.length > 0){
				self.addLayers(result.data[0]);
				self.displayPanel("block");
			} else {
				self.displayPanel("none");
			}
		}).catch(function(err){
			throw new Error(err);
		});
	};

	AuLayersPanel.prototype.addLayers = function(data){
		var id = "analytical-units";
		var name = "Area outlines";
		var layerList = data.layers;
		this.addLayer(id, name, layerList, this._panelBodySelector, "", true);
	};

	/**
	 * Get the layers list from server
	 * @param configuration {Object} configuration from global object ThemeYearConfParams
	 */
	AuLayersPanel.prototype.getLayers = function(configuration){
		var scope = Number(configuration.dataset);
		var layerTemplate = Number(configuration.auCurrentAt);
		var year = JSON.parse(configuration.years);
		var place = "";
		if (configuration.place.length > 0){
			place = [Number(configuration.place)];
		}

		return new Remote({
			url: "rest/filtered/au",
			params: {
				layerTemplate: layerTemplate,
				scope: scope,
				place: place,
				year: year
			}}).get();
	};


	return AuLayersPanel;
});
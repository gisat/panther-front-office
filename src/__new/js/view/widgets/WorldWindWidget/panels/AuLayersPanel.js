define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'../../../../util/RemoteJQ',
	'./ThematicLayersPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Remote,
			ThematicLayersPanel,

			$,
			S
){
	/**
	 * Class representing AU Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var AuLayersPanel = function(options){
		ThematicLayersPanel.apply(this, arguments);
	};

	AuLayersPanel.prototype = Object.create(ThematicLayersPanel.prototype);

	AuLayersPanel.prototype.addListeners = function(){
		Stores.listeners.push(this.rebuild.bind(this, "updateOutlines"));
	};

	/**
	 * Add content to panel
	 */
	AuLayersPanel.prototype.addContent = function(){
		this.addEventsListeners();
	};

	AuLayersPanel.prototype.rebuild = function(action, notification){
		if (action == notification && notification == "updateOutlines"){
			this.clear();
			var data = Stores.outlines;
			var layer = {
				id: "analytical-units",
				name: "Area outlines",
				layer: data.layerNames,
				sldId: data.sldId
			};

			this._worldWind.layers.addChoroplethLayer(layer, this._id, true);
			this.addLayerControl(layer.id, layer.name, this._panelBodySelector, true);
		}
	};

	return AuLayersPanel;
});
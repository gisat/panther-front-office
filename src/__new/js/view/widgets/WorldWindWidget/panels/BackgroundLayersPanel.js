define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'../../../../stores/Stores',
	'./WorldWindWidgetPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Stores,
			WorldWindWidgetPanel,

			$,
			S
){
	/**
	 * Class representing Background Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var BackgroundLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);

        this.rebuild();

        var self = this;
        Observer.addListener('scopeChange', function(){
        	self.rebuild();
		});
	};

	BackgroundLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

    BackgroundLayersPanel.prototype.rebuild = function() {
        this.clear(this._id);

        this.layerControls = [];

        var scope = Stores.retrieve("state").current().scopeFull;
        this.addLayerControls(scope);
        this.addEventsListeners();
		this.toggleLayers();
    };

	/**
	 * Add control for background layers
	 */
	BackgroundLayersPanel.prototype.addLayerControls = function(scope){
		var disabledLayers = (scope && scope['disabledLayers']) || {};
		var activeBackgroundMap = (scope && scope['activeBackgroundMap']) || 'osm';
		if(!disabledLayers['osm']) {
            this.layerControls.push({
                id: "osm",
                control: this.addRadio(this._id + "-osm", "OpenStreetMap", this._panelBodySelector, "osm", activeBackgroundMap === 'osm')
            });
        }

        if(!disabledLayers['cartoDb']) {
            this.layerControls.push({
                id: "cartoDb",
                control: this.addRadio(this._id + "-carto-db", "Carto DB basemap", this._panelBodySelector, "cartoDb", activeBackgroundMap === 'cartoDb')
            });
        }

        if(!disabledLayers['bingAerial']) {
            this.layerControls.push({
                id: "bingAerial",
                control: this.addRadio(this._id + "-bing-aerial", "Bing Aerial", this._panelBodySelector, "bingAerial", activeBackgroundMap === 'bingAerial')
            });
        }

        if(!disabledLayers['landsat']) {
            this.layerControls.push({
                id: "landsat",
                control: this.addRadio(this._id + "-landsat", "Blue Marble", this._panelBodySelector, "landsat", activeBackgroundMap === 'landsat')
            })
        }
	};

	/**
	 * Add background layers to a map
	 * @param map {WorldWindMap}
	 */
	BackgroundLayersPanel.prototype.addLayersToMap = function(map){
		this.layerControls.forEach(function(control){
			map.layers.addBackgroundLayer(control.id, this._id);
		});
		this.toggleLayers();
	};

	/**
	 * Add listeners to controls
	 */
	BackgroundLayersPanel.prototype.addEventsListeners = function(){
		this.addRadioOnClickListener();
	};

	/**
	 * Hide all background layers and show only the selected one
	 */
	BackgroundLayersPanel.prototype.toggleLayers = function(){
		var self = this;
		setTimeout(function(){
			self.layerControls.forEach(function(item, index){
				var radio = item.control.getRadiobox();
				var dataId = radio.attr("data-id");
				if (radio.hasClass("checked")){
					self._mapStore.getAll().forEach(function(map){
						map.layers.showBackgroundLayer(dataId);
					});
				} else {
					self._mapStore.getAll().forEach(function(map){
						map.layers.hideBackgroundLayer(dataId);
					});
				}
			});
		},50);
	};

	return BackgroundLayersPanel;
});
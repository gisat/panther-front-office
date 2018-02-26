define([
    '../error/ArgumentError',
    '../util/Logger',

	'jquery',
	'worldwind'
], function (ArgumentError,
             Logger,

             $) {
	var ClickRecognizer = WorldWind.ClickRecognizer;

	/**
	 * The tool for controlling
	 * @param wwd {WorldWind}
	 * @constructor
	 */
	var SelectionController = function (wwd) {
	    if(!wwd) {
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SelectionController", "constructor", "missingWebWorldWind"));
        }

		this._wwd = wwd;

		this._enabled = false;

        this.ctrl = false;

        this._clickRecognizer = new ClickRecognizer(wwd, function (recognizer) {
			this.retrieveInfoForPoint(recognizer);
		}.bind(this));

		$(document).keydown(function(event){
			if(event.which=="17") {
				this.ctrl = true;
			}
		}.bind(this));
		$(document).keyup(function(event){
			if(event.which=="17") {
				this.ctrl = false;
			}
		}.bind(this));
	};

	Object.defineProperties(SelectionController.prototype, {
		enabled: {
			get: function() {
				return this._enabled;
			},
			set: function(enabled) {
				this._enabled = enabled;
			}
		}
	});

	SelectionController.prototype.retrieveInfoForPoint = function (recognizer) {
		if(!this.enabled) {
			return;
		}

		var pointObjects = this._wwd.pick(this._wwd.canvasCoordinates(recognizer.clientX, recognizer.clientY));

		var latitude = pointObjects.objects[0].position.latitude;
		var longitude = pointObjects.objects[0].position.longitude;

		// Selection layers.
		var layers = this.getBaseLayerIds().map(function(layer){
			return 'layers[]='+layer+'&';
		});
		var url = Config.url + 'rest/area?latitude='+latitude+'&longitude='+longitude+'&' + layers.join('');

		$.get(url, function(data){
			if(this.ctrl) {
				this.selectAreas(data.areas);
			} else {
				this.switchSelected(data.areas);
			}
		}.bind(this));
	};

	SelectionController.prototype.switchSelected = function(areas) {
		Select.select(areas.map(function(area){
			return {
				at: ThemeYearConfParams.auCurrentAt,
				gid: area.gid,
				loc: area.location
			};
		}), false, false);
		Select.colourMap(Select.selectedAreasMap);
	};

	/**
	 * It adds all given gids among selected areas.
	 * @param areas
	 */
	SelectionController.prototype.selectAreas = function(areas) {
		var areasToSelect = [];
		var currentlySelected = Select.selectedAreasMap[Select.actualColor];

		areas.forEach(function (area) {
			var unit = {
				at: ThemeYearConfParams.auCurrentAt,
				gid: area.gid,
				loc: area.location
			};

			var contained = false;
			areasToSelect = currentlySelected.filter(function (selected) {
				if (selected.at === unit.at && selected.gid === unit.gid && selected.loc === unit.loc) {
					contained = true;
					return false;
				}
			});
			if (!contained) {
				areasToSelect.push(unit);
			}
		});

		Select.select(areasToSelect, true, false);
		Select.colourMap(Select.selectedAreasMap);
	};

	//TODO: Refactor, duplicate code.
	SelectionController.prototype.getBaseLayerIds = function() {
		var auRefMap = OlMap.auRefMap;
		var locations;
		if (ThemeYearConfParams.place.length > 0){
			locations = [Number(ThemeYearConfParams.place)];
		} else {
			locations = ThemeYearConfParams.allPlaces;
		}
		var year = JSON.parse(ThemeYearConfParams.years)[0];
		var areaTemplate = ThemeYearConfParams.auCurrentAt;

		var layers = [];
		for (var place in auRefMap){
			locations.forEach(function(location){
				if (auRefMap.hasOwnProperty(place) && place == location){
					for (var aTpl in auRefMap[place]){
						if (auRefMap[place].hasOwnProperty(aTpl) && aTpl == areaTemplate){
							for (var currentYear in auRefMap[place][aTpl]){
								if (auRefMap[place][aTpl].hasOwnProperty(currentYear) && currentYear == year){
									var unit = auRefMap[place][aTpl][currentYear];
									if (unit.hasOwnProperty("_id")){
										layers.push(Config.geoserver2Workspace + ':layer_'+unit._id);
									}
								}
							}
						}
					}
				}
			});
		}
		return layers;
	};

	return SelectionController;
});
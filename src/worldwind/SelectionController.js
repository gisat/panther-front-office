
import WorldWind from '@nasaworldwind/worldwind';

import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';

let ClickRecognizer = WorldWind.ClickRecognizer;

let Config = window.Config;
let Select = window.Select;
let ThemeYearConfParams = window.ThemeYearConfParams;
let OlMap = window.OlMap;

/**
 * The tool for controlling
 * @param wwd {WorldWind}
 * @constructor
 */
let $ = window.$;
class SelectionController {
    constructor(wwd) {
        if (!wwd) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SelectionController", "constructor", "missingWebWorldWind"));
        }

        this._wwd = wwd;

        this._enabled = false;

        this.ctrl = false;

        this._clickRecognizer = new ClickRecognizer(wwd, function (recognizer) {
            this.retrieveInfoForPoint(recognizer);
        }.bind(this));

        $(document).keydown(function (event) {
            if (event.which === 17) {
                this.ctrl = true;
            }
        }.bind(this));
        $(document).keyup(function (event) {
            if (event.which === 17) {
                this.ctrl = false;
            }
        }.bind(this));
    };

    get enabled() {
        return this._enabled
    }

    set enabled(enabled) {
        this._enabled = enabled;
    }

    retrieveInfoForPoint(recognizer) {
        if (!this.enabled) {
            return;
        }

        let pointObjects = this._wwd.pick(this._wwd.canvasCoordinates(recognizer.clientX, recognizer.clientY));

        let latitude = pointObjects.objects[0].position.latitude;
        let longitude = pointObjects.objects[0].position.longitude;

        // Selection layers.
        let layers = this.getBaseLayerIds().map(function (layer) {
            return 'layers[]=' + layer + '&';
        });
        let url = Config.url + 'rest/area?latitude=' + latitude + '&longitude=' + longitude + '&' + layers.join('');

        $.get(url, function (data) {
            if (this.ctrl) {
                this.selectAreas(data.areas);
            } else {
                this.switchSelected(data.areas);
            }
        }.bind(this));
    };

    switchSelected(areas) {
        Select.select(areas.map(function (area) {
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
    selectAreas(areas) {
        let areasToSelect = [];
        let currentlySelected = Select.selectedAreasMap[Select.actualColor];

        areas.forEach(function (area) {
            let unit = {
                at: ThemeYearConfParams.auCurrentAt,
                gid: area.gid,
                loc: area.location
            };

            let contained = false;
            // eslint-disable-next-line
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
    getBaseLayerIds() {
        let auRefMap = OlMap.auRefMap;
        let locations;
        if (ThemeYearConfParams.place.length > 0) {
            locations = [Number(ThemeYearConfParams.place)];
        } else {
            locations = ThemeYearConfParams.allPlaces;
        }
        let year = JSON.parse(ThemeYearConfParams.years)[0];
        let areaTemplate = ThemeYearConfParams.auCurrentAt;

        let layers = [];
        for (let place in auRefMap) {
            locations.forEach(function (location) {
                if (auRefMap.hasOwnProperty(place) && place === location) {
                    for (let aTpl in auRefMap[place]) {
                        if (auRefMap[place].hasOwnProperty(aTpl) && aTpl === areaTemplate) {
                            for (let currentYear in auRefMap[place][aTpl]) {
                                if (auRefMap[place][aTpl].hasOwnProperty(currentYear) && currentYear === year) {
                                    let unit = auRefMap[place][aTpl][currentYear];
                                    if (unit.hasOwnProperty("_id")) {
                                        layers.push(Config.geoserver2Workspace + ':layer_' + unit._id);
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
}

export default SelectionController;
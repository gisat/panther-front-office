import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import FeatureInfoTool from './FeatureInfoTool';
import LayerInfoWindow from './LayerInfoWindow';

let polyglot = window.polyglot;

/**
 *
 * @param options {Object}
 * @param options.store {Object}
 * @param options.store.map {MapStore}
 * @param options.store.state {StateStore}
 * @constructor
 */
class LayerInfoTool extends FeatureInfoTool {
    constructor(options) {
        super(options);

        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoTool", "constructor", "missingId"));
        }
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FeatureInfoTool', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.map) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FeatureInfoTool', 'constructor', 'Store map must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FeatureInfoTool', 'constructor', 'Store state must be provided'));
        }

        this._store = options.store;
    };

    rebuild() {
    };

    build() {
        this._infoWindow = this.buildInfoWindow();
    };

    buildInfoWindow() {
        return new LayerInfoWindow({
            target: this._floaterTarget,
            id: this._id + "-window",
            title: polyglot.t("layerInfo"),
            store: {
                state: this._store.state
            }
        });
    };

    activate() {
        let self = this;
        let maps = this._store.map.getAll();
        maps.forEach(function (map) {
            map.layerInfoListener = map.getLayersInfo.bind(map, self.rebuildWindow.bind(self));
            map._wwd.addEventListener("click", map.layerInfoListener);
        });
    };

    deactivate() {
        let self = this;
        let maps = this._store.map.getAll();
        maps.forEach(function (map) {
            if (map.layerInfoListener) {
                map._wwd.removeEventListener("click", map.layerInfoListener);
            }
            self._infoWindow.setVisibility("hide");
        });
    };

    rebuildWindow(data) {
        this._infoWindow.rebuild(data);
    };
}

export default LayerInfoTool;
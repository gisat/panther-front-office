

import ArgumentError from '../../../error/ArgumentError';
import FeatureInfoWindow from './FeatureInfoWindow';
import Logger from '../../../util/Logger';
import View from '../../View';

import './FeatureInfoTool.css';


/**
 * It creates Feature Info functionality
 * @param options {Object}
 * @param options.id {string} id of the element
 * @param options.control2dClass {string} class of the tool used in ExtJS to identify a tool
 * @param options.dispatcher {Object} Object for handling events in the application.
 * @param options.store {Object}
 * @param options.store.map {MapStore}
 * @param options.store.state {StateStore}
 * @constructor
 */
let $ = window.$;
class FeatureInfoTool extends View {
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


        this._floaterTarget = $("body");
        this._id = options.id;
        this._dispatcher = options.dispatcher;
        this._store = options.store;

        this.build();
    };

    /**
     * Build Feature info basic content
     */
    build() {
        this._infoWindow = this.buildInfoWindow(true, true, true);
    };

    /**
     * Build new window for displaying information about feature
     * @param resizable {boolean}
     * @param hasSettings {boolean}
     * @param hasFooter {boolean}
     * @returns {FeatureInfoWindow}
     */
    buildInfoWindow(resizable, hasSettings, hasFooter) {
        return new FeatureInfoWindow({
            target: this._floaterTarget,
            id: this._id + "-window",
            resizable: resizable,
            hasSettings: hasSettings,
            hasFooter: hasFooter,
            store: {
                state: this._store.state
            }
        });
    };

    /**
     * Rebuild Feature info for specific attributes and map. If the feautre info functionality is activated, deactivate it
     * @param attributes {Array}
     */
    rebuild(attributes) {
        this._attributes = attributes;
    };

    /**
     * Activate feature info functionality for World Wind
     */
    activateFor3D() {
        let self = this;
        let maps = this._store.map.getAll();
        maps.forEach(function (map) {
            map.addClickRecognizer(self.onWorldWindClick.bind(self), "gid");
        });
    };

    /**
     * Deactive feature info functionality for World wind map
     */
    deactivateFor3D() {
        this.hideComponents();
        let maps = this._store.map.getAll();
        maps.forEach(function (map) {
            map.disableClickRecognizer();
        });
    };

    /**
     * Hide feature info window and settings window
     */
    hideComponents() {
        this._infoWindow.setVisibility("hide");
        if (this._infoWindow._settings) {
            this._infoWindow._settings.close();
        }
    };

    /**
     * Execute on World wind map click
     * @param period {number} id of period connected with current map
     * @param gid {number} id of the gid
     * @param screenCoord {Object} x:{number},y:{number} screen coordinates of click event
     */
    onWorldWindClick(gid, period, screenCoord) {
        if (gid) {
            this._infoWindow.rebuild(this._attributes, gid, period);
            this._infoWindow.setVisibility("show");
            this._infoWindow.setScreenPosition(screenCoord.x, screenCoord.y, true);
        } else {
            this.hideComponents();
        }
    };
}

export default FeatureInfoTool;
import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';

import LayerToolFloater from './LayerToolFloater';
import LayerToolIcon from './LayerToolIcon';

/**
 * Basic class for layer tool
 * @param options {Object}
 * @param options.active {boolean} true, if legend window is open
 * @param options.class {string}
 * @param options.name {string} name of the window
 * @param options.layerMetadata {Object}
 * @param options.target {JQuery} selector of a target element
 * @constructor
 */
let $ = window.$;
class LayerTool {
    constructor(options) {
        if (!options.target || options.target.length === 0) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTool", "constructor", "missingTarget"));
        }

        this._active = options.active || false;
        this._name = options.name || "layer";
        this._target = options.target;
        this._class = options.class || "";
        this._maps = options.maps || null;

        this._layerMetadata = options.layerMetadata;

        if (this._layerMetadata){
            // todo do it better, now it is just for default map
            let map = this._maps[0];
            this._layer = map.layers.getLayerById(this._layerMetadata.id);
            this._id = "layer-tool-" + this._layerMetadata.id;
        }
    };


    addEventsListener() {
        this.addIconOnClickListener();
        this.addFloaterCloseListener();
    };

    /**
     * Add tool icon
     * @params name {string} name of the icon
     * @params type {string} html class for icon
     * @params fileName {string} name of the icon file
     * @returns {LayerToolsIcon}
     */
    buildIcon(name, type, fileName) {
        return new LayerToolIcon({
            active: this._active,
            id: type + "-" + this._id,
            class: type,
            fileName: fileName,
            target: this._target,
            title: name
        });
    };

    /**
     * Add tool floater
     * @params name {string} name of the floater
     * @params type {string} html class for floater
     * @returns {LayerToolsFloater}
     */
    buildFloater(name, type) {
        return new LayerToolFloater({
            active: this._active,
            id: type + "-" + this._id,
            class: this._class + "-floater " + type,
            name: this._name,
            target: $("#main")
        });
    };

    /**
     * Hide floater and switch icon
     */
    hide() {
        this._iconSelector.removeClass("open");
        this._floaterSelector.removeClass("open");
    };

    /**
     * Show/hide legend on icon click
     */
    addIconOnClickListener() {
        let self = this;
        this._iconSelector.on("click", function () {
            let icon = $(this);
            if (icon.hasClass("open")) {
                icon.removeClass("open");
                self._floaterSelector.removeClass("open");
            } else {
                icon.addClass("open");
                self._floaterSelector.addClass("open");
                if ($("#sidebar-reports").hasClass("hidden")) {
                    self._floaterSelector.css({
                        right: "48px"
                    })
                }
                self.addContent();
                setTimeout(function () {
                    window.Stores.notify('floaters#sort', {
                        fromExt: false,
                        floaterJQuerySelector: self._floaterSelector
                    });
                }, 50);
            }
        });
    };

    /**
     * Handle icon state on floater close
     */
    addFloaterCloseListener() {
        let self = this;
        this._floaterSelector.find(".window-close").on("click", function () {
            setTimeout(function () {
                let floater = self._floaterSelector;
                if (floater.hasClass("open")) {
                    self._iconSelector.addClass("open");
                } else {
                    self._iconSelector.removeClass("open");
                }
            }, 50);
        });
    };
}

export default LayerTool;
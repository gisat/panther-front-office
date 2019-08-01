

import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';

import LayerDownload from './download/LayerDownload';
import LayerLegend from './legend/LayerLegend';
import LayerOpacity from './opacity/LayerOpacity';
import LayerMetadata from './metadata/LayerMetadata';
import Legend from './legend/Legend';
import Opacity from './opacity/Opacity';

import './LayerTools.css';

/**
 * Class representing layer tools
 * @param options {Object}
 * @param options.id {string} id of the element
 * @param options.name {name} name of the element
 * @param options.class {string}
 * @param options.target {Object} JQuery selector of target element
 * @param options.maps {Array} list of current maps
 * @param options.layers {Array} associated layers
 * @param options.style {Object} associated style
 * @constructor
 */
let $ = window.$;
class LayerTools {
    constructor(options) {
        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTools", "constructor", "missingId"));
        }
        if (!options.class) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTools", "constructor", "missingClass"));
        }
        if (!options.target || options.target.length === 0) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTools", "constructor", "missingTarget"));
        }

        this._target = options.target;
        this._id = options.id;
        this._name = options.name;
        this._class = options.class;
        this._mapStore = options.mapStore;
        this._stateStore = options.stateStore;
        this._layers = options.layers || null;
        this._style = options.style || null;

        this.tools = [];
        this.build();
    };

    /**
     * Build tools container
     */
    build() {
        $(this._target).append('<div id="layer-tool-box-' + this._id + '" class="layer-tools"></div>');
        this._toolsContainer = $('#layer-tool-box-' + this._id);
    };

    clear() {
        this._toolsContainer.html('');
    };

    /**
     * Return tools container
     * @returns {*|jQuery|HTMLElement}
     */
    getContainer() {
        return this._toolsContainer;
    };

    /**
     * Build opacity tool for layer
     * @param maps {Array} List of WorldWindMaps
     * @param layerMetadata {Object}
     * @returns {Opacity}
     */
    addOpacity(layerMetadata, maps) {
        let opacity = new Opacity({
            active: false,
            class: this._class,
            name: layerMetadata.name,
            layerMetadata: layerMetadata,
            target: this._toolsContainer,
            maps: maps
        });
        this.tools.push(opacity);
        return opacity;
    };

    /**
     * NEW! Build legend for layers
     * @returns {LayerLegend}
     */
    buildLegend() {
        let legend = new LayerLegend({
            id: this._id,
            name: this._name,
            target: this._toolsContainer,
            layers: this._layers,
            style: this._style,
            stateStore: this._stateStore
        });
        this.tools.push(legend);
        return legend;
    };

	/**
     * Build metadata for layers
     * @returns {LayerMetadata}
     */
    buildMetadata(layers) {
        let metadata = new LayerMetadata({
            id: this._id,
            name: 'Metadata',
            class: this._class,
            target: this._toolsContainer,
            layers: layers,
            style: this._style
        });
        this.tools.push(metadata);
        return metadata;
    };

    /**
     * NEW! Build opacity control for layers
     * @returns {LayerOpacity}
     */
    buildOpacity() {
        let opacity = new LayerOpacity({
            id: this._id,
            name: this._name,
            class: this._class,
            target: this._toolsContainer,
            layers: this._layers,
            mapStore: this._mapStore,
            stateStore: this._stateStore,
            style: this._style
        });
        this.tools.push(opacity);
        return opacity;
    };

    buildDownload(){
		let download = new LayerDownload({
			id: this._id,
			name: this._name,
			target: this._toolsContainer,
			layers: this._layers,
		});
		this.tools.push(download);
		return download;
    };

    /**
     * Hide all tool floaters
     */
    hide() {
        this.tools.forEach(function (tool) {
            tool.hide();
        });
    };
}

export default LayerTools;


import S from 'string';
import _ from 'underscore';

import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';

import Checkbox from '../../inputs/checkbox/Checkbox';
import LayerControl from './LayerControl/LayerControl';
import PanelRow from './panelRow/PanelRow';
import Radiobox from '../../inputs/checkbox/Radiobox';

import './WorldWindWidgetPanel.css';

let Stores = window.Stores;

/**
 * Class representing a panel of WorldWindWidgetPanels
 * @param options {Object}
 * @param options.id {string} id of element
 * @param options.name {string} name of panel
 * @param options.target {JQuery} JQuery selector of target element
 * @param options.currentMap {WorldWindMap}
 * @param options.store {Object}
 * @param options.store.map {MapStore}
 * @constructor
 */
let $ = window.$;
class WorldWindWidgetPanel {
    constructor(options) {
        if (!options.id){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanel", "constructor", "missingId"));
        }
        if (!options.name){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanel", "constructor", "missingName"));
        }
        if (!options.target || options.target.length === 0){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanel", "constructor", "missingTarget"));
        }
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanel', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.map){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanel', 'constructor', 'Store map must be provided'));
        }

        this._id = options.id;
        this._name = options.name;
        this._dispatcher = options.dispatcher;
        this._target = options.target;

        this._isOpen = true;
        if (options.hasOwnProperty("isOpen")){
            this._isOpen = options.isOpen;
        }
        this._mapStore = options.store.map;
        this.build();
    };


    /**
     * Build panel
     */
    build() {
        let html = S(`
        <div id="{{panelId}}-panel" class="widget-panel">
            <div class="panel-header open" id="{{panelId}}-panel-header">
                <div class="panel-icon expand-icon"></div>
                <div class="panel-icon folder-icon"></div>
                <h3>{{name}}</h3>
            </div>
            <div class="panel-body open" id="{{panelId}}-panel-body">
            </div>
        </div>
        `).template({
            panelId: this._id,
            name: this._name
        }).toString();
        this._target.append(html);

        this._panelSelector = $("#" + this._id + "-panel");
        this._panelHeaderSelector = $("#" + this._id + "-panel-header");
        this._panelBodySelector = $("#" + this._id + "-panel-body");
        this.toggleState(this._isOpen);

        this.addEventsListeners();
    };

    /**
     * Add listeners
     */
    addEventsListeners() {
        this.addCheckboxOnClickListener();
    };

    /**
     * Remove all layers from this panel
     */
    clear(group) {
        this._panelBodySelector.html('');
        this.clearLayers(group);
    };

    /**
     * Remove all layers from specific group from map and all floaters connected with this group
     */
    clearLayers(group) {
        $("." + group + "-floater").remove();

        this._mapStore.getAll().forEach(function (map) {
            map.layers.removeAllLayersFromGroup(group);
        });

        if (group === "selectedareasfilled" || group === "areaoutlines") {
            this._panelBodySelector.find(".layer-row[data-id=" + group + "]").removeClass("checked");
        } else {
            this._panelBodySelector.find(".layer-row").removeClass("checked");
        }
    };

    /**
     * Show/hide whole panel (header including)
     * @param action {string} CSS display value
     */
    displayPanel(action) {
        this._panelSelector.css("display", action);
    };

    /**
     * Show/hide panel
     * @param state {boolean} true, if panel should be shown
     */
    toggleState(state) {
        this._panelHeaderSelector.toggleClass("open", state);
        this._panelBodySelector.toggleClass("open", state);
    };

    /**
     * Add layer group to panel
     * @param id {string}
     * @param name {string}
     * @returns {*|jQuery|HTMLElement} Selector of the group
     */
    addLayerGroup(id, name) {
        let group = this._panelBodySelector.find("#" + id + "-panel-layer-group");
        if (group.length === 0) {
            this._panelBodySelector.append('<div class="panel-layer-group" id="' + id + '-panel-layer-group">' +
                '<div class="panel-layer-group-header open">' +
                '<div class="panel-icon expand-icon"></div>' +
                '<div class="panel-icon folder-icon"></div>' +
                '<h3>' + name + '</h3></div>' +
                '<div class="panel-layer-group-body open"></div>' +
                '</div>');
        }
        return $("#" + id + "-panel-layer-group").find(".panel-layer-group-body");
    };

    /**
     * Add item to the panel
     * @param id {string} id of the layer
     * @param name {string} name of the layer
     * @param target {*|jQuery|HTMLElement} Selector of the group
     * @param visible {boolean} true, if layer should be visible
     */
    addLayerControl(id, name, target, visible) {
        return this.addPanelRow(id, name, target, visible);
    };

    addPanelRow(id, name, target, visible) {
        return new PanelRow({
            active: visible,
            id: id,
            groupId: this._id,
            name: name,
            target: target
        });
    };

    /**
     * Add checkbox to panel
     * @param id {string} id of checkbox
     * @param name {string} label
     * @param target {JQuery} JQuery selector of target element
     * @param dataId {string} id of data connected with thischeckbox
     * @param checked {boolean} true if checkbox should be checked
     * @returns {Checkbox}
     */
    addCheckbox(id, name, target, dataId, checked) {
        return new Checkbox({
            id: id,
            name: name,
            target: target,
            containerId: this._id + "-panel-body",
            dataId: dataId,
            checked: checked,
            class: "layer-row"
        });
    };

    /**
     * Add radiobox to panel
     * @param id {string} id of radio box
     * @param name {string} label
     * @param target {JQuery} JQuery selector of target element
     * @param dataId {string} id of data connected with this radio
     * @param checked {boolean} true if radio should be checked
     * @returns {Radiobox}
     */
    addRadio(id, name, target, dataId, checked) {
        return new Radiobox({
            id: id,
            name: name,
            target: target,
            containerId: this._id + "-panel-body",
            dataId: dataId,
            checked: checked
        });
    };

    /**
     * Add onclick listener to every radio
     */
    addRadioOnClickListener() {
        this._panelBodySelector.find(".radiobox-row").on("click", this.toggleLayers.bind(this));
    };

    /**
     * Add onclick listener to every checkbox
     */
    addCheckboxOnClickListener() {
        this._panelBodySelector.on("click", ".checkbox-row", this.toggleLayer.bind(this));
    };

    /**
     * Hide/show layer
     * @param event {Object}
     */
    toggleLayer(event) {
        var self = this;
        setTimeout(function(){
            var checkbox = $(event.currentTarget);
            var layerId = checkbox.attr("data-id");

            // check/uncheck layer in 2D
            var checkbox2d = $("td[data-for=" + layerId + "]").find("input");
            Stores.notify("checklayer", checkbox2d);

            checkbox2d.trigger("click", ["ctrl"]);



            var control = _.find(self._layersControls, function(control){return control._id === layerId});

            if (checkbox.hasClass("checked")){
                self._mapStore.getAll().forEach(function(map){
                    map.layers.showLayer(layerId);
                });
            } else {
                self._mapStore.getAll().forEach(function(map){
                    map.layers.hideLayer(layerId);
                });
                control._toolBox.hide();
            }
        },50);
    };

    /**
     * Go through the list of active layers and turn on all active layers from a group
     * @param groupId {string} id of the group
     */
    switchOnActiveLayers(groupId) {
        this._activeLayers = Stores.activeLayers;
        let self = this;
        this._activeLayers.forEach(function (layer) {
            if (layer.group === groupId) {
                let checkbox = $(".checkbox-row[data-id=" + layer.id + "]");
                checkbox.addClass("checked");
                self._mapStore.getAll().forEach(function (map) {
                    map.layers.showLayer(layer.id, layer.order);
                });
            }
        });
    };

    // --- Common methods after multiple maps functionality added --- //
    // All methods below are reviewed and used
    // TODO review obsolete methods above this line after Thematic layers an AU layers for multiple maps will be implemented
    hidePanel() {
        this._panelSelector.addClass("hidden");
    }

    /**
     * Build layer control and add tools
     * @param target {Object} JQuery selector of target element
     * @param id {string} id of contol row
     * @param name {string} label
     * @param layers {Array} list of associated layers
     * @param style {Object|null} associated style, if exist
     * @param layerTemplateId {number}
     */
    buildLayerControlRow(target, id, name, layers, style, layerTemplateId) {
		let checked = false;
		if (this._groupId === "info-layers"){
			checked = this.isControlActive(layerTemplateId);
		} else {
			checked = this.isControlActive(id, layers);
		}
		let control = this.buildLayerControl(target, id, name, layers, style, checked, this._groupId);
		this._layersControls.push(control);
		control.layerTools.buildOpacity();
		if (this._groupId === "info-layers" || this._groupId === "wms-layers"){
			control.layerTools.buildLegend();
		}
		if (checked){
			this.addLayer(control);
		}
    };

    /**
     * Check the state of the control
     * @param controlId {string|number} id of the control
     * @returns {boolean} true, if the control should be selected
     */
    isControlActive(controlId) {
        let existingControl = _.find(this._previousLayersControls, function(control){return control._id === controlId});
        return !!((existingControl && existingControl.active));
    };

    /**
     * Build checkbox controlling layer in all available maps
     *
     * @param target {Object} Jquery selector of targete element
     * @param id {number} id of layer template
     * @param name {string} name of layer
     * @param layers {Array} list of layers attached to this control
     * @param [style] {Object} Optional parameter. Id of the style
     * @param [checked] {boolean} Optional parameter. True, if the layer should be visible by default.
     * @param groupId {string} id of the group of layers ("wms-layers", "info-layers")
     * @returns {LayerControl}
     */
    buildLayerControl(target, id, name, layers, style, checked, groupId) {
        return new LayerControl({
            id: id,
            name: name,
            target: target,
            layers: layers,
            maps: this._allMaps,
            style: style,
            checked: checked,
            groupId: groupId
        });
    };

    /**
     * Switch on/off layer in all available maps
     * @param event {Object}
     */
    switchLayer(event) {
        let self = this;
        setTimeout(function(){
            let checkbox = $(event.currentTarget);
            let layerId = checkbox.attr("data-id");

            // TODO hotfix - sometimes control._id is a number
            let control = _.find(self._layersControls, function(control){
                return control._id == layerId;
            });
            if (checkbox.hasClass("checked")){
                control.active = true;
                self.addLayer(control);
                if (self._groupId === "wms-layers"){
                    self._dispatcher.notify('wmsLayer#add', {layerKey: control.layers[0].id})
                } else if (self._groupId === "info-layers"){
					let templates = _.map(control.layers, function(layer){return layer.layerTemplateId});
					self._dispatcher.notify('infoLayer#add', {layerTemplates: templates})
				}
            } else {
                control.active = false;
                control.layerTools.hide();
                self.removeLayer(control);
                if (self._groupId === "wms-layers"){
                    self._dispatcher.notify('wmsLayer#remove', {layerKey: control.layers[0].id})
                } else if (self._groupId === "info-layers"){
					let templatesToRemove = _.map(control.layers, function(layer){return layer.layerTemplateId});
					self._dispatcher.notify('infoLayer#remove', {layerTemplates: templatesToRemove})
				}
            }
        },50);
    };

    /**
     * Remove layer from all available maps
     * @param control {Object}
     */
    removeLayer(control) {
        let self = this;
        control.layers.forEach(function(layerData){
            self._allMaps.forEach(function(map){
                let layerPeriods = layerData.periods;
                if (layerData.period){
                    layerPeriods = layerData.period
                }
                if (self.samePeriod(layerPeriods, map._period)){
                    let prefix = "";
                    if (self._idPrefix){
                        prefix = self._idPrefix + "-";
                    }
                    let id = prefix + layerData.id;
                    if (control.style){
                        id = id + "-" + control.style.path;
                    }
                    let layer = map.layers.getLayerById(id);
                    map.layers.removeLayer(layer);
                }
            });
        });
    };

    /**
     * Add layer to all available maps
     * @param control {Object}
     */
    addLayer(control) {
        let self = this;
        if (control.active){
            control.layers.forEach(function(layerData){
                self._allMaps.forEach(function(map){
                    let layerPeriods = layerData.periods;
                    if (layerData.period){
                        layerPeriods = layerData.period
                    }
                    if (self.samePeriod(layerPeriods, map._period)){
                        let layer = {};
                        let prefix = "";
                        let stylePaths = "";
                        let customParams = null;
                        let url = null;
                        let layerName = layerData.name;

                        if (self._idPrefix){
                            prefix = self._idPrefix + "-";
                        }
                        let layerId = prefix + layerData.id;
                        if (control.style){
                            stylePaths = control.style.path;
                            if (control.style.name){
                                layerName = layerName + " - " + control.style.name;
                            }
                            layerId = layerId + "-" + stylePaths;
                        }
                        if (layerData.custom && layerData.custom !== "undefined"){
                            customParams = JSON.parse(layerData.custom);
                        }
                        if (layerData.url){
                            url = layerData.url;
                        }
                        layer.data = {
                            id: layerId,
                            url: url,
                            opacity: control.opacity,
                            customParams: customParams,
                            stylePaths: stylePaths,
                            name: layerName,
                            order: layerData.order
                            // path: layerPaths.split(",")[0]
                        };
                        if (self._groupId === "wms-layers"){
                            layer.data.layerPaths = layerData.layer;
                            map.layers.addWmsLayer(layer.data, self._id, true);
                        } else if (self._groupId === "info-layers") {
                            layer.data.layerPaths = layerData.path;
                            map.layers.addInfoLayer(layer.data, self._id, true);
                        }
                    }
                });
            });
        }
    };

    /**
     * Check if layerPeriod is the same as mapPeriod or if layerPeriods includes mapPeriod
     * @param layerPeriods {Array|number} periods connected with layer
     * @param mapPeriod {number} id of period connected with map
     * @returns {boolean}
     */
    samePeriod(layerPeriods, mapPeriod) {
        if (_.isArray(layerPeriods)) {
            return _.indexOf(layerPeriods, mapPeriod) !== -1;
        } else {
            return layerPeriods === mapPeriod;
        }

    }
}

export default WorldWindWidgetPanel;


import Actions from '../../../actions/Actions';
import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';
import RemoteJQ from '../../../util/RemoteJQ';

import SnowUrlParser from './SnowUrlParser';
import TableSnowConfigurations from '../../table/TableSnowConfigurations';
import Widget from '../Widget';

import './SnowWidget.css';

/**
 * Class representing widget for handling with saved configurations of snow portal
 * @param options {Object}
 * @param options.iFrame {PanelIFrame}
 * @param options.mapController {SnowMapController}
 * @param options.dispatcher {Object}
 * @constructor
 */
let $ = window.$;
class SnowWidget extends Widget {
    constructor(options) {
        super(options);
        if (!options.iFrame) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SnowWidget", "constructor", "missingIFrame"));
        }
        this._iFrame = options.iFrame;
        this._mapController = options.mapController;
        this._dispatcher = options.dispatcher;

        this._iFrameId = this._iFrame.getElementId();
        this._urlParser = new SnowUrlParser();

        this.build();
        this.deleteFooter(this._widgetSelector);
    };

    /**
     * Build basic view of the widget
     */
    build() {
        this._widgetBodySelector.append('<div id="snow-widget-container"></div>');
        this._container = $('#snow-widget-container');

        this._container.append('<h3 class="snow-table-caption">Current configuration</h3>');
        this._currentConfigurationTable = this.buildTable('snow-current-cfg-table');

        this._container.append('<h3 class="snow-table-caption">Saved configurations</h3>');
        this._savedConfigurationTable = this.buildTable('snow-saved-cfg-table');

        this.addEventListeners();
    };

    /**
     * Rebuild widget
     */
    rebuild() {
        // this._iFrameUrl = "http://35.165.51.145/snow/albania/20170401-20170404/slstr-sentinel3";
        //this._iFrameUrl = "http://snow.gisat.cz/snow/";
        this._iFrameUrl = document.getElementById(this._iFrameId).contentWindow.location.href;

        this.rebuildCurrentConfiguration(this._iFrameUrl);
        this.rebuildSavedConfigurations();
        this._mapController.rebuild();

        this.handleLoading("hide");
    };

    /**
     * @param currentIFrameUrl {string}
     */
    rebuildCurrentConfiguration(currentIFrameUrl) {
        let currentConfiguration = [{
            url: currentIFrameUrl,
            user: 1
        }];
        let currentData = this.parseDataForTable(currentConfiguration);
        if (currentData.length > 0) {
            this.redrawCurrentCfgTable(currentData);
        }
    };

    /**
     * Rebuild table with saved configurations
     */
    rebuildSavedConfigurations() {
        let self = this;
        this.getConfigurations().then(function (data) {
            let records = self.parseDataForTable(data.data);
            self.redrawSavedCfgTable(records);
        });
    };

    /**
     * Redraw table with current configurations
     * @param data {Array}
     */
    redrawCurrentCfgTable(data) {
        this._currentConfigurationTable.clear();
        let self = this;
        data.forEach(function (record) {
            self._currentConfigurationTable.addRecord(record, false);
        })
    };

    /**
     * Redraw table with saved configurations
     * @param data {Array}
     */
    redrawSavedCfgTable(data) {
        this._savedConfigurationTable.clear();
        let self = this;
        data.forEach(function (record) {
            self._savedConfigurationTable.addRecord(record, true);
        })
    };

    /**
     * Prepare data for tables
     * @param cfg {Array} list with objects, where url property represents saved configuration
     * @returns {Array}
     */
    parseDataForTable(cfg) {
        let configurations = [];
        let self = this;
        cfg.forEach(function (record) {
            let cfgPart = self._urlParser.parse(record.url);
            if (cfgPart) {
                if (record.uuid) {
                    cfgPart.uuid = record.uuid;
                }
                if (record.ts) {
                    cfgPart.timeStamp = record.converted_date;
                }
                if (record.name) {
                    cfgPart.name = record.name;
                }
                configurations.push(cfgPart);
            }
        });
        return configurations;
    };

    /**
     * Build table with configurations
     * @param id {string} id of the table
     * @returns {TableSnowConfigurations}
     */
    buildTable(id) {
        return new TableSnowConfigurations({
            elementId: id,
            class: "snow-cfg-table",
            targetId: this._container.attr("id")
        });
    };

    /**
     * Add event listeners
     */
    addEventListeners() {
        this.addMinimiseButtonListener();
        this.addIFrameChangeListener();
        this.addSaveButtonListener();
        this.addShowButtonListener();
        this.addDeleteButtonListener();
        this.addLoggingListener();
    };


    addIFrameChangeListener() {
        let self = this;
        let snow = $("#" + this._iFrameId);
        snow.on("load", function () {
            self.rebuild();

            //check every 3 seconds if url has changed
            setInterval(function () {
                self.checkUrl();
            }, 1000);
        });
    };

    checkUrl() {
        let currentUrl = document.getElementById(this._iFrameId).contentWindow.location.href;
        if (currentUrl !== this._iFrameUrl) {
            this.rebuild();
        }
    };

    /**
     * Add listener to the minimise button
     */
    addMinimiseButtonListener() {
        let self = this;
        this._widgetSelector.find(".widget-minimise").on("click", function () {
            let id = self._widgetSelector.attr("id");
            self._widgetSelector.removeClass("open");
            $(".item[data-for=" + id + "]").removeClass("open");
        });
    };

    /**
     * Add listener to save button
     */
    addSaveButtonListener() {
        let self = this;
        this._currentConfigurationTable.getTable().on("click", ".save-composites", function () {
            let button = $(this);
            let url = button.parents("tr").attr("data-url");
            let name = button.parents("tr").find(".snow-cfg-name").val();
            if (name.length < 1) {
                alert("Fill in the name!");
                return;
            }

            self.saveConfigurations(name, url).then(function () {
                button.attr("disabled", true);
                self.rebuildSavedConfigurations();
            });
        });
    };

    /**
     * Add listener to show button
     */
    addShowButtonListener() {
        let self = this;
        this._savedConfigurationTable.getTable().on("click", ".show-composites", function () {
            let button = $(this);
            let url = button.parents("tr").attr("data-url");
            self._iFrame.rebuild(url);
            self.rebuildCurrentConfiguration(url);
        });
    };

    /**
     * Add listener to delete button
     */
    addDeleteButtonListener() {
        let self = this;
        this._savedConfigurationTable.getTable().on("click", ".delete-composites", function () {
            let button = $(this);
            let id = button.parents("tr").attr("data-id");
            self.deleteConfiguration(id).then(function (result) {
                if (result.status === "OK") {
                    self.rebuildSavedConfigurations();
                } else {
                    console.warn("The record was not deleted!")
                }
            });
        });
    };

    /**
     * Add listener for logging actions
     */
    addLoggingListener() {
        this._dispatcher.addListener(this.rebuildAfterLogging.bind(this));
    };

    /**
     * Rebuild widget if user has been changed
     * @param type {string} type of event
     */
    rebuildAfterLogging(type) {
        if (type === Actions.userChanged) {
            this.rebuild();
        }
    };

    /**
     * Get configurations from server
     * @returns {Promise}
     */
    getConfigurations() {
        return new RemoteJQ({
            url: "rest/snow/getconfigurations"
        }).get();
    };

    /**
     * Save configurations
     * @options {string} current iframe url
     * @returns {Promise}
     */
    saveConfigurations(name, location) {
        return new RemoteJQ({
            url: "rest/snow/saveconfigurations",
            params: {
                url: location,
                name: name
            }
        }).post();
    };

    /**
     * Delete configuration
     * @options {string} id of configuration
     * @returns {Promise}
     */
    deleteConfiguration(id) {
        return new RemoteJQ({
            url: "rest/snow/deleteconfiguration",
            params: {
                uuid: id
            }
        }).post();
    };

}

export default SnowWidget;
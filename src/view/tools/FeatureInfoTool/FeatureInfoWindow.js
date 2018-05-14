
import S from 'string';
import _ from 'underscore';

import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';
import Filter from '../../../util/Filter';
import MapExport from '../../../util/MapExport';
import viewUtils from '../../../util/viewUtils';
import FeatureInfoSettings from './FeatureInfoSettings';

import './FeatureInfoWindow.css';

let polyglot = window.polyglot;

/**
 * It creates the window for deature info functionality
 * @param options {Object}
 * @param options.id {string} id of the element
 * @param options.target {Object} JQuery object
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @param [options.resizable] {boolean} optional
 * @param [options.hasSettings] {boolean} optional
 * @param [options.hasFooter] {boolean} optional
 * @param [options.title] {string} optional
 * @constructor
 */
let $ = window.$;
class FeatureInfoWindow {
    constructor(options) {
        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoWindow", "constructor", "missingElementId"));
        }
        if (!options.target) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoWindow", "constructor", "missingTargetElement"));
        }
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FeatureInfoWindow', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FeatureInfoWindow', 'constructor', 'Store state must be provided'));
        }

        this._id = options.id;
        this._target = options.target;

        this._resizable = options.resizable;
        this._hasSettings = options.hasSettings;
        this._hasFooter = options.hasFooter;
        this._title = options.title;

        this._windowHeight = 0;
        this._windowWidth = 0;

        this._store = options.store;

        this.build();
    };

    /**
     * Build basic structure of info window and attach listeners
     */
    build() {
        let classes = "fi-window";
        let title = polyglot.t("featureNameGid");

        if (this._hasSettings) {
            classes += " has-settings"
        }
        if (this._hasFooter) {
            classes += " has-footer"
        }
        if (this._title) {
            title = this._title;
        }

        let html = S(`
        <div id="{{id}}" class="{{classes}} floating-window">
            <div class="feature-info-window-header">
                <div class="feature-info-title">{{featureName}}</div>
                <div class="feature-info-tools">
                    <div title="Close" class="floater-tool widget-close feature-info-close">
                        &#x2716
                    </div>
                    <div title="Settings" class="floater-tool widget-settings feature-info-settings">
                        <i class="fa fa-sliders"></i>
                    </div>
                </div>
            </div>
            <div class="feature-info-window-body">
            </div>
            <div class="feature-info-window-footer">
                <div class="floater-row">
                    <div class="widget-button widget-button-export" id="export-feature-info-csv">{{exportToXls}}</div>
                </div>
            </div>
            <div class="overlay">
                <div id="loading-screen-content-wrap">
                    <div id="loading-screen-content">
                        <div class="a-loader-container small blackandwhite">
                            <i class="i1"></i>
                            <i class="i2"></i>
                            <i class="i3"></i>
                            <i class="i4"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `).template({
            id: this._id,
            classes: classes,
            featureName: title,
            exportToXls: polyglot.t("exportToXls")
        }).toString();
        this._target.append(html);
        this._infoWindow = $("#" + this._id);
        this._infoWindowBodySelector = this._infoWindow.find(".feature-info-window-body")

        if (this._hasSettings) {
            this._settings = this.buildSettings();
            this._settingsConfirm = this._settings.getConfirmButton();
            this.addSettingsOpenListener();
            this.addSettingsChangeListener();
        }

        this.addCloseListener();
        this.makeDraggable();
    };

    /**
     * Rebuild Feature Info Window and settings window according to current configuration
     * @param attributes {Array} List of all available attributes
     * @param gid {string} id of the chosen gid
     * @param period {number|Array} Id of period of the chosen map. It is number for World wind, array for Ext/OpenLayers
     */
    rebuild(attributes, gid, period) {
        // rebuild window for selecting attributes
        this._settings.rebuild(attributes);

        // get selected attributes. This attributes will be shown in a feature info window
        this._selectedAttributes = this._settings.getSelectedAttributes();

        this._gid = gid;
        this._periods = _.isArray(period) ? period : [period];
        this._appState = this._store.state.current();

        this.rebuildWindow();
    };

    /**
     * Rebuild the content of the feature info window. Get data about area and then redraw the feature info window.
     */
    rebuildWindow() {
        this.handleLoading("show");

        new Filter({
            dispatcher: function () {
            },
            store: {
                state: this._store.state
            }
        }).featureInfo(this._selectedAttributes, this._gid, this._periods).then(this.redraw.bind(this));
    };

    /**
     * Redraw the window with attributes and their values for given area.
     * @param data {Object} Data about area
     */
    redraw(data) {
        let content = "";
        let attributes = data[0].attributes;
        if (attributes.length > 0) {
            attributes.forEach(function (item) {
                let value = item.value;
                let units = "";

                if (typeof value === "number") {
                    value = viewUtils.numberFormat(value, true, 2);
                }
                if (item.units) {
                    units = " (" + item.units + ")";
                }

                content += '<tr><td><i>' + item.asName + '</i>: ' + item.name + units + '</td><td>' + value + '</td></tr>';
            });
            this._infoWindow.removeClass("no-data");
        } else {
            content += '<tr><td>' + polyglot.t("noAttributesInfo") + '</td><td></td></tr>';
            this._infoWindow.addClass("no-data");
        }

        this._infoWindow.find(".feature-info-title")
            .html(data[0].name + " (" + data[0].gid + ")")
            .attr("title", data[0].name + " (" + data[0].gid + ")");
        this._infoWindowBodySelector.html('<table>' + content + '</table>');
        this.addExportListener();
        this.handleLoading("hide");
    };

    /**
     * Build settings window
     * @returns {FeatureInfoSettings}
     */
    buildSettings() {
        return new FeatureInfoSettings({
            target: this._target,
            widgetId: this._id
        });
    };

    /**
     * Make window draggable
     */
    makeDraggable() {
        this._infoWindow.draggable({
            containment: "body",
            handle: ".feature-info-window-header"
        }).on("click drag", function () {
            window.Stores.notify('floaters#sort', {
                fromExt: false,
                floaterJQuerySelector: $(this)
            });
        });
    };

    /**
     * Add listener for feature data download
     */
    addExportListener() {
        let places = this._appState.places;
        if (!places || places[0] === "All places") {
            places = this._appState.allPlaces;
        }

        this._mapExport = new MapExport({
            attributes: JSON.stringify(this._selectedAttributes),
            places: JSON.stringify(places),
            periods: JSON.stringify(this._periods),
            areaTemplate: JSON.stringify(this._appState.currentAuAreaTemplate),
            gids: JSON.stringify([this._gid])
        });

        let self = this;
        $("#export-feature-info-csv").off("click.featureInfo.csv").on("click.featureInfo.csv", function () {
            self._mapExport.export("xls");
        });
    };

    /**
     * Add onclick listener to close button
     */
    addCloseListener() {
        let self = this;
        this._infoWindow.find(".feature-info-close").on("click", function () {
            self.setVisibility("hide");
        });
    };

    /**
     * It adds onclick listener to settings tool for opening of the settings dialog window
     */
    addSettingsOpenListener() {
        let self = this;
        $(".feature-info-settings").on("click", function () {
            setTimeout(function () {
                $('#' + self._id + '-settings').addClass('open');
                window.Stores.notify('floaters#sort', {
                    fromExt: false,
                    floaterJQuerySelector: $('#' + self._id + '-settings')
                });
            }, 50);
        });
    };

    /**
     * It adds the onclick listener to the settings dialog window for rebuilding of the feature info view
     */
    addSettingsChangeListener() {
        let self = this;
        this._settingsConfirm.on("click", function () {
            self._selectedAttributes = self._settings.getSelectedAttributes();
            self.rebuildWindow(self._selectedAttributes);
        })
    };

    /**
     * Showing/hiding info window
     * @param option {string} show or hide
     */
    setVisibility(option) {
        if (option === "show") {
            this._infoWindow.show(200);
        } else if (option === "hide") {
            this._infoWindow.hide(200);
        }
    };

    /**
     * Set the position of info window on the screen
     * @param x {number}
     * @param y {number}
     * @param isWorldWind {boolean} true, if map is worldWind
     */
    setScreenPosition(x, y, isWorldWind) {
        let self = this;

        let infoWidth = Number(self._infoWindow.css("width").slice(0, -2));
        let infoHeight = Number(self._infoWindow.css("height").slice(0, -2));
        let screenWidth = $(window).width();
        let screenHeight = $(window).height();

        let mapOffsetTop = $('#app-map').offset().top;
        let offsetTop = 5;
        let offsetLeft = 5;

        if (!isWorldWind) {
            offsetTop += mapOffsetTop;
        }
        self._infoWindow.offset({
            left: x + offsetLeft,
            top: y + offsetTop
        });

        // x position
        if (x + infoWidth + offsetLeft >= screenWidth) {
            self._infoWindow.offset({
                left: x - offsetLeft - infoWidth
            });
        }
        //y position
        if (y + infoHeight + offsetTop >= screenHeight) {
            self._infoWindow.offset({
                top: y + offsetTop - infoHeight
            });
        }


        if (infoHeight !== this._windowHeight) {
            setTimeout(function () {
                self._windowHeight = infoHeight;
                self._windowWidth = infoWidth;
                self.setScreenPosition(x, y, isWorldWind);
            }, 500);
        }
    };

    /**
     * Show/hide loading overlay
     * @param state {string}
     */
    handleLoading(state) {
        let display;
        switch (state) {
            case "show":
                display = "block";
                break;
            case "hide":
                display = "none";
                break;
            default:
                break;
        }
        this._infoWindow.find(".overlay").css("display", display);
    };
}

export default FeatureInfoWindow;

import S from 'string';

import Actions from '../../../actions/Actions';
import ArgumentError from '../../../error/ArgumentError';
import CategorizeSettings from './CategorizeSettings';
import Logger from '../../../util/Logger';
import MapExport from '../../../util/MapExport';
import MultiSelectBox from '../inputs/multiselectbox/MultiSelectBox';
import SelectBox from '../inputs/selectbox/SelectBox';
import SliderBox from '../inputs/sliderbox/SliderBox';
import Settings from './EvaluationWidgetSettings';
import Widget from '../Widget';

import './EvaluationWidget.css';

let polyglot = window.polyglot;
let OneLevelAreas = window.OneLevelAreas;
let SelectedAreasExchange = window.SelectedAreasExchange;
let Select = window.Select;
let Observer = window.Observer;
let ThemeYearConfParams = window.ThemeYearConfParams;
let ExchangeParams = window.ExchangeParams;

/**
 * @param options {Object}
 * @param options.elementId {String} ID of widget
 * @param options.filter {Object} instance of class for data filtering
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @param options.targetId {String} ID of an element in which should be the widget rendered
 * @param options.name {String} Name of the widget
 * @constructor
 */
let $ = window.$;
class EvaluationWidget extends Widget {
    constructor(options) {
        super(options);

        if (!options.filter) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "EvaluationWidget", "constructor", "missingFilter"));
        }
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'EvaluationWidget', 'constructor', 'Stores must be provided'));
        }

        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "EvaluationWidget", "constructor", "missingStateStore"));
        }
        this._filter = options.filter;
        this._stateStore = options.store.state;
        this._settings = null;

        this._categorize = new CategorizeSettings({
            widgetId: "categorize",
            target: this._floaterTarget,
            aggregatedChart: options.aggregatedChart
        });

        this.build();
    };

    /**
     * It rebuilds the widget for given attributes. First, it collects metadata about each attribute, then it rebuilds all components of the widget
     * @param data {Object}
     * @param options {Object}
     */
    rebuild(data, options) {
        let attrForRequest;
        if (Array.isArray(data)) {
            attrForRequest = data;
        } else {
            attrForRequest = data.attributes;
        }

        let self = this;
        if (attrForRequest.length === 0) {
            self.toggleWarning("block", [1, 2, 3, 4]);
            self.handleLoading("hide");
            return;
        }

        if (!this._resizeListener) {
            this._resizeListener = true;
            this.addOnResizeListener();
        }
        this._initializeResize = false;
        this.handleLoading("show");
        this._attrForRequest = attrForRequest;

        let distribution = {
            type: 'normal',
            classes: this.computeNumOfClasses()
        };
        this._filter.statistics(attrForRequest, distribution).then(function (attributes) {
            self._attributes = [];
            self._attrForRequest = [];
            if (attributes.length > 0) {
                attributes.forEach(function (attribute) {
                    let about = {
                        attribute: attribute.attribute,
                        attributeName: attribute.attributeName,
                        attributeType: attribute.type,
                        attributeSet: Number(attribute.attributeSet),
                        attributeSetName: attribute.attributeSetName,
                        units: attribute.units,
                        active: attribute.active
                    };
                    self._attrForRequest.push(about);

                    if (about.attributeType === "numeric") {
                        if (self.attributeHasData(attribute)) {
                            self._attributes.push({
                                values: [Number(attribute.min), Number(attribute.max)],
                                distribution: attribute.distribution,
                                about: about
                            });
                        }
                    }
                    else if (about.attributeType === "boolean") {
                        self._attributes.push({
                            about: about
                        });
                    }
                    else if (about.attributeType === "text") {
                        self._attributes.push({
                            about: about,
                            values: attribute.values
                        });
                    }
                });
            }
            if (self._attributes.length) {
                self.toggleWarning("none");
                if (!options.hasOwnProperty("rebuildFooter") || options.rebuildFooter === true) {
                    self.prepareFooter();
                }
                self.rebuildViewAndSettings();
            } else {
                self.toggleWarning("block", [1, 2]);
                self.handleLoading("hide");
            }

            // clear categories and sets
            self._categorize.clearAll();
        });

        this.rebuildMap();
    };

    /**
     * Check, if there are any data for this attribute
     * @param attribute {Object}
     * @returns {boolean} false, if there are no data for this attribute
     */
    attributeHasData(attribute) {
        let hasData = false;
        attribute.distribution.forEach(function (cls) {
            if (cls !== 0) {
                hasData = true;
            }
        });
        if (attribute.min === attribute.max) {
            hasData = true;
        }
        return hasData;
    };

    /**
     * According to the width of floater set number of classes for histogram
     * @returns {number} Number of classes
     */
    computeNumOfClasses() {
        let width = this._widgetSelector.width();
        if (width < 350) {
            return 20;
        }
        if (width >= 350 && width < 450) {
            return 30;
        } else if (width >= 450 && width < 550) {
            return 40;
        } else {
            return 50;
        }
    };

    /**
     * Build the widget basic view of the widget
     */
    build() {
        this.buildSettings();
        this._dispatcher.addListener(this.onEvent.bind(this));
    };

    /**
     * Create settings icon and attach the listener for opening
     */
    buildSettings() {
        let tool = "settings";
        let name = polyglot.t("settings");
        this._widgetSelector.find(".floater-tools-container").append('<div title="' + name + '" class="floater-tool widget-' + tool + '">' +
            '<i class="fa fa-sliders"></i>' +
            '</div>');
        this.addSettingsListener();

        this._settings = new Settings({
            target: this._floaterTarget,
            widgetId: this._widgetId
        });
    };

    /**
     * It rebuilds the map. If map is present, it removes previously added layers
     */
    rebuildMap() {
    };

    /**
     * Rebuild settings with given attributes, get all categories (one category per attribute) and rebuild the inputs (one input per attribute - slider, checkbox or select menu).
     */
    rebuildViewAndSettings() {
        this._settings.rebuild(this._attributes);
        this._categories = this._settings.getCategories();
        this.setAttributesState(this._categories);
        this.rebuildInputs(this._categories);
        this.disableExports();

        this._settingsConfirm = this._settings.getConfirmButton();
        this.addSettingsChangeListener(this._settingsConfirm);
    };


    /**
     * It prepares all the inputs for data filtering (checkbox for attributes with boolean values, slider for numeric, select menu for text).
     * Finally, get amount of areas which fit to current values of inputs.
     * @param categories {Object} data about categories
     */
    rebuildInputs(categories) {
        this._widgetBodySelector.html("");
        this._inputs = {
            checkboxes: [],
            sliders: [],
            selects: []
        };

        let self = this;
        for (let key in categories) {
            if (categories.hasOwnProperty(key) && categories[key].active === true) {
                let input = categories[key].input;
                let multioptions = categories[key].multioptions;
                let name = categories[key].name;
                let units = categories[key].attrData.about.units;
                let attrId = categories[key].attrData.about.attribute;
                let attrSetId = categories[key].attrData.about.attributeSet;
                let id = "input-as-" + attrSetId + "-attr-" + attrId;
                if (input === "slider") {
                    let min = categories[key].attrData.values[0];
                    let max = categories[key].attrData.values[1];
                    let step = 0.0005;
                    let thresholds = [min, max];
                    let slider = self.buildSliderInput(id, name, units, thresholds, step, attrId, attrSetId);
                    slider.distribution = categories[key].attrData.distribution;
                    slider.origValues = categories[key].attrData.values;
                    this._inputs.sliders.push(slider);
                }

                else if (input === "checkbox") {
                    let checkbox = this.buildCheckboxInput(id, name, this._widgetBodySelector);
                    this._inputs.checkboxes.push(checkbox);
                }

                else if (input === "select") {
                    let options = categories[key].attrData.values;
                    let select;
                    if (multioptions) {
                        select = this.buildMultiSelectInput(id, name, options);
                    } else {
                        select = this.buildSelectInput(id, name, options);
                    }
                    this._inputs.selects.push(select);
                }
            }
        }

        // TODO remove and uncomment when backend is ready
        if (this._inputs.checkboxes.length === 0 && this._inputs.sliders.length === 0 && this._inputs.selects.length === 0) {
            self.handleLoading("hide");
        } else {
            this.amount();
        }
        //this.amount();
        this.addSliderListener();
        this.addInputsListener();
    };

    /**
     * It returns the box with select input
     * @param id {string} ID of the data theme
     * @param name {string} Name of the data theme
     * @param options {Array} Select options
     * @returns {SelectBox}
     */
    buildSelectInput(id, name, options) {
        return new SelectBox({
            id: id,
            name: name,
            target: this._widgetBodySelector,
            data: options
        });
    };

    /**
     * It returns the box with multi select input
     * @param id {string} ID of the data theme
     * @param name {string} Name of the data theme
     * @param options {Array} Select options
     * @returns {MultiSelectBox}
     */
    buildMultiSelectInput(id, name, options) {
        return new MultiSelectBox({
            id: id,
            name: name,
            target: this._widgetBodySelector,
            data: options
        });
    };

    /**
     * It returns the slider box
     * @param attrId {string} ID of the attribute
     * @param attrSetId {string} ID of the attribute set ID
     * @param id {string} ID of the data theme
     * @param name {string} Name of the data theme
     * @param units {string} Units
     * @param thresholds {Array} Start and end value of the slider
     * @param step {number} step of the slider
     * @returns {SliderBox}
     */
    buildSliderInput(id, name, units, thresholds, step, attrId, attrSetId) {
        return new SliderBox({
            attrId: attrId,
            attrSetId: attrSetId,
            id: id,
            name: name,
            units: units,
            target: this._widgetBodySelector,
            range: thresholds,
            step: step,
            values: thresholds,
            isRange: true
        });
    };

    /**
     * It builds the footer button
     */
    prepareFooter() {
        let currentState = this._stateStore.current();

        let addCategoryClass = "hidden";
        if (currentState.scopeFull.aggregated === true) {
            addCategoryClass = "";
        }

        let html = S(`<div class="floater-row footer-buttons">
            <div class="widget-button hidden" id="evaluation-confirm"></div>
            <div class="widget-button" id="evaluation-unselect" disabled="disabled">{{clearSelection}}</div>
            <div class="widget-button secondary {{hidden}}" id="evaluation-add-category" disabled="disabled">{{addCategory}}</div>
        </div>
        <div class="floater-row row-export">
            <div class="widget-button widget-button-export" id="export-json" disabled="disabled">{{exportToGeoJson}}</div>
            <div class="widget-button widget-button-export" id="export-xls" disabled="disabled">{{exportToXls}}</div>
        </div>
        <div class="floater-row row-export">
            <!--<div class="widget-button widget-button-export" id="export-shp" disabled="disabled">{{exportToShp}}</div>-->
            <div class="widget-button widget-button-export" id="export-csv" disabled="disabled">{{exportToCsv}}</div>
        </div>`).template({
            hidden: addCategoryClass,
            clearSelection: polyglot.t("clearSelection"),
            addCategory: polyglot.t("addCategory"),
            exportToGeoJson: polyglot.t("exportToGeoJson"),
            exportToXls: polyglot.t("exportToXls"),
            exportToShp: polyglot.t("exportToShp"),
            exportToCsv: polyglot.t("exportToCsv")
        }).toString();
        this._widgetSelector.find(".floater-footer").html("").append(html);
    };

    /**
     * Filter the data according to current state of inputs
     */
    filter() {
        let self = this;

        setTimeout(function () {
            self._filter.filter(self._categories, "filter").then(function (areas) {
                let count = 0;
                if (areas.length > 0) {
                    count = areas.length;
                }
                if (count > 0) {
                    // TODO: Refactor this change.
                    SelectedAreasExchange.data.data = areas;
                    self.addDownloadListener(areas);

                    if (!OneLevelAreas.hasOneLevel) {
                        let areasToSelect = [];

                        areas.forEach(function (area) {
                            let unit = {
                                at: ThemeYearConfParams.auCurrentAt,
                                gid: area.gid,
                                loc: area.loc
                            };

                            areasToSelect.push(unit);
                        });

                        Select.select(areasToSelect, true, false);
                        Select.colourMap(Select.selectedAreasMap);
                    }
                    $('#evaluation-unselect').attr("disabled", false);
                }
                self.handleLoading("hide");
            });
        }, 100);
    };

    /**
     * Get the amount of areas which fit to current values of inputs.
     */
    amount() {
        let self = this;
        this.handleLoading("show");
        setTimeout(function () {
            self._filter.filter(self._categories, "amount").then(function (result) {
                self.addSelectionConfirmListener(result);
                self.addCategoryListener();
                self.rebuildPopups(self._inputs.sliders);
                self.handleLoading("hide");
            });
        }, 100);
    };

    /**
     * It rebuilds the histograms with current values
     * @param sliders {Array} array of slider objects
     */
    rebuildPopups(sliders) {
        sliders.forEach(function (slider) {
            slider.rebuildPopup();
            if (slider.hasOwnProperty("histogram")) {
                slider.histogram.rebuild(slider.distribution, slider._values, slider.origValues);
            }
        });
    };

    /**
     * It adds listener to confirm button. If there is at least one selected area, do the filter
     * @param amount {Object} Number of currently filtered areas
     */
    addSelectionConfirmListener(amount) {
        let self = this;
        let count = 0;

        if (Select.selectedAreasMap && Select.selectedAreasMap[Select.actualColor] && Select.selectedAreasMap[Select.actualColor].length > 0) {
            count = Select.selectedAreasMap[Select.actualColor].length;
            if (count > 0) {
                $('#evaluation-confirm').attr("disabled", true);
                $('#evaluation-unselect').attr("disabled", false);
            }
        } else if (amount && amount.hasOwnProperty("amount")) {
            count = amount.amount;
        }

        if (count > 0) {
            let areasName = polyglot.t("areas");
            if (count === 1) {
                areasName = polyglot.t("area");
            }
            $('#evaluation-confirm').html(polyglot.t("select") + " " + count + " " + areasName)
                .removeClass("hidden")
                .off("click.confirm")
                .on("click.confirm", function () {
                    self.handleLoading("show");
                    self.filter();
                    if (!OneLevelAreas.hasOneLevel) {
                        $(this).attr("disabled", true);
                    }
                });
        }
        else {
            $('#evaluation-confirm').html(polyglot.t("noAreaSelected"))
                .off("click.confirm");
        }

        self.addUnselectListener();
    };

    addCategoryListener() {
        let self = this;

        $('#evaluation-add-category')
            .attr("disabled", false)
            .off("click.addcategory")
            .on("click.addcategory", function () {
                $(".floating-window").removeClass("active");
                setTimeout(function () {
                    $('#categorize-settings').addClass('open').addClass('active');
                    let attributes = self._filter.getAttributesFromCategories(self._categories);
                    self._categorize.addCategory(attributes);
                }, 50);
            });
    };

    /**
     * Add listener to unselect button
     */
    addUnselectListener() {
        let self = this;
        $('#evaluation-unselect').off("click.unselect").on("click.unselect", function () {
            SelectedAreasExchange.data.data = [];
            if (OneLevelAreas.hasOneLevel) {
                self._map.removeLayers();
                Observer.notify('selectInternal');
            } else {
                self._dispatcher.notify("selection#clearAll");
            }
            self.resetButtons();
        });
    };

    /**
     * Add listener to export buttons
     * @param areas {Array} List of selected areas
     */
    addDownloadListener(areas) {
        let self = this;
        let filteredAreas = [];

        let locations;
        if (ThemeYearConfParams.place.length > 0) {
            locations = [Number(ThemeYearConfParams.place)];
        } else {
            locations = ThemeYearConfParams.allPlaces;
        }

        areas.forEach(function (area) {
            filteredAreas.push(area.gid);
        });
        this._mapExport = new MapExport({
            attributes: JSON.stringify(this._attrForRequest),
            places: JSON.stringify(locations),
            periods: ThemeYearConfParams.years,
            areaTemplate: ThemeYearConfParams.auCurrentAt,
            gids: JSON.stringify(filteredAreas)
        });

        $("#export-shp").off("click.shp").attr("disabled", false).on("click.shp", function () {
            self._mapExport.export("shp");
        });
        $("#export-csv").off("click.csv").attr("disabled", false).on("click.csv", function () {
            self._mapExport.export("csv");
        });
        $("#export-json").off("click.json").attr("disabled", false).on("click.json", function () {
            self._mapExport.export("json");
        });
        $("#export-xls").off("click.xls").attr("disabled", false).on("click.xls", function () {
            self._mapExport.export("xls");
        });
    };

    /**
     * It adds change listeners to inputs in widget body. Each time some change occurs, filter function is executed
     */
    addInputsListener() {
        let self = this;
        this._widgetSelector.find(".ui-checkboxradio-label").off("click.checkboxradio")
            .on("click.checkboxradio", self.amount.bind(self))
            .on("click.checkboxradio", self.disableExports.bind(self));
        this._widgetSelector.find(".selectmenu").off("selectmenuselect")
            .on("selectmenuselect", self.amount.bind(self))
            .on("selectmenuselect", self.disableExports.bind(self));
        this._widgetSelector.find(".slider-row").off("slidechange")
            .on("slidechange", self.amount.bind(self))
            .on("slidechange", self.disableExports.bind(self));
        this._widgetSelector.find(".checkbox-row").off("click.inputs")
            .on("click.inputs", self.amount.bind(self))
            .on("click.inputs", self.disableExports.bind(self));
    };

    /**
     * Rebuild histograms on floater resize
     */
    addOnResizeListener() {
        let self = this;
        let id = this._widgetSelector.attr("id");
        let resizeElement = document.getElementById(id);

        let timeout;
        window.resize.addResizeListener(resizeElement, function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                if (self._initializeResize) {
                    if (self._inputs) {
                        self.rebuildPopups(self._inputs.sliders);
                    }
                    self.rebuild(self._attrForRequest, {
                        rebuildFooter: false
                    });
                }
                self._initializeResize = true;
            }, 500);
        });
    };

    /**
     * It adds onclick listener to settings tool for opening of the settings dialog window
     */
    addSettingsListener() {
        let self = this;
        let tool = "settings";
        $('#floater-' + self._widgetId + ' .widget-' + tool).on("click", function () {
            let floater = $('#' + self._widgetId + '-' + tool);
            floater.addClass('open');
            setTimeout(function () {
                window.Stores.notify('floaters#sort', {
                    fromExt: false,
                    floaterJQuerySelector: floater
                });
            }, 20);
        });
    };

    /**
     * It adds the onclick listener to the settings dialog window for rebuilding of the wiget's view
     * @param button {Object} JQuery object representing dailog confirm button
     */
    addSettingsChangeListener(button) {
        let self = this;
        button.off("click").on("click", function () {
            self._categories = self._settings.getCategories();
            self.setAttributesState(self._categories);
            self.rebuildInputs(self._categories);
            self.disableExports();
        })
    };

    /**
     * It adds listener to all sliders for positioning of slider popups
     */
    addSliderListener() {
        // todo do it better
        let isFirefox = typeof InstallTrigger !== 'undefined';
        if (!isFirefox) {
            let popup = $('.slider-popup');
            if (popup.length > 0) {
                let margin = popup.css("margin-top");
                this._widgetBodySelector.off("scroll").on("scroll", function (e) {
                    popup.css("margin-top", (margin.slice(0, -2) - e.target.scrollTop) + "px");
                });
            }
        }
    };

    /**
     * Prepare attributes for export
     * @param categories {Object}
     */
    setAttributesState(categories) {
        let attributes = [];
        for (let attr in categories) {
            if (categories.hasOwnProperty(attr)) {
                attributes.push(categories[attr].attrData.about);
            }
        }
        ExchangeParams.attributesState = attributes;
    };


    /**
     * Reset widget
     */
    resetWidget() {
        this.rebuildInputs(this._categories);
        this.resetButtons();
    };

    /**
     * Reset current selection
     */
    resetSelection() {
        this.amount();
        this.resetButtons();
    };

    /**
     * Switch buttons in footer to the default state
     */
    resetButtons() {
        this.disableExports();
        $('#evaluation-confirm').attr("disabled", false);
        $('#evaluation-unselect').attr("disabled", true);
    };

    /**
     * Disable export buttons
     */
    disableExports() {
        $("#export-shp, #export-csv, #export-xls, #export-json").attr("disabled", true);
    };

    /**
     * @param type {string}
     */
    onEvent(type) {
        if (type === Actions.selectionSelected) {
            this.addSelectionConfirmListener();
        } else if (type === Actions.selectionEverythingCleared) {
            this.resetWidget();
        } else if (type === Actions.selectionActiveCleared) {
            this.resetSelection();
        }
    };

}

export default EvaluationWidget;
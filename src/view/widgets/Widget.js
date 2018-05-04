import S from 'string';


import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';

import Checkbox from './inputs/checkbox/Checkbox';
import View from '../View';
import WidgetWarning from './WidgetWarning';

import './Widget.css';

let ExchangeParams = window.ExchangeParams;
let polyglot = window.polyglot;

/**
 * Base class for creating floating widgets.
 * @param {Object} options
 * @param {string} options.elementId - Id of the widget
 * @param {Object} [options.dispatcher] - Optional parameter.
 * @param {string} [options.placeholderTargetId] - Optional parameter for old view. Id of the target, where should be placeholders rendered.
 * @param {string} [options.name] - Optional parameter. Name of the widget
 * @param {boolean} [options.isFloaterExtAlike] - Optional parameter. If true, floater will look like Ext window
 * @param {boolean} [options.isOpen] - Optional parameter. If true, floater is open by default
 * @param {boolean} [options.isExpandable] - Optional parameter. If true, floater could be expanded
 * @param {boolean} [options.isExpanded] - Optional parameter. If true, floater is expanded by default
 * @param {boolean} [options.isPinnable] - Optional parameter. If true, floater could be pinned to the left side of Maps Container
 * @param {boolean} [options.isWithoutFooter] - Optional parameter. If true, floater is rendered without footer
 * @param {boolean} [options.is3dOnly] - Optional parameter. If true, floater will be visible in 3D mode only
 * @param {boolean} [options.is2dOnly] - Optional parameter. If true, floater will be visible in 2D mode only
 * @constructor
 */
let $ = window.$;
class Widget extends View {
    constructor(options) {
        super(options);
        if (!options.elementId) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "constructor", "missingElementId"));
        }

        this._floaterTarget = $("body");
        this._name = options.name || "";
        this._widgetId = options.elementId;
        this._isFloaterExtAlike = options.isFloaterExtAlike;
        this._isOpen = options.isOpen;
        this._isExpandable = options.isExpandable;
        this._isExpanded = options.isExpanded;
        this._isPinnable = options.isPinnable;
        this._isWithoutFooter = options.isWithoutFooter;
        this._is2dOnly = options.is2dOnly;
        this._is3dOnly = options.is3dOnly;

        if (options.dispatcher) {
            this._dispatcher = options.dispatcher;
        }
        if (options.placeholderTargetId) {
            this._placeholderTarget = $("#" + options.placeholderTargetId);
        }

        this.buildWidget();
    };

    /**
     * Build widget - render floater (and placeholder for old view)
     */
    buildWidget() {
        this.renderFloater();

        if (this._placeholderTarget) {
            this.renderPlaceholderForOldToolbar();
        }
        if (this._isOpen) {
            this.setState("floater-" + this._widgetId, true);
        }

        ExchangeParams.options.openWidgets["floater-" + this._widgetId] = this._widgetSelector.hasClass("open");
        this.handleLoading("show");
    };

    /**
     * Render floater for this widget
     */
    renderFloater() {
        let floaterClass = "";

        if (this._isFloaterExtAlike) {
            floaterClass = "inverse";
        }

        if (this._is2dOnly) {
            floaterClass += " only-2d";
        }

        if (this._is3dOnly) {
            floaterClass += " only-3d";
        }
        if (this._isExpandable) {
            floaterClass += " expandable";
            if (this._isExpanded) {
                floaterClass += " expanded";
            }
        }
        if (this._isPinnable) {
            floaterClass += " pinnable"
        }

        let floater = S(`
        <div id="floater-{{widgetId}}" class="floater floating-window {{floaterClass}}">
            <div class="floater-header">
                <div class="floater-header-title">{{name}}</div>
                <div class="floater-tools-container">
                    <div title="{{minimise}}" class="floater-tool widget-minimise">
                        <!--<img alt="{{minimise}}" src="{{minimiseSrc}}"/>-->
                        <span class="fa-stack">
                              <i class="fa fa-square-o fa-stack-2x"></i>
                              <i class="fa fa-window-minimize fa-stack-1x"></i>
                        </span>
                    </div>
                    <div title="{{expand}}" class="floater-tool widget-expand">
                        <i class="fa fa-expand"></i>
                    </div>
                    <div title="{{compress}}" class="floater-tool widget-compress">
                        <i class="fa fa-compress"></i>
                    </div>
                    <div title="{{pin}}" class="floater-tool widget-pin">
                        <i class="fa fa-thumb-tack"></i>
                    </div>
                    <div title="{{detach}}" class="floater-tool widget-detach">
                        <i class="fa fa-external-link"></i>
                    </div>
                </div>
            </div>
            <div class="floater-warning">
            </div>
            <div class="floater-body">
            </div>
            <div class="floater-footer">
            </div>
            <div class="floater-overlay">
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
            name: this._name,
            widgetId: this._widgetId,
            floaterClass: floaterClass,
            minimise: polyglot.t("minimise"),
            expand: polyglot.t("expand"),
            compress: polyglot.t("compress"),
            pin: polyglot.t("pinWidget"),
            detach: polyglot.t("expandMapToolsWidget")
        }).toString();

        this._floaterTarget.append(floater);
        this._widgetSelector = $("#floater-" + this._widgetId);
        this._widgetBodySelector = this._widgetSelector.find(".floater-body");
        this._widgetHeaderSelector = this._widgetSelector.find(".floater-header");
        this._warningSelector = this._widgetSelector.find(".floater-warning");
        this._widgetWarning = new WidgetWarning();

        if (this._isWithoutFooter) {
            this.deleteFooter(this._widgetSelector);
        }

        if (this._isExpandable) {
            this.addExpandListeners();
            if (this._isExpanded) {
                this._widgetExpandSelector.trigger("click");
            }
        }

        if (this._isPinnable) {
            this.addPinListeners();
        }
    };

    /**
     * Render placeholder for old view of top toolbar
     */
    renderPlaceholderForOldToolbar() {
        let placeholdersContainer = this._placeholderTarget.find('.placeholders-container');
        let placeholder = S(`
        <div id="placeholder-{{widgetId}}" class="placeholder open">
            <span>{{name}}</span>
            <div class="placeholder-tools-container">
                <div class="placeholder-tool widget-maximise">
                    <img alt="{{maximise}}" src="__new/img/maximise-icon.png"/>
                </div>
            </div>
        </div>
        `).template({
            name: this._name,
            widgetId: this._widgetId,
            maximise: polyglot.t("maximise")
        }).toString();
        placeholdersContainer.append(placeholder);

        this._placeholderSelector = $("#placeholder-" + this._widgetId);
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
        this._widgetSelector.find(".floater-overlay").css("display", display);
    };

    /**
     * Open/close floater
     * @param id {string} widget id
     * @param state {boolean} true to show floater
     */
    setState(id, state) {
        let floater = $("#" + id);
        let placeholder = $("#" + id.replace("floater", "placeholder"));
        if (state) {
            floater.addClass("open");
            placeholder.removeClass("open");
        } else {
            floater.removeClass("open");
            placeholder.addClass("open");
        }
    };

    /**
     * Delete floater footer
     */
    deleteFooter(floater) {
        floater.find(".floater-footer").remove();
    };

    /**
     * It returns the checkbox
     * @param id {string} ID of the data theme
     * @param name {string} Name of the data theme
     * @returns {Checkbox}
     */
    buildCheckboxInput(id, name, target) {
        return new Checkbox({
            id: id,
            name: name,
            target: target,
            containerId: "floater-" + this._widgetId
        });
    };

    /**
     * It shows in a widget body info about problems connected with this widget
     * @param action {string} CSS display value
     * @param warnings {Array} list of warnings codes
     */
    toggleWarning(action, warnings) {
        this._warningSelector.css("display", action);
        if (warnings) {
            let message = this._widgetWarning.generate(warnings);
            this._warningSelector.html(message);
        }
    };

    /**
     * Add listeners to expand buttons
     */
    addExpandListeners() {
        let self = this;
        this._widgetExpandSelector = this._widgetHeaderSelector.find(".widget-expand");
        this._widgetCompressSelector = this._widgetHeaderSelector.find(".widget-compress");
        this._widgetExpandSelector.off("click.expand").on("click.expand", function () {
            self._widgetSelector.addClass("expanded");
            self._widgetSelector.css({
                left: 0,
                top: 45
            });
            setTimeout(function () {
                self._widgetSelector.draggable("disable");
            }, 500);
        });
        this._widgetCompressSelector.off("click.compress").on("click.compress", function () {
            self._widgetSelector.removeClass("expanded");
            setTimeout(function () {
                self._widgetSelector.draggable("enable");
            }, 500);
        });
    };

    /**
     * Add listeners to pin buttons
     */
    addPinListeners() {
        let self = this;
        this._widgetPinSelector = this._widgetHeaderSelector.find(".widget-pin");
        this._widgetDetachSelector = this._widgetHeaderSelector.find(".widget-detach");
        this._widgetPinSelector.off("click.pin").on("click.pin", function () {
            self._widgetSelector.addClass("pinned");
            self._dispatcher.notify("mapsContainer#toolsPinned");
            self._widgetSelector.appendTo(".maps-container .map-tools");
            self._widgetSelector.css({
                left: 0,
                top: 0
            });
            setTimeout(function () {
                self._widgetSelector.draggable("disable");
            }, 500);
        });
        this._widgetDetachSelector.off("click.detach").on("click.detach", function () {
            self._widgetSelector.removeClass("pinned");
            self._dispatcher.notify("mapsContainer#toolsDetached");
            self._widgetSelector.appendTo("body");
            self._widgetSelector.css({
                left: 50,
                top: 100
            });
            setTimeout(function () {
                self._widgetSelector.draggable("enable");
            }, 500);
        });
    };
}

export default Widget;
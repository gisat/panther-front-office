
import S from 'string';

import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';

import './LayerToolFloater.css';

/**
 * Class representing floater of a layer tool
 * @param options {Object}
 * @param options.id {string} id of the floater
 * @param options.class {string} optional class of the floater
 * @param options.name {string} name of the tool floater
 * @param options.target {JQuery} selector of a target element
 * @param options.layer {WorldWind.Layer}
 * @param options.active {boolean} true if the icon should be active
 * @constructor
 */
let $ = window.$;
class LayerToolsFloater {
    constructor(options) {
        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerToolsFloater", "constructor", "missingId"));
        }
        if (!options.target || options.target.length === 0) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerToolsFloater", "constructor", "missingTarget"));
        }

        this._target = options.target;
        this._id = options.id;
        this._name = options.name || "Tool window";
        this._class = options.class || "";
        this._active = options.active || false;

        this.build();
    };

    /**
     * Build the icon
     */
    build() {
        this._class += " layer-tool-floater";
        if (this._active) {
            this._class += " open"
        }

        let html = S(`
        <div class="floating-window tool-window {{cls}}" id="{{id}}">
            <div class="tool-window-header layer-tool-floater-header">
                <div class="tool-window-title">{{name}}</div>
                <div class="tool-window-tools-container">
                    <div title="Close" class="floater-tool window-close">
                        &#x2716
                    </div>
                </div>
            </div>
            <div class="tool-window-body layer-tool-floater-body"></div>
        </div>
        `).template({
            id: this._id,
            cls: this._class,
            name: this._name
        }).toString();

        this._target.append(html);

        this._floaterSelector = $("#" + this._id);
        this._floaterBodySelector = $("#" + this._id + " .layer-tool-floater-body");

        this.addCloseListener();
        this.addDragging();
    };

    /**
     * @returns {*|jQuery|HTMLElement}
     */
    getElement() {
        return this._floaterSelector;
    };

    /**
     * @returns {*|jQuery|HTMLElement}
     */
    getBody() {
        return this._floaterBodySelector;
    };

    /**
     * Add content to the floater body
     * @param content {string} HTML
     */
    addContent(content) {
        this._floaterBodySelector.html('').append(content);
    };

    /**
     * Close the window
     */
    addCloseListener() {
        let self = this;
        $('#' + this._id + ' .window-close').off("click").on("click", self.close.bind(self));
    };

    /**
     * Enable dragging of settings window
     */
    addDragging() {
        $("#" + this._id).draggable({
            containment: "body",
            handle: ".layer-tool-floater-header",
            drag: function (ev, ui) {
                let element = $(this);
                element.css({
                    bottom: "auto"
                });
            }
        });
    };

    /**
     * Close window
     */
    close() {
        $('#' + this._id).removeClass("open");
    };
}

export default LayerToolsFloater;
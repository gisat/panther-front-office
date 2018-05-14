
import S from 'string';

import ArgumentError from '../../error/ArgumentError';
import Checkbox from '../widgets/inputs/checkbox/Checkbox';
import Logger from '../../util/Logger';

import './Settings.css';

let polyglot = window.polyglot;

/**
 * It builds the settings window and control all operations in it
 * @params options {Object}
 * @params options.target {Object} JQuery - target object, where should be the settings rendered
 * @params options.widgetId {string} Id of the connected widget
 * @constructor
 */
let $ = window.$;
class Settings {
    constructor(options) {
        if (!options.widgetId) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Settings", "constructor", "missingWidgetId"));
        }

        this._target = options.target;
        this._id = options.widgetId + '-settings';

        this.buildContent();
    };

    /**
     * Build the settings window, fill it with data and add listeners
     */
    buildContent() {
        let html = S(`
        <div class="floating-window tool-window settings-window" id="{{id}}">
            <div class="tool-window-header">
                <div class="tool-window-title">{{settings}}</div>
                <div class="tool-window-tools-container">
                    <div title="Close" class="floater-tool window-close settings-close">
                        &#x2716
                    </div>
                </div>
            </div>
            <div class="tool-window-body">
            </div>
            <div class="tool-window-footer">
                <div class="widget-button tool-window-button settings-confirm">{{confirm}}</div>
            </div>
        </div>
        `).template({
            id: this._id,
            settings: polyglot.t("settings"),
            confirm: polyglot.t("confirm")
        }).toString();
        if (!$("#" + this._id).length) {
            this._target.append(html);
        }

        this.addCloseListener();
        this.addDragging();
    };

    /**
     * It returns the dialog confirm button object
     * @returns {*|jQuery|HTMLElement}
     */
    getConfirmButton() {
        return $("#" + this._id + " .settings-confirm");
    };

    /**
     * Close window
     */
    close() {
        $('#' + this._id).removeClass("open").removeClass("active");
    };

    /**
     * It returns the checkbox row
     * @param id {string} id of the checkbox row
     * @param name {string} label
     * @param klass {string} additional class for checkbox row
     * @param dataId {string} if present, id of the attribute set row
     * @param checked {boolean} true if checkbox should be checked
     * @param parentCheckbox {string} id of the parent checkbox
     * @returns {Checkbox}
     */
    addCheckbox(id, name, klass, dataId, checked, parentCheckbox) {
        return new Checkbox({
            containerId: this._id,
            class: klass,
            checked: checked,
            dataId: dataId,
            id: id,
            name: name,
            parentCheckbox: parentCheckbox,
            target: this._settingsBody
        });
    };

    /**
     * Check/uncheck checkbox
     * @param checkbox {JQuery} checkbox selector
     * @param checked {boolean} true, if checkbox should be checked
     */
    handleCheckboxState(checkbox, checked) {
        if (checked) {
            checkbox.addClass("checked");
        } else {
            checkbox.removeClass("checked");
        }
    };

    /**
     * Close the settings window
     */
    addCloseListener() {
        let self = this;
        $('#' + this._id + ' .settings-close, #' + this._id + ' .settings-confirm').off("click").on("click", self.close.bind(self));
    };

    /**
     * Check/uncheck whole attribute set or all attributes
     */
    addMultiCheckListener() {
        let self = this;

        // whole attribute set
        $('#' + this._id + ' .attribute-set-row').off("click.atributeSet").on("click.atributeSet", function () {
            let asCheckbox = $(this);
            let dataId = asCheckbox.attr("data-id");
            let asCheckWas = asCheckbox.hasClass("checked");
            $('#' + self._id + ' .attribute-row').each(function () {
                let attrCheckbox = $(this);
                let arr = attrCheckbox.attr("data-id").split("-");
                let attrDataId = arr[0] + "-" + arr[1];
                if (dataId === attrDataId) {
                    let attrCheckState = attrCheckbox.hasClass("checked");
                    if (asCheckWas === attrCheckState) {
                        self.handleCheckboxState(attrCheckbox, !attrCheckState);
                    }
                }
            });
        });

        // all attributes
        $('#' + this._id + '-all-attributes').off("click.allattributes").on("click.allattributes", function () {
            let allCheckbox = $(this);
            let allCheckWas = allCheckbox.hasClass("checked");
            $('#' + self._id + ' .checkbox-row').not(this).each(function () {
                let attrCheckbox = $(this);
                let attrCheckState = attrCheckbox.hasClass("checked");
                if (allCheckWas === attrCheckState) {
                    self.handleCheckboxState(attrCheckbox, !attrCheckState);
                }
            });
        });
    };

    /**
     * Go through all checkboxes representing attributes and check/uncheck checkboxes for attribute sets or all attributes
     */
    reviewCheckboxesState() {
        let confirmButton = $('#' + this._id + ' .settings-confirm');
        let allAttributes = true;
        let atLeastOneAttribute = false;
        let self = this;
        $('#' + this._id + ' .checkbox-row.attribute-set-row').each(function () {
            let allAttributesInAs = true;
            let asCheckbox = $(this);
            let asId = asCheckbox.attr("id");
            $('#' + self._id + ' .checkbox-row.attribute-row[data-parent-checkbox = ' + asId + ']').each(function () {
                let attributeCheckbox = $(this);
                if (!attributeCheckbox.hasClass("checked")) {
                    allAttributes = false;
                    allAttributesInAs = false;
                } else {
                    atLeastOneAttribute = true;
                }
            });
            // handle as checkbox state
            self.handleCheckboxState(asCheckbox, allAttributesInAs);
        });

        // handle all attributes checkbox state
        self.handleCheckboxState($('#' + this._id + ' .checkbox-row.all-attributes-row'), allAttributes);

        // handle confirm button state
        if (atLeastOneAttribute) {
            confirmButton.attr("disabled", false);
        } else {
            confirmButton.attr("disabled", true);
        }
    };

    /**
     * Add listener on checkbox change
     */
    addCheckboxChangeListener() {
        let self = this;
        $('#' + this._id).find(".checkbox-row").off("click.changeAttributeState")
            .on("click.changeAttributeState", function () {
                self.rebuildAttributesState();
            });
    };

    /**
     * Enable dragging of settings window
     */
    addDragging() {
        $("#" + this._id).draggable({
            containment: "body",
            handle: ".tool-window-header",
            stop: function (ev, ui) {
                let element = $(this);
                element.css({
                    width: "",
                    height: ""
                });
            }
        });
    };
}

export default Settings;

import S from 'string';

import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';
import View from '../../../View';

import './Checkbox.css';


/**
 * This class represents the row with the checkbox
 * @param options {Object}
 * @param options.containerId {string} id of container
 * @param options.checked {boolean} true, if checkbox is checked
 * @param options.dataId {string}
 * @param options.id {string} ID of the checkbox
 * @param options.class {string} Class of the checkbox
 * @param options.parentCheckbox {string} id of the parent checkbox
 * @param options.name {string} Checkbox label
 * @param options.target {Object} JQuery object representing the target element where should be the checkbox rendered
 * @constructor
 */
let $ = window.$;
class Checkbox extends View {
    constructor(options) {
        super(options);

        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Checkbox", "constructor", "missingBoxId"));
        }
        if (!options.name) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Checkbox", "constructor", "missingBoxName"));
        }
        if (!options.target) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Checkbox", "constructor", "missingTarget"));
        }

        this._checked = options.checked || false;
        this._dataId = options.dataId || options.id;
        this._id = options.id;
        this._name = options.name;
        this._target = options.target;
        this._containerId = options.containerId;

        this._class = "";
        if (options.hasOwnProperty("class")) {
            this._class = options.class;
        }

        this._parentCheckbox = "";
        if (options.hasOwnProperty("parentCheckbox")) {
            this._parentCheckbox = options.parentCheckbox;
        }

        this.build();
    };

    /**
     * Build the checkbox row and add a listener to it
     */
    build() {
        let name = this._name.replace(/"/g, '&quot;');
        let html = `<div title="${name}" class="floater-row checkbox-row ${this._class}" id="${this._id}" data-id="${this._dataId}">
            <a href="#">
                <div class="checkbox-icon"></div><div class="checkbox-label">${name}</div>
            </a>
        </div>`;

        this._target.append(html);
        this._checkboxSelector = $("#" + this._id);

        if (this._checked) {
			this._checkboxSelector.addClass("checked");
        }

        if (this._parentCheckbox) {
			this._checkboxSelector.attr("data-parent-checkbox", this._parentCheckbox);
        }

        this.addListeners(this._id);
    };

    /**
     * It returns true if chceckbox is checked
     * @returns {*|jQuery}
     */
    isChecked() {
        return $("#" + this._id).hasClass('checked');
    };

    /**
     * It returns checkbox row element
     * @returns {*|jQuery}
     */
    getCheckbox() {
        return $("#" + this._id);
    };

    /**
     * Add listener to checkbox row and remove the old one
     * @param id {string} ID of the checkbox
     */
    addListeners(id) {
        let self = this;
        let selector = $("#" + this._containerId);
        selector.off('click.' + id);
        selector.on('click.' + id, '#' + id, function (e) {
            if (!self.specialKeyPressed(e)) {
                $('#' + id).toggleClass('checked');
            }
        });
    };
}

export default Checkbox;
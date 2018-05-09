
import S from 'string';
import _ from 'underscore';

import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';
import NotFoundError from '../../../../error/NotFoundError';
import View from '../../../View';

import './SelectBox.css';

let polyglot = window.polyglot;

/**
 * This class represents the row with the select box
 * @param options {Object}
 * @param options.id {string} ID of the select box
 * @param options.name {string} Select box label
 * @param options.target {Object} JQuery selector representing the target element where should be the select box rendered
 * @param options.data {Array} Select options
 * @constructor
 */
let $ = window.$;
class SelectBox extends View {
    constructor(options) {
        super(options);

        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SelectBox", "constructor", "missingSelectBoxId"));
        }
        if (!options.name) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SelectBox", "constructor", "missingSelectBoxName"));
        }
        if (!options.target) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SelectBox", "constructor", "missingTarget"));
        }
        if (options.target.length === 0) {
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "SelectBox", "constructor", "missingHTMLElement"));
        }

        this._id = options.id;
        this._name = options.name;
        this._target = options.target;
        this._data = _.sortBy(options.data, function (val) {
            return val;
        });

        this.build();
    };

    /**
     * Build the checkbox row and add a listener to it
     */
    build = function () {

        let html = S(`
        <div class="floater-row select-menu-box">
            <label for="{{id}}" class="select-menu-caption">{{name}}</label>
            <select class="selectmenu" title="{{name}}" name="{{id}}" id="{{id}}"></select>
        </div>
        `).template({
            id: this._id,
            name: this._name
        }).toString();

        this._target.append(html);
        let content = this.getSelectOptions();
        $('#' + this._id).append(content).selectmenu();
    };

    /**
     * Return options for select menu. If there is more than one option, add All option.
     * @returns {string} String representing HTML code
     */
    getSelectOptions = function () {
        let content = "";
        if (this._data.length > 1) {
            content += '<option value="" class="selectbox-all-options">' + polyglot.t("allOptions") + '</option>';
        }
        this._data.forEach(function (item) {
            if (item) {
                content += '<option value="' + item + '">' + item + '</option>';
            }
        });

        return content;
    };

    /**
     * It returns the name of currently selected
     * @returns {string} selected value
     */
    getValue = function () {
        return $('#' + this._id).selectmenu().val();
    };
}

export default SelectBox;
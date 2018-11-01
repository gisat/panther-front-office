
import S from 'string';
import _ from 'underscore';

import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';
import NotFoundError from '../../../../error/NotFoundError';
import View from '../../../View';

import './MultiSelectBox.css';

/**
 * This class represents the row with the multi select box
 * @param options {Object}
 * @param options.id {string} ID of the select box
 * @param options.name {string} Select box label
 * @param options.target {Object} JQuery selector representing the target element where should be the select box rendered
 * @param options.data {Array} Select options
 * @param options.selectedValues {Array} Selected options
 * @constructor
 */
let $ = window.$;
class MultiSelectBox extends View {
    constructor(options) {
        super(options);

        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MultiSelectBox", "constructor", "missingSelectBoxId"));
        }
        if (!options.name) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MultiSelectBox", "constructor", "missingSelectBoxName"));
        }
        if (!options.target) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MultiSelectBox", "constructor", "missingTarget"));
        }
        if (options.target.length === 0) {
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "MultiSelectBox", "constructor", "missingHTMLElement"));
        }

        this._id = options.id;
        this._name = options.name;
        this._target = options.target;
        this._data = _.sortBy(options.data, function (val) {
            return val;
        });
        this._selectedValues = options.selectedValues;

        this.build();
    };

    /**
     * Build the checkbox row and add a listener to it
     */
    build() {

        let html = S(`
        <div class="floater-row select-menu-box">
            <label for="{{id}}" class="select-menu-caption">{{name}}</label>
            <div class="multiselect-menu" title="{{name}}" id="{{id}}"></div>
        </div>
        `).template({
            id: this._id,
            name: this._name
        }).toString();

        this._target.append(html);
        let content = this.getOptions();

        $('#' + this._id).append(content).find("input").checkboxradio({
            icon: false
        });
    };

    /**
     * Return options for multiselect
     * @returns {string} String representing HTML code
     */
    getOptions() {
        let content = "";
        let self = this;

		if (this._data.length > 1) {
		    content += '<div class="multiselect-all-container">';
			content += self.addOption(self._id + '-option-select-all', "multiselect-select-all", "Select all");
			content += self.addOption(self._id + '-option-clear-all', "multiselect-clear-all", "Clear all");
			content += "</div>";
			this.addSelectAllListener();
			this.addClearAllListener();
		}

        // options
        this._data.forEach(function (item, index) {
            let id = self._id + '-option-' + index;
            if (item) {
                content += self.addOption(id, "multiselect-option", item);
            }
        });

        return content;
    };

    addSelectAllListener() {
        let self = this;
        $("#" + this._id).off("click.multiselect-all").on("click.multiselect-all", "#" + this._id + '-option-select-all', function () {
            $("#" + self._id + " > .label-multiselect-option").each(function () {
                let option = $(this);
                if (!option.hasClass("ui-state-active")) {
                    option.addClass("ui-state-active").addClass("ui-checkboxradio-checked");
                }
                let inputId = option.attr("for");
                $("#" + inputId).prop("checked", true);
            });
        });
    };

    addClearAllListener() {
        let self = this;
        $("#" + this._id).off("click.multiselect-clear").on("click.multiselect-clear", "#" + this._id + '-option-clear-all', function () {
            $("#" + self._id + " > .label-multiselect-option").each(function () {
                let option = $(this);
                if (option.hasClass("ui-state-active")) {
                    option.removeClass("ui-state-active").removeClass("ui-checkboxradio-checked");
                }
                let inputId = option.attr("for");
                $("#" + inputId).prop("checked", false);
            });
        });
    };

    /**
     * Add option button
     * @param id {string} id of the button
     * @param klass {string} class of the button
     * @param content {string} content
     * @returns {string}
     */
    addOption(id, klass, content) {
        let selected = false;
        if (this._selectedValues && this._selectedValues.length){
            selected = !!_.find(this._selectedValues, (value) => {return value === content});
        }

        return S(`
        <label class="label-{{class}}" for="{{id}}">{{item}}</label>
        <input class="{{class}}" type="checkbox" name="{{id}}" id="{{id}}" ${selected ? 'checked' : null}>
        `).template({
            id: id,
            item: content,
            class: klass
        }).toString();
    };
}

export default MultiSelectBox;

import S from 'string';
import _ from 'underscore';

import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import './BaseSelect.css';

let polyglot = window.polyglot;

/**
 * Base class for Select2 selects, which contains common methods
 * @constructor
 * @param options {Object}
 * @param options.id {string} id of the select
 * @param options.containerSelector {Object} JQuery selector of container, where will be the select rendered
 * @param options.options {Array} list of options
 * @param [options.title] {string} Optional parameter.
 * @param [options.selectedOptions] {Array} ids of an options selected by default
 * @param [options.disabledOptions] {Array} ids of an options selected by default
 * @param [options.sorting] {Object} Optional parameter.
 * @param [options.classes] {string} Optional parameter.
 */
let $ = window.$;
class BaseSelect {
    constructor(options) {
        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "BaseSelect", "constructor", "missingId"));
        }
        if (!options.containerSelector) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "BaseSelect", "constructor", "missingTarget"));
        }
        if (!options.options) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "BaseSelect", "constructor", "missingOptions"));
        }

        this._id = options.id;
        this._containerSelector = options.containerSelector;
        this._options = options.options;
        this._disabledOptions = options.disabledOptions;
        this._selectedOptions = options.selectedOptions;
        this._title = options.title || polyglot.t("select");
        this._sorting = options.sorting;
        this._classes = options.classes;
    };

    /**
     * Render the select element
     * @param content {string} html template
     */
    renderElement(content) {
        if (this._selectSelector) {
            this._selectSelector.remove();
        }
        let classes = "";
        if (this._classes) {
            classes = " " + this._classes;
        }

        let html = S(content).template({
            id: this._id,
            title: this._title,
            classes: classes
        }).toString();
        this._containerSelector.append(html);
        this._selectSelector = $("#" + this._id);
    }

    /**
     * It prepares data for select2 usage
     * @returns {Object}
     */
    prepareData() {
        let preparedOptions = this.prepareOptions(this._options);
        return this.sortOptions(preparedOptions);
    }

    /**
     * Prepare options for select2 usage
     * @param options {Array} List of options
     * @returns {Array} Customiyed options
     */
    prepareOptions(options) {
        let self = this;
        let preparedOptions = [];
        options.forEach(function (option) {
            let optionAsObject = self.makeObjectFromOption(option);

            let selected = _.find(self._selectedOptions, function (option) {
                return option === optionAsObject["id"];
            });
            if (selected > 0) {
                optionAsObject["selected"] = true;
            }

            let disabled = _.find(self._disabledOptions, function (option) {
                return option === optionAsObject["id"];
            });
            if (disabled > 0) {
                optionAsObject["disabled"] = true;
            }

            preparedOptions.push(optionAsObject);
        });
        return preparedOptions;
    }

    /**
     * Make an object from option
     * @param option {Object|string|number}
     * @returns {Object} customized option
     */
    makeObjectFromOption(option) {
        let id = "";
        let text = "";

        if (typeof option === "number" || typeof option === "string") {
            id = option; //todo formalize
            text = option;
        } else {
            id = option.id;
            text = option.id;
            if (option.name) {
                text = option.name;
            }
        }

        return {
            "id": id,
            "text": text
        };

    }

    /**
     * Return options sorted by text in ascending order
     * @param options {Array}
     * @returns {Array} sorted options
     */
    sortOptions(options) {
        // todo sort by type, sorting order
        return _.sortBy(options, function (o) {
            return o["text"];
        })
    }

    /**
     * Get selected items
     * @returns {Array} List of selected objects
     */
    getSelected() {
        return this._selectSelector.select2('data');
    }
}

export default BaseSelect;
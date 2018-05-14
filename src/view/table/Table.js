
import _ from 'underscore';

import ArgumentError from '../../error/ArgumentError';
import NotFoundError from '../../error/NotFoundError';
import Logger from '../../util/Logger';

import './Table.css';

/**
 * Basic class for table
 * @param options {Object}
 * @param options.elementId {Object}
 * @param options.targetId {Object}
 * @param options.class {string} optional table class
 * @constructor
 */
let $ = window.$;
class Table {
    constructor(options) {
        if (!options.elementId) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Table", "constructor", "missingElementId"));
        }
        if (!options.targetId) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Table", "constructor", "missingTargetElementId"));
        }

        this._tableId = options.elementId;
        this._target = $("#" + options.targetId);
        if (this._target.length === 0) {
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "Table", "constructor", "missingHTMLElement"));
        }

        this._class = 'new-table';
        if (options.class) {
            this._class += ' ' + options.class;
        }

        this.build();
    };

    /**
     * Build table
     */
    build() {
        this._target.append("<table class='" + this._class + "' id='" + this._tableId + "'></table>");
        this._table = $("#" + this._tableId);
    };

    /**
     * Clear table content
     */
    clear() {
        this._table.html("");
        this._header = false;
    };

    /**
     * Returns table JQuery object
     * @returns {jQuery}
     */
    getTable() {
        return this._table;
    };

    /**
     * Append content to table
     * TODO handle if data is array
     * @param data {Object|Array}
     */
    appendContent(data) {
        let content = '';
        if (_.isObject(data) && !_.isArray(data)) {
            content = this.renderContentFromObjectData(data)
        }
        this._table.addClass("key-value-table").append(content);
    };

    /**
     * Render table content from object. Each property is a separate row, where key is the first column. If value is object, the row is higlighted and it's properties are rendered as next rows.
     * @param data {Object}
     */
    renderContentFromObjectData(data) {
        let content = "";
        let self = this;
        if (data && !_.isEmpty(data)) {
            for (let key in data) {
                let value = data[key];
                if (typeof value === 'object') {
                    content += self.renderRow([key], true, 2);
                    content += self.renderContentFromObjectData(value);
                } else {
                    content += self.renderRow([key, value], false, null);
                }
            }
        }
        return content;
    };

    /**
     * Render table row
     * @param columns {Array} List of columns
     * @param highlihted {boolean} true, if columns are 'th' type
     * @param colspan {number} number of joined columns
     * @returns {string} HTML of row
     */
    renderRow(columns, highlihted, colspan) {
        let content = '<tr>';
        let self = this;

        columns.forEach(function (column) {
            if (highlihted) {
                content += self.renderHighlightedColumn(column, colspan);
            } else {
                content += self.renderColumn(column);
            }
        });
        return content += '</tr>';
    };

    /**
     * Render table column
     * @param value {string|number|array}
     * @returns {string} HTML of column
     */
    renderColumn(value) {
        if (_.isArray(value)) {
            value = value.join(",");
        }
        return '<td>' + value + '</td>'
    };

    /**
     * Render highlighted table column
     * @param value {string|number|array}
     * @param colspan {number} number of joined columns
     * @returns {string} HTML of column
     */
    renderHighlightedColumn(value, colspan) {
        let cspan = "";
        if (_.isArray(value)) {
            value = value.join(",");
        }
        if (colspan) {
            cspan = 'colspan="' + colspan + '"';
        }
        return '<th ' + cspan + '>' + value + '</th>'
    };
}

export default Table;
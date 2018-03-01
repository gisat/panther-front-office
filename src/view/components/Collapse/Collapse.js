
import S from 'string';

import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import './Collapse.css'

/**
 * Colapsible panel with title and content
 * @param options {Object}
 * @param options.title {String} Title of the collapse
 * @param [options.content] {String} Optional. HTML content that could be collapsed
 * @param options.containerSelector {Object} JQuery selector of target element
 * @param [options.customClasses] {string} optional classes
 * @param [options.open] {boolean} false for collapsed content
 * @constructor
 */
let $ = window.$;
class Collapse {
    constructor(options) {
        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Collapse", "constructor", "missingId"));
        }
        if (!options.title) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Collapse", "constructor", "missingName"));
        }
        if (!options.containerSelector) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Collapse", "constructor", "missingTarget"));
        }

        this._id = options.id;
        this._title = options.title;
        this._content = options.content;
        this._containerSelector = options.containerSelector;
        this._classes = options.customClasses;
        this._open = options.open;

        this.render();
        this.addHeaderOnClickListener();
    };

    /**
     * Render collapse
     */
    render() {
        let content = "";
        let classes = "";
        if (this._open) {
            classes += " open";
        }
        if (this._classes) {
            classes += " " + this._classes;
        }
        if (this._content) {
            content = this._content;
        }

        let html = S('<div class="component-collapse {{classes}}" id="{{id}}">\n' +
            '\t<div class="component-collapse-header">\n' +
            '\t\t<div class="component-collapse-title">{{title}}</div>\n' +
            '\t\t<div class="component-collapse-arrow"></div>\n' +
            '\t</div>\n' +
            '\t<div class="component-collapse-body" id="{{id}}-body">\n' +
            '\t\t{{content}}\n' +
            '\t</div>\n' +
            '</div>').template({
            id: this._id,
            title: this._title,
            content: content,
            classes: classes
        }).toString();
        this._containerSelector.append(html);

        this._collapseSelector = $("#" + this._id);
        this._headerSelector = this._collapseSelector.find(".component-collapse-header");
        this._bodySelector = this._collapseSelector.find(".component-collapse-body");

        if (this._open) {
            this._bodySelector.show();
        } else {
            this._bodySelector.hide();
        }
    };

    /**
     * Add listener to collapse header
     */
    addHeaderOnClickListener() {
        this._headerSelector.off("click.collapse").on("click.collapse", function () {
            let collapse = $(this).parents(".component-collapse");
            let body = $(this).siblings(".component-collapse-body");
            if (collapse.hasClass("open")) {
                collapse.removeClass("open");
                body.slideUp(200);
            } else {
                collapse.addClass("open");
                body.slideDown(200);
            }
        });
    };

    /**
     * Retrun body JQuery selector
     * @returns {Object}
     */
    getBodySelector() {
        return this._bodySelector;
    };
}

export default Collapse;
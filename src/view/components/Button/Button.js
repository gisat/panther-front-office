
import S from 'string';

import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import './Button.css'

let polyglot = window.polyglot;

/**
 * Base class for button creating
 * @constructor
 * @param options {Object}
 * @param options.id {string} id of the button
 * @param options.containerSelector {Object} JQuery selector of container, where will be the select rendered
 * @param options.text {string} Text for button
 * @param options.onClick {function}
 * @param [options.classes] {string} Optional parameter. Additional classes.
 * @param [options.icon] {Object} Optional parameter. Data about icon.
 * @param [options.title] {string} Optional parameter.
 * @param [options.textCentered] {boolean} Optional parameter.
 * @param [options.textSmall] {boolean} Optional parameter.
 */
let $ = window.$;
class Button {
    constructor(options) {
        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Button", "constructor", "missingId"));
        }
        if (!options.text) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Button", "constructor", "missingText"));
        }
        if (!options.containerSelector) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Button", "constructor", "missingTarget"));
        }

        this._id = options.id;
        this._text = options.text;
        this._containerSelector = options.containerSelector;
        this._classes = options.classes;
        this.onClick = options.onClick;

        this._icon = options.icon;
        this._title = options.title || polyglot.t("select");
        this._textCentered = options.textCentered;
        this._textSmall = options.textSmall;

        this.render();
        this.addOnClickListener();
    };

    /**
     * Render button
     */
    render() {
        if (this._buttonSelector) {
            this._buttonSelector.remove();
        }

        let classes = this.getClasses();
        let icon = this.renderIcon();
        let html = S('<button id="{{id}}" class="component-button {{classes}}" title="{{title}}">{{icon}}<span>{{text}}</span></button>').template({
            id: this._id,
            icon: icon,
            title: this._title,
            text: this._text,
            classes: classes
        }).toString();
        this._containerSelector.append(html);
        this._buttonSelector = $("#" + this._id);
    };

    /**
     * Get classes based on button's configuration
     * @returns {string} html classes
     */
    getClasses() {
        let classes = "";
        if (this._classes) {
            classes += " " + this._classes;
        }
        if (this._textCentered) {
            classes += " text-centered"
        }
        if (this._textSmall) {
            classes += " text-small"
        }
        if (this._icon) {
            classes += " has-icon"
        }
        return classes;
    };

    /**
     * Render icon according to type
     * @returns {string} Icon HTML
     */
    renderIcon() {
        let icon = '';
        if (this._icon) {
            if (this._icon.type === 'fa') {
                icon = '<i class="fa fa-' + this._icon.class + '"></i>'
            }
        }
        return icon;
    };

    addOnClickListener() {
        this._buttonSelector.on("click", this.onClick.bind(this));
    };

}

export default Button;
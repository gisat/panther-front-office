
import S from 'string';

import './ToggleIcon.css';

/**
 * Build toggle Icon
 * @param options {Object}
 * @param options.id {string} id of icon
 * @param options.target {Object} JQuery selector of target element
 * @param [options.isSmall] {boolean} Optional parameter. True if toggle should be small
 * @constructor
 */
let $ = window.$;
class ToggleIcon {
    constructor(options) {
        this._target = options.target;
        this._id = options.id;
        this._isSmall = options.isSmall;
        this.build();
    };

    /**
     * Build icon
     */
    build() {
        let extraClasses = "";

        if (this._isSmall) {
            extraClasses += "toggle-icon-small"
        }

        let content = S(`
        <div class="toggle-icon {{classes}}" id="{{id}}"></div>
        `).template({
            id: this._id,
            classes: extraClasses
        }).toString();
        this._target.append(content);
        this._icon = $("#" + this._id);
    };

    /**
     * Switch toggle to active state
     */
    activate() {
        this._icon.addClass("active");
    };

    /**
     * Switch toggle to inactive state
     */
    deactivate() {
        this._icon.removeClass("active");
    };
}

export default ToggleIcon;
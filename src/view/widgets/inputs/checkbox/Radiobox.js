
import S from 'string';

import Checkbox from './Checkbox';

import './Radiobox.css';

/**
 * This class represents the row with the radiobox
 * @constructor
 */
let $ = window.$;
class Radiobox extends Checkbox {

    /**
     * Build the radio row and add a listener to it
     */
    build() {

        let html = S(`
        <div class="floater-row radiobox-row {{class}}" id="{{id}}" data-id="{{dataId}}">
            <a href="#">
                <div class="radiobox-icon"></div><div class="radiobox-label">{{name}}</div>
            </a>
        </div>
        `).template({
            id: this._id,
            class: this._class,
            dataId: this._dataId,
            name: this._name
        }).toString();

        this._target.append(html);

        if (this._checked) {
            $("#" + this._id).addClass("checked");
        }
        this.addListeners(this._id);
    };

    /**
     * It returns radiobox row element
     * @returns {*|jQuery}
     */
    getRadiobox() {
        return $("#" + this._id);
    };

    /**
     * Add listener to radiobox row and remove the old one
     * @param id {string} ID of the checkbox
     */
    addListeners(id) {
        let self = this;
        let selector = $("#" + this._containerId);
        selector.off('click.' + id);
        selector.on('click.' + id, '#' + id, function (e) {
            if (!self.specialKeyPressed(e)) {
                self._target.find(".radiobox-row").removeClass('checked');
                $('#' + id).addClass('checked');
            }
        })
    };
}

export default Radiobox;
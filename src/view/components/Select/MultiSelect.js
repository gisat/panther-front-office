
import 'select2';

import BaseSelect from './BaseSelect';

import './MultiSelect.css';

/**
 * Class for creating of multi options html select element using Select2 library
 * @constructor
 * @param options.onChange {function}
 * @param [options.hidePillbox] {boolean} Optional parameter. If true, show only an arrow.
 */
let $ = window.$;
class MultiSelect extends BaseSelect {
    constructor(options) {
        super(options);

        this.onChange = options.onChange;
        this._hidePillbox = options.hidePillbox;

        this.render();
        this.addListeners();
    };

    /**
     * Render select
     */
    render() {
        let self = this;
        this.renderElement(`<select title="{{title}}" id="{{id}}" class="select-multiple {{classes}}"></select>`);

        let containerClass = "select-multi-container";
        if (this._hidePillbox) {
            containerClass += " onlyArrow";
        }
        if (this._classes) {
            containerClass += " " + this._classes;
        }

        $(document).ready(function () {
            self._selectSelector.select2({
                data: self.prepareData(),
                containerCssClass: containerClass,
                dropdownCssClass: "select-multi-dropdown",
                multiple: "multiple"
            });
        });
    };

    /**
     * Get all options
     * @returns {Array} List of all items
     */
    getAllOptions() {
        let selectedItems = [];
        this._selectSelector.find("option").each(function (item) {
            if (this.value) {
                selectedItems.push(this.value);
            }
        });
        return selectedItems;
    };

    /**
     * Get all selected options' values
     * @returns {Array}
     */
    getSelectedOptions() {
        return this._selectSelector.select2("val");
    };

    /**
     * Add listeners to events
     */
    addListeners() {
        this._selectSelector.on("change", this.onChange.bind(this));
    };

}

export default MultiSelect;
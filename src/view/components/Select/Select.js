
import 'select2';

import BaseSelect from './BaseSelect';
import './Select.css';

/**
 * Class for creating of basic html select element using Select2 library
 * @constructor
 * @params options.onChange {function}
 * @params options.placeholder {string}
 */
let $ = window.$;
class Select extends BaseSelect {
    constructor(options) {
        super(arguments);
        this.onChange = options.onChange;

        this._placeholder = options.placeholder;

        this.render();
        this.addListeners();
    };

    /**
     * Render select
     */
    render() {
        let self = this;
        this.renderElement(`<select title="{{title}}" id="{{id}}" class="select-simple {{classes}}"></select>`);

        $(document).ready(function () {
            self._selectSelector.select2(self.prepareSelectSettings());
        });
    };

    /**
     * Prepare settings for select
     * @returns {Object} select settings
     */
    prepareSelectSettings() {
        let containerClass = "select-basic-container";
        if (this._classes) {
            containerClass += " " + this._classes;
        }

        let settings = {
            data: this.prepareData(),
            containerCssClass: containerClass
        };

        if (this._placeholder) {
            $("#" + this._id).append('<option></option>');
            settings.placeholder = this._placeholder;
        }

        return settings;
    };

    /**
     * Add listeners to events
     */
    addListeners() {
        this._selectSelector.on("change", this.onChange.bind(this));
    };
}

export default Select;
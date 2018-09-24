

import Settings from '../../settings/Settings';
import _ from 'lodash';

let polyglot = window.polyglot;
let Select = window.Select;

/**
 * It builds the settings window for Evaluation Widget and control all operations in it
 * @augments Settings
 * @constructor
 */
let $ = window.$;
class EvaluationWidgetSettings extends Settings {
    /**
     * Rebuild settings with current list of attributes
     * @param attributes {Array}
     */
    rebuild(attributes) {
        this._attributes = attributes;
        this._adjustedAttributes = this.adjustAttributes(this._attributes);

        this._categories = {};

        this.addCategories();
        this.addCheckboxChangeListener();
        this.addMultiCheckListener();
        this.addMultioptionsChangeListener();
        this.reviewCheckboxesState();
    };

    adjustAttributes(attributes) {
		let actualSelectionColour = Select.actualColor;
		let storedFilters = this._stateStore.getAttributeFiltersForColor(actualSelectionColour);
		let adjustedAttributes = [];

        if ((actualSelectionColour !== this._lastSelectionColour) && storedFilters){
            adjustedAttributes = attributes.map((originalAttribute) => {
                let storedAttribute = _.find(storedFilters, (filter) => {
                   return filter.attribute === originalAttribute.about.attribute && filter.attributeSet === originalAttribute.about.attributeSet
                });
                if (storedAttribute){
                    let adjustedAttribute = {
						about: originalAttribute.about,
						values: originalAttribute.values,
                        distribution: originalAttribute.distribution,
                        active: true
					};
                    if (storedAttribute.attributeType === 'numeric'){
						adjustedAttribute.intervals = storedAttribute.intervals;
                    } else if (storedAttribute.attributeType === 'text') {
                        adjustedAttribute.multioptions = !!storedAttribute.multioptions;
						adjustedAttribute.selectedValues = storedAttribute.values && storedAttribute.values.length && storedAttribute.values[0].length !== 0 ? storedAttribute.values : null;
                    }
                    return adjustedAttribute;
                } else {
                    return {...originalAttribute, active: false};
                }
            });
        }
        this._lastSelectionColour = actualSelectionColour;
        return adjustedAttributes.length ? adjustedAttributes : attributes;
    }

    /**
     * Add the categories for filtering
     */
    addCategories() {
        this._settingsBody = $('#' + this._id + ' .tool-window-body');
        this._settingsBody.html("");
        this.addCheckbox(this._id + "-all-attributes", polyglot.t("allAttributes"), "all-attributes-row", "", true, "");
        let asName = "";
        let asId = "";
        let asDataId = null;
        let self = this;
        this._adjustedAttributes.forEach(function (attribute) {
            if (attribute.about.attributeSet !== asDataId) {
                asName = attribute.about.attributeSetName;
                asDataId = attribute.about.attributeSet;
                asId = self._id + "-as-" + asDataId;
                self.addCheckbox(asId, asName, "attribute-set-row", "as-" + asDataId, true, self._id + "-all-attributes");
            }
            let type = attribute.about.attributeType;
            let name = attribute.about.attributeName;
            let name4Settings = name;
            let attrDataId = attribute.about.attribute;
            let input = "";
            let active = attribute.hasOwnProperty("active") ? attribute.active : JSON.parse(attribute.about.active);

            if (type === "boolean") {
                input = "checkbox";
                name4Settings = name4Settings + " <i>" + polyglot.t("yesNo") + "</i>";
            }
            else if (type === "numeric") {
                input = "slider";
                name4Settings = name4Settings + " <i>" + polyglot.t("range") + "</i> ";
            }
            else if (type === "text") {
                input = "select";
                name4Settings = name4Settings + " <i>" + polyglot.t("categoryBounded") + "</i>" +
                    "<div class='multioptions'>" +
                    "<span>" + polyglot.t("multiOptions") + "</span>" +
                    "<label class='switch'>" +
                    "<input type='checkbox' class='multioptions-input' " + (attribute.multioptions ? 'checked' : null) + ">" +
                    "<div class='slider-toggle'></div>" +
                    "</label>" +
                    "</div>";
            }

            let asAttrDataID = "as-" + asDataId + "-attr-" + attrDataId;
            self.addCheckbox(self._id + '-' + asAttrDataID, name4Settings, "attribute-row", asAttrDataID, active, asId);
            self._categories[asAttrDataID] = {
                attrData: attribute,
                name: name,
                input: input,
                active: active,
                multioptions: !!attribute.multioptions
            };

            if (type === 'numeric'){
				self._categories[asAttrDataID].intervals = attribute.intervals ? attribute.intervals : null;
            } else if (type === 'text'){
                self._categories[asAttrDataID].selectedValues = attribute.selectedValues ? attribute.selectedValues : null;
            }
        });
    };

    /**
     * It returns selected categories (filters)
     * @returns {Object}
     */
    getCategories() {
        return this._categories;
    };

    /**
     * Add listener on multioptions change
     */
    addMultioptionsChangeListener() {
        $('#' + this._id).find(".multioptions-input").off("click.changeMultioptions")
            .on("click.changeMultioptions", this.rebuildAttributesState.bind(this));
    };

    /**
     * Rebuild info about current state of attribute, if it's active or not.
     */
    rebuildAttributesState() {
        let self = this;
        setTimeout(function () {
            let attributeRows = $('#' + self._id + ' .attribute-row');
            attributeRows.each(function () {
                let checked = $(this).hasClass("checked");
                let id = $(this).attr('data-id');
                let multiToggle = $(this).find(".multioptions .switch > input:checked");
                let multioptions = false;

                // multioptons active?
                if (multiToggle.length) {
                    multioptions = true;
                }

                // set state of attribute
                self._categories[id].active = checked;
                self._categories[id].multioptions = multioptions;
                self._categories[id].attrData.about.active = checked;
            });
            self.reviewCheckboxesState();
        }, 50);
    };
}

export default EvaluationWidgetSettings;
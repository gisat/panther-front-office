

import Settings from '../../settings/Settings';

/**
 * It builds the settings window for Feature Info tool
 * @augments Settings
 * @constructor
 */
let $ = window.$;
class FeatureInfoSettings extends Settings {
    /**
     * Rebuild settings with current list of attributes
     * @param attributes {Array}
     */
    rebuild(attributes) {
        this._originalAttributes = attributes;
        this._attributesForSettings = [];

        this.rebuildBody();
        this.addCheckboxChangeListener();
        this.addMultiCheckListener();
        this.prepareSelectedAttributes();
    };

    /**
     * Rebuild body with a list of all attributes
     */
    rebuildBody() {
        this._settingsBody = $('#' + this._id + ' .tool-window-body');
        this._settingsBody.html("");

        // add checkbox for all atributes
        this.addCheckbox(this._id + "-all-attributes", "All attributes", "all-attributes-row", "", true, "");
        let asName = "";
        let asId = "";
        let asDataId = null;
        let atLeastOneSelected = false;
        let self = this;
        this._originalAttributes.forEach(function (attribute) {
            if (attribute.attributeSet !== asDataId) {
                asName = attribute.attributeSetName;
                asDataId = attribute.attributeSet;
                asId = self._id + "-as-" + asDataId;

                // add checkbox for whole attribute set
                self.addCheckbox(asId, asName, "attribute-set-row", "as-" + asDataId, true, self._id + "-all-attributes");
            }
            let name = attribute.attributeName;
            let attrDataId = attribute.attribute;
            let active = attribute.active;
            let asAttrDataID = "as-" + asDataId + "-attr-" + attrDataId;

            // add checkbox for attribute
            self.addCheckbox(self._id + '-' + asAttrDataID, name, "attribute-row", asAttrDataID, active, asId);

            self._attributesForSettings[asAttrDataID] = {
                data: attribute,
                active: active
            };

            if (active) {
                atLeastOneSelected = true;
            }
        });

        // TODO when none of attributes is active (why?) select them all
        if (!atLeastOneSelected) {
            let attributeRows = $('#' + this._id + ' .attribute-row');
            attributeRows.each(function () {
                $(this).addClass("checked");
            });
        }
    };

    /**
     * Rebuild info about current state of attribute, if it's active or not.
     */
    rebuildAttributesState() {
        let self = this;
        setTimeout(self.prepareSelectedAttributes.bind(self), 50);
    };

    /**
     * Prepare list of selected attributes
     */
    prepareSelectedAttributes() {
        this._selectedAttributes = [];
        let self = this;
        let attributeRows = $('#' + this._id + ' .attribute-row');
        attributeRows.each(function () {
            let checked = $(this).hasClass("checked");
            let id = $(this).attr('data-id');

            // set state of attribute
            self._attributesForSettings[id].active = checked;
            self._attributesForSettings[id].data.active = checked;

            if (checked) {
                self._selectedAttributes.push(self._attributesForSettings[id].data);
            }
        });
        this.reviewCheckboxesState();
    };

    /**
     * Returns attributes to display
     * @returns {Array}
     */
    getSelectedAttributes() {
        return this._selectedAttributes;
    };
}

export default FeatureInfoSettings;
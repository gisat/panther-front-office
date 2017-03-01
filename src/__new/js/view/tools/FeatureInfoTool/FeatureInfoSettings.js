define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../widgets/inputs/checkbox/Checkbox',
	'../../../util/Logger',

	'../../settings/Settings',

	'jquery'
], function (ArgumentError,
			 NotFoundError,
			 Checkbox,
			 Logger,

			 Settings,

			 $) {

	/**
	 * It builds the settings window for Feature Info tool
	 * @augments Settings
	 * @constructor
	 */
	var FeatureInfoSettings = function(options){
		Settings.apply(this, arguments);
	};

	FeatureInfoSettings.prototype = Object.create(Settings.prototype);

	/**
	 * Rebuild settings with current list of attributes
	 * @param attributes {Array}
	 */
	FeatureInfoSettings.prototype.rebuild = function(attributes){
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
	FeatureInfoSettings.prototype.rebuildBody = function(){
		this._settingsBody = $('#' + this._id + ' .tool-window-body');
		this._settingsBody.html("");

		// add checkbox for all atributes
		this.addCheckbox(this._id + "-all-attributes", "All attributes", "all-attributes-row", "", true, "");
		var asName = "";
		var asId = "";
		var asDataId = null;
		var self = this;
		this._originalAttributes.forEach(function(attribute){
			if (attribute.attributeSet != asDataId){
				asName = attribute.attributeSetName;
				asDataId = attribute.attributeSet;
				asId = self._id + "-as-" + asDataId;

				// add checkbox for whole attribute set
				self.addCheckbox(asId, asName, "attribute-set-row", "as-" + asDataId, true, self._id + "-all-attributes");
			}
			var name = attribute.attributeName;
			var attrDataId = attribute.attribute;
			var active = attribute.active;

			var asAttrDataID = "as-" + asDataId + "-attr-" + attrDataId;

			// add checkbox for attribute
			self.addCheckbox(self._id + '-' + asAttrDataID, name, "attribute-row", asAttrDataID, active, asId);

			self._attributesForSettings[asAttrDataID] = {
				data: attribute,
				active: active
			};
		});
	};

	/**
	 * Rebuild info about current state of attribute, if it's active or not.
	 */
	FeatureInfoSettings.prototype.rebuildAttributesState = function(){
		var self = this;
		setTimeout(self.prepareSelectedAttributes.bind(self),50);
	};

	/**
	 * Prepare list of selected attributes
	 */
	FeatureInfoSettings.prototype.prepareSelectedAttributes = function(){
		this._selectedAttributes = [];
		var self = this;
		var attributeRows = $('#' + this._id + ' .attribute-row');
		attributeRows.each(function(){
			var checked = $(this).hasClass("checked");
			var id = $(this).attr('data-id');

			// set state of attribute
			self._attributesForSettings[id].active = checked;
			self._attributesForSettings[id].data.active = checked;

			if (checked){
				self._selectedAttributes.push(self._attributesForSettings[id].data);
			}
		});

		// TODO sometimes, there is none active attribute, then add all available attributes
		if (this._selectedAttributes.length == 0){
			this._selectedAttributes = this._originalAttributes;
			$('#' + this._id + '-all-attributes').trigger("click");
		}
		this.reviewCheckboxesState();
	};

	/**
	 * Returns attributes to display
	 * @returns {Array}
	 */
	FeatureInfoSettings.prototype.getSelectedAttributes = function(){
		return this._selectedAttributes;
	};

	return FeatureInfoSettings;
});
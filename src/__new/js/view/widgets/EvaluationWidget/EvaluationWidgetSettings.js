define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../inputs/checkbox/Checkbox',
	'../../../util/Logger',

	'../../settings/Settings',

	'jquery',
	'string'

], function (ArgumentError,
			 NotFoundError,
			 Checkbox,
			 Logger,

			 Settings,

			 $,
			 S) {

	/**
	 * It builds the settings window for Evaluation Widget and control all operations in it
	 * @augments Settings
	 * @constructor
	 */
	var EvaluationWidgetSettings = function(options){
		Settings.apply(this, arguments);
	};

	EvaluationWidgetSettings.prototype = Object.create(Settings.prototype);

	EvaluationWidgetSettings.prototype.build = function(){
		this._categories = {};
		this.addCategories();
		this.addMultioptionsChangeListener();
	};

	/**
	 * Add the categories for filtering
	 */
	EvaluationWidgetSettings.prototype.addCategories = function(){
		this._settingsBody = $('#' + this._id + ' .tool-window-body');
		this._settingsBody.html("");
		this.addCheckbox("settings-all-attributes", "All attributes", "all-attributes-row", "", true);
		var asName = "";
		var asDataId = null;
		var self = this;
		this._attributes.forEach(function(attribute){
			if (attribute.about.attributeSet != asDataId){
				asName = attribute.about.attributeSetName;
				asDataId = attribute.about.attributeSet;
				self.addCheckbox("settings-as-" + asDataId, asName, "attribute-set-row", "as-" + asDataId, true);
			}
			var type = attribute.about.attributeType;
			var name = attribute.about.attributeName;
			var name4Settings = name;
			var attrDataId = attribute.about.attribute;
			var input = "";
			var active = JSON.parse(attribute.about.active);

			if (type == "boolean"){
				input = "checkbox";
				name4Settings = name4Settings + " <i>(Yes/No)</i>";
			}
			else if (type == "numeric") {
				input = "slider";
				name4Settings = name4Settings + " <i>(Range)</i> ";
			}
			else if (type == "text") {
				input = "select";
				name4Settings = name4Settings + " <i>(Category)</i>" +
					"<div class='multioptions'>" +
					"<span>Multioptions:</span>" +
					"<label class='switch'>" +
					"<input type='checkbox' class='multioptions-input'>" +
					"<div class='slider-toggle'></div>" +
					"</label>" +
					"</div>";
			}

			var asAttrDataID = "as-" + asDataId + "-attr-" + attrDataId;
			self.addCheckbox('settings-' + asAttrDataID, name4Settings, "attribute-row", asAttrDataID, active);
			self._categories[asAttrDataID] = {
				attrData: attribute,
				name: name,
				input: input,
				active: active,
				multioptions: false
			};
		});
	};

	/**
	 * It returns selected categories (filters)
	 * @returns {Object}
	 */
	EvaluationWidgetSettings.prototype.getCategories = function(){
		return this._categories;
	};

	/**
	 * Add listener on multioptions change
	 */
	EvaluationWidgetSettings.prototype.addMultioptionsChangeListener = function(){
		$('#' + this._id).find(".multioptions-input").off("click.changeMultioptions")
			.on("click.changeMultioptions", this.rebuildAttributesState.bind(this));
	};

	/**
	 * Rebuild info about current state of attribute, if it's active or not.
	 * Handle state of atribute sets checkboxes and All attributes checkbox.
	 */
	EvaluationWidgetSettings.prototype.rebuildAttributesState = function(){
		var self = this;
		var allAttributesCheckbox = $('#settings-all-attributes');
		var checkedAttributes = 0;
		var allAttributes = 0;
		setTimeout(function(){
			var attributeRows = $('#' + self._id + ' .attribute-row');
			attributeRows.each(function(){
				var checked = $(this).hasClass("checked");
				var id = $(this).attr('data-id');
				var multiToggle = $(this).find(".multioptions .switch > input:checked");
				var multioptions = false;

				// if checked, increment counter
				if (checked){
					checkedAttributes++;
				}

				// multioptons active?
				if (multiToggle.length){
					multioptions = true;
				}

				// set state of attribute
				self._categories[id].active = checked;
				self._categories[id].multioptions = multioptions;
				self._categories[id].attrData.about.active = checked;

				allAttributes++;
			});

			// review the state of all attributes checkbox and confirm button
			var confirmButton = $('#' + self._id + ' .settings-confirm');
			if (checkedAttributes > 0){
				confirmButton.attr("disabled", false);
				if (checkedAttributes == allAttributes){
					if (!allAttributesCheckbox.hasClass("checked")){
						allAttributesCheckbox.addClass("checked");
					}
				}
			} else {
				confirmButton.attr("disabled", true);
				if (allAttributesCheckbox.hasClass("checked")){
					allAttributesCheckbox.removeClass("checked");
				}
			}
		},100);
	};

	return EvaluationWidgetSettings;
});
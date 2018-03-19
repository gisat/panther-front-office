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

	/**
	 * Rebuild settings with current list of attributes
	 * @param attributes {Array}
	 */
	EvaluationWidgetSettings.prototype.rebuild = function(attributes){
		this._attributes = attributes;
		this._categories = {};

		this.addCategories();
		this.addCheckboxChangeListener();
		this.addMultiCheckListener();
		this.addMultioptionsChangeListener();
		this.reviewCheckboxesState();
	};

	/**
	 * Add the categories for filtering
	 */
	EvaluationWidgetSettings.prototype.addCategories = function(){
		this._settingsBody = $('#' + this._id + ' .tool-window-body');
		this._settingsBody.html("");
		this.addCheckbox(this._id + "-all-attributes", polyglot.t("allAttributes"), "all-attributes-row", "", true, "");
		var asName = "";
		var asId = "";
		var asDataId = null;
		var self = this;
		this._attributes.forEach(function(attribute){
			if (attribute.about.attributeSet != asDataId){
				asName = attribute.about.attributeSetName;
				asDataId = attribute.about.attributeSet;
				asId = self._id + "-as-" + asDataId;
				self.addCheckbox(asId, asName, "attribute-set-row", "as-" + asDataId, true, self._id + "-all-attributes");
			}
			var type = attribute.about.attributeType;
			var name = attribute.about.attributeName;
			var name4Settings = name;
			var attrDataId = attribute.about.attribute;
			var input = "";
			var active = JSON.parse(attribute.about.active);

			if (type == "boolean"){
				input = "checkbox";
				name4Settings = name4Settings + " <i>"+polyglot.t("yesNo")+"</i>";
			}
			else if (type == "numeric") {
				input = "slider";
				name4Settings = name4Settings + " <i>"+polyglot.t("range")+"</i> ";
			}
			else if (type == "text") {
				input = "select";
				name4Settings = name4Settings + " <i>"+polyglot.t("categoryBounded")+"</i>" +
					"<div class='multioptions'>" +
					"<span>"+polyglot.t("multiOptions")+"</span>" +
					"<label class='switch'>" +
					"<input type='checkbox' class='multioptions-input'>" +
					"<div class='slider-toggle'></div>" +
					"</label>" +
					"</div>";
			}

			var asAttrDataID = "as-" + asDataId + "-attr-" + attrDataId;
			self.addCheckbox(self._id + '-' + asAttrDataID, name4Settings, "attribute-row", asAttrDataID, active, asId);
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
	 */
	EvaluationWidgetSettings.prototype.rebuildAttributesState = function(){
		var self = this;
		setTimeout(function(){
			var attributeRows = $('#' + self._id + ' .attribute-row');
			attributeRows.each(function(){
				var checked = $(this).hasClass("checked");
				var id = $(this).attr('data-id');
				var multiToggle = $(this).find(".multioptions .switch > input:checked");
				var multioptions = false;

				// multioptons active?
				if (multiToggle.length){
					multioptions = true;
				}

				// set state of attribute
				self._categories[id].active = checked;
				self._categories[id].multioptions = multioptions;
				self._categories[id].attrData.about.active = checked;
			});
			self.reviewCheckboxesState();
		},50);
	};

	return EvaluationWidgetSettings;
});
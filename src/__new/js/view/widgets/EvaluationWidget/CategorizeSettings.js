define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../settings/Settings',

	'jquery',
	'string'

], function (ArgumentError,
			 NotFoundError,
			 Logger,

			 Settings,

			 $,
			 S) {

	/**
	 * @augments Settings
	 * @constructor
	 */
	var CategorizeSettings = function(options){
		Settings.apply(this, arguments);

		this._settingsSelector = $('#' + this._id);
		this._settingsBodySelector = this._settingsSelector.find(".tool-window-body");
		this._headerSelector = this._settingsSelector.find(".tool-window-header");
		this._confirmButtonSelector = this._settingsSelector.find(".settings-confirm");

		this.renameLabels();
		this.buildBody();

		this.clearAll();
	};

	CategorizeSettings.prototype = Object.create(Settings.prototype);

	CategorizeSettings.prototype.buildBody = function(){
		this._settingsBodySelector.append(
			'<div class="categorize-body">' +
			'</div>' +
			'<div class="categorize-footer">' +
				'<div id="add-category-set">Add category set' +
				'</div>' +
			'</div>'
		);

		this._addCategorySetSelector = $("#add-category-set");
		this._categorizeBodySelector = this._settingsBodySelector.find('.categorize-body');

		this.addCategorySetListener();
		this.deleteCategorySetListener();
		this.deleteCategoryListener();
	};

	CategorizeSettings.prototype.renameLabels = function(){
		this._headerSelector.find("span").html("Categorize");
		this._confirmButtonSelector.html("Show in chart")
	};

	/**
	 * Clear whole categorization
	 */
	CategorizeSettings.prototype.clearAll = function(){
		this._categorizeBodySelector.html("");
		this._categoryCounter = 0;
		this._categorySetCounter = 0;

		this._categoriesSets = {};
		this.addCategorySet();
	};

	CategorizeSettings.prototype.addCategorySet = function(){
		var categorySetRecord = this.createCategorySetRecord();
		this._categoriesSets[this._currentCategorySetId] = categorySetRecord;

		var categorySetElement = this.createCategorySetElement(categorySetRecord);
		this._categorizeBodySelector.append(categorySetElement);
	};

	/**
	 * Delete category set from view and list
	 * @param id {string} id of the category set
	 */
	CategorizeSettings.prototype.deleteCategorySet = function(id){
		$("#" + id).remove();
		delete this._categoriesSets[id];
	};

	/**
	 * Delete category from list and view
	 * @param setId {string} Id of the category set
	 * @param categoryId {string} Id of the category
	 */
	CategorizeSettings.prototype.deleteCategory = function(setId, categoryId){
		$("#" + categoryId).remove();
		delete this._categoriesSets[setId].categories[categoryId];
	};

	/**
	 * Add category to list
	 * @param currentETstate {Object} current state of Evaluation Tool
	 */
	CategorizeSettings.prototype.addCategory = function(currentETstate){
		this._currentETstate = currentETstate;

		var categoryRecord = this.createCategoryRecord();
		this._categoriesSets[this._currentCategorySetId].categories[this._currentCategoryId] = categoryRecord;

		var categoryElement = this.createCategoryElement(categoryRecord);
		this._categorizeBodySelector.find("div[data-id=" + this._currentCategorySetId + "]").append(categoryElement);
	};

	/**
	 * Create category record
	 * @returns {{id: string, name: string, data: *, color: string}}
	 */
	CategorizeSettings.prototype.createCategoryRecord = function(){
		this._categoryCounter++;
		this._currentCategoryId = "category_" + this._categoryCounter;

		return {
			id: this._currentCategoryId,
			name: "Category " + this._categoryCounter,
			data: this._currentETstate,
			color: '#000000'
		};
	};

	/**
	 * Create category set record
	 * @returns {{id: string, name: string, categories: {}}}
	 */
	CategorizeSettings.prototype.createCategorySetRecord = function(){
		this._categorySetCounter++;
		this._currentCategorySetId = "set_" + this._categorySetCounter;

		return {
			id: this._currentCategorySetId,
			name: "Set " + this._categorySetCounter,
			categories: {}
		};
	};

	CategorizeSettings.prototype.createCategoryElement = function(category){
		return (
			'<div class="category-box" id="' + category.id + '" data-id="' + category.id + '">' +
				'<div>' + category.name + '</div>' +
				'<div class="delete-category"> Delete category</div>' +
			'</div>'
		);
	};

	CategorizeSettings.prototype.createCategorySetElement = function(categorySet){
		return (
			'<div class="category-set-box" id="' + categorySet.id + '" data-id="' + categorySet.id + '">' +
				'<div>' + categorySet.name + '</div>' +
				'<div class="delete-category-set"> Delete cat set </div>' +
			'</div>'
		);
	};

	CategorizeSettings.prototype.addCategorySetListener = function(){
		var self = this;
		this._addCategorySetSelector.on("click", function(){
			self.addCategorySet();
		});
	};

	CategorizeSettings.prototype.deleteCategorySetListener = function(){
		var self = this;
		this._categorizeBodySelector.on("click", ".delete-category-set", function(){
			var setId = $(this).parents(".category-set-box").attr("data-id");
			self.deleteCategorySet(setId);
		});
	};

	CategorizeSettings.prototype.deleteCategoryListener = function(){
		var self = this;
		this._categorizeBodySelector.on("click", ".delete-category", function(){
			var setId = $(this).parents(".category-set-box").attr("data-id");
			var categoryId = $(this).parents(".category-box").attr("data-id");
			self.deleteCategory(setId, categoryId);
		});
	};

	return CategorizeSettings;
});
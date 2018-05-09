import _ from 'underscore';


import Settings from '../../settings/Settings';

import './CategorizeSettings.css';

let polyglot = window.polyglot;

/**
 * @augments Settings
 * @constructor
 */
let $ = window.$;
class CategorizeSettings extends Settings {
    constructor(options) {
        super(options);

        this._settingsSelector = $('#' + this._id);
        this._settingsBodySelector = this._settingsSelector.find(".tool-window-body");
        this._headerSelector = this._settingsSelector.find(".tool-window-header");
        this._confirmButtonSelector = this._settingsSelector.find(".settings-confirm");

        this._aggregatedChart = options.aggregatedChart;

        this.renameLabels();
        this.buildBody();

        this.clearAll();
    };

    buildBody() {
        this._settingsBodySelector.append(
            '<div class="categorize-body">' +
            '</div>' +
            '<div class="categorize-footer">' +
            '<div class="widget-button w10" id="add-category-set">' + polyglot.t("addCategorySet") +
            '</div>' +
            '</div>'
        );

        this._addCategorySetSelector = $("#add-category-set");
        this._categorizeBodySelector = this._settingsBodySelector.find('.categorize-body');

        this.addCategorySetListener();

        this.deleteCategorySetListener();
        this.saveCategorySetListener();
        this.changeCategorySetNameListener();


        this.deleteCategoryListener();
        this.saveCategoryListener();
        this.changeCategoryListener();

        this.showChartListener();
    };

    renameLabels() {
        this._headerSelector.find("span").html(polyglot.t("categorize"));
        this._confirmButtonSelector.html(polyglot.t("showInChart"))
    };

    /**
     * Clear whole categorization
     */
    clearAll() {
        this._categorizeBodySelector.html("");
        this._categoryCounter = 0;
        this._categorySetCounter = 0;

        this._categoriesSets = {};
        this.addCategorySet();
    };

    /**
     * Add category set to the list
     */
    addCategorySet() {
        let categorySetRecord = this.createCategorySetRecord();
        this._categoriesSets[this._currentCategorySetId] = categorySetRecord;

        let categorySetElement = this.createCategorySetElement(categorySetRecord);
        this._categorizeBodySelector.append(categorySetElement);
    };

    /**
     * Delete category set from view and list
     * @param id {string} id of the category set
     */
    deleteCategorySet(id) {
        $("#" + id).remove();
        delete this._categoriesSets[id];

        if (this._currentCategorySetId === id) {
            let keys = Object.keys(this._categoriesSets);
            this._currentCategorySetId = keys[keys.length - 1];
        }

    };

    /**
     * It saves name of category set
     * @param id {string} id of the category set
     * @param name {string}
     */
    saveCategorySet(id, name) {
        this._categoriesSets[id].name = name;
    };

    /**
     * Delete category from list and view
     * @param setId {string} Id of the category set
     * @param categoryId {string} Id of the category
     */
    deleteCategory(setId, categoryId) {
        $("#" + categoryId).remove();
        delete this._categoriesSets[setId].categories[categoryId];
    };

    /**
     * It saves name of category
     * @param setId {string} Id of the category set
     * @param categoryId {string} Id of the category
     * @param categoryName {string}
     * @param categoryColor {string} HEX code
     */
    saveCategory(setId, categoryId, categoryName, categoryColor) {
        this._categoriesSets[setId].categories[categoryId].name = categoryName;
        this._categoriesSets[setId].categories[categoryId].color = categoryColor;
    };


    /**
     * Add category to list
     * @param currentETstate {Object} current state of Evaluation Tool
     */
    addCategory(currentETstate) {
        if (_.isEmpty(this._categoriesSets)) {
            this.addCategorySet();
        }

        this._currentETstate = currentETstate;

        let categoryRecord = this.createCategoryRecord();
        this._categoriesSets[this._currentCategorySetId].categories[this._currentCategoryId] = categoryRecord;

        let categoryElement = this.createCategoryElement(categoryRecord);

        this._categorizeBodySelector.find("div[data-id=" + this._currentCategorySetId + "]").append(categoryElement);
    };

    /**
     * Create category record
     * @returns {{id: string, name: string, data: Object, color: string}}
     */
    createCategoryRecord() {
        this._categoryCounter++;
        this._currentCategoryId = "category_" + this._categoryCounter;

        return {
            id: this._currentCategoryId,
            name: polyglot.t("category") + " " + this._categoryCounter,
            data: this._currentETstate,
            color: '#000000'
        };
    };

    /**
     * Create category set record
     * @returns {{id: string, name: string, categories: {}}}
     */
    createCategorySetRecord() {
        this._categorySetCounter++;
        this._currentCategorySetId = "set_" + this._categorySetCounter;

        return {
            id: this._currentCategorySetId,
            name: polyglot.t("set") + " " + this._categorySetCounter,
            categories: {}
        };
    };

    /**
     * Create element for category
     * @param category {Object}
     * @returns {string} HTML
     */
    createCategoryElement(category) {
        return (
            '<div class="category-box" id="' + category.id + '" data-id="' + category.id + '">' +
            '<div class="category-name"><input type="text" value="' + category.name + '"></div>' +
            '<div class="category-color"><input type="color" value="#000000"></div>' +
            '<div class="save-category"><i class="fa fa-floppy-o" aria-hidden="true"></i></div>' +
            '<div class="delete-category"><i class="fa fa-trash-o" aria-hidden="true"></i></div>' +
            '</div>'
        );
    };

    /**
     * Create element for category set
     * @param categorySet {Object} basic data about category set
     * @returns {string} HTML
     */
    createCategorySetElement(categorySet) {
        return (
            '<div class="category-set-box" id="' + categorySet.id + '" data-id="' + categorySet.id + '">' +
            '<div class="category-set-box-header">' +
            '<div class="category-set-name"><input type="text" value="' + categorySet.name + '"></div>' +
            '<div class="save-category-set widget-button button-save-record">' + polyglot.t("saveSetName") + '</div>' +
            '<div class="delete-category-set widget-button button-delete-record">' + polyglot.t("deleteWholeSet") + '</div>' +
            '</div>' +
            '</div>'
        );
    };

    /**
     * Add on click listener to Add category set button
     */
    addCategorySetListener() {
        let self = this;
        this._addCategorySetSelector.off("click.addcategoryset").on("click.addcategoryset", function () {
            self.addCategorySet();
        });
    };

    /**
     * Add delete category set on click listener
     */
    deleteCategorySetListener() {
        let self = this;
        this._categorizeBodySelector.off("click.deletecategoryset").on("click.deletecategoryset", ".delete-category-set", function () {
            let setId = $(this).parents(".category-set-box").attr("data-id");
            self.deleteCategorySet(setId);
        });
    };

    /**
     * Add save category set on click listener
     */
    saveCategorySetListener() {
        let self = this;
        this._categorizeBodySelector.off("click.savecategoryset").on("click.savecategoryset", ".save-category-set", function () {
            let setId = $(this).parents(".category-set-box").attr("data-id");
            let setName = $(this).parents(".category-set-box").find(".category-set-name input").val();
            self.saveCategorySet(setId, setName);
            $(this).attr("disabled", true);
        });
    };

    changeCategorySetNameListener() {
        this._categorizeBodySelector.off("input.setname").on("input.setname", ".category-set-name input", function () {
            $(this).parents(".category-set-box").find(".save-category-set").attr("disabled", false);
        });
    };

    /**
     * Add delete category button on click listener
     */
    deleteCategoryListener() {
        let self = this;
        this._categorizeBodySelector.off("click.deletecategory").on("click.deletecategory", ".delete-category", function () {
            let setId = $(this).parents(".category-set-box").attr("data-id");
            let categoryId = $(this).parents(".category-box").attr("data-id");
            self.deleteCategory(setId, categoryId);
        });
    };

    /**
     * Add save category button on click listener.
     */
    saveCategoryListener() {
        let self = this;
        this._categorizeBodySelector.off("click.savecategory").on("click.savecategory", ".save-category", function () {
            let setId = $(this).parents(".category-set-box").attr("data-id");
            let categoryId = $(this).parents(".category-box").attr("data-id");
            let categoryName = $(this).parents(".category-box").find(".category-name input").val();
            let categoryColor = $(this).parents(".category-box").find(".category-color input").val();
            self.saveCategory(setId, categoryId, categoryName, categoryColor);
            $(this).attr("disabled", true);
        });
    };

    changeCategoryListener() {
        this._categorizeBodySelector.off("input.categoryname").on("input.categoryname", ".category-name input", function () {
            $(this).parents(".category-box").find(".save-category").attr("disabled", false);
        });

        this._categorizeBodySelector.off("input.categorycolor").on("input.categorycolor", ".category-color input", function () {
            $(this).parents(".category-box").find(".save-category").attr("disabled", false);
        });
    };

    /**
     * Add confirm button on click listener
     */
    showChartListener() {
        let self = this;
        this._confirmButtonSelector.off("click.confirm").on("click.confirm", function () {
            self._aggregatedChart.build(self._categoriesSets);
        });
    };

    /**
     * Close the settings window
     */
    addCloseListener() {
        let self = this;
        $('#' + this._id + ' .window-close').off("click").on("click", self.close.bind(self));
    };
}

export default CategorizeSettings;
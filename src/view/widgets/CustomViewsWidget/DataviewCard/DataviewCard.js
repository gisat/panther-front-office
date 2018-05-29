
import S from 'string';

import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';
import Remote from '../../../../util/RemoteJQ';

import './DataviewCard.css';

let polyglot = window.polyglot;

/**
 * @param options {Object}
 * @param options.target {Object} JQuery selector of parent element
 * @param options.id {number} id of the dataview
 * @param options.name {string} name of dataview
 * @param options.description {string} desription of dataview
 * @param options.dispatcher {Object} Object for handling events in the application.
 * @param options.preview {Object} data for preview
 * @param options.url {string} dataview original URL
 * @param options.hasTools {boolean} if true, tools will be displayed
 * @constructor
 */
let $ = window.$;
class DataviewCard {
    constructor(options) {
        if (!options.target) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DataviewCard", "constructor", "missingTarget"));
        }
        this._target = options.target;
        this._id = options.id;
        this._name = options.name;
        this._description = options.description;
        this._dispatcher = options.dispatcher;
        this._preview = options.preview;
        this._url = options.url;
        this._hasTools = options.hasTools;

        this.build();
    };

    build() {
        let html = S(`
        <div id="dataview-card-{{id}}" class="dataview-card" data-for="{{id}}">
            <div class="dataview-card-preview"></div>
            <div class="dataview-card-text">
                <h3>{{name}}</h3>
                <p class="dataview-card-description">{{description}}</p>
            </div>
            <div class="dataview-card-tools">
                <div class="dataview-card-icons">
                    <i title={{urlTitle}} class="fa fa-link" aria-hidden="true"></i>
                    <i class="fa fa-pencil-square-o disabled" aria-hidden="true"></i>
                    <i title={{deleteTitle}} class="fa fa-trash-o" aria-hidden="true"></i>
                </div>
            </div>
        </div>
        `).template({
            id: this._id,
            name: this._name,
            description: this._description,
            deleteTitle: polyglot.t("delete"),
            urlTitle: polyglot.t("URL")
        }).toString();
        this._target.append(html);
        this._cardSelector = $("#dataview-card-" + this._id);

        this._cardPreviewSelector = this._cardSelector.find(".dataview-card-preview");
        this._cardPreviewSelector.css("background-image", this._preview.background);
        this._cardToolsSelector = this._cardSelector.find(".dataview-card-tools");

        if (!this._hasTools) {
            this._cardToolsSelector.css("display", "none");
        }

        this.addOnCardClickListener();
        this.addOnShowUrlClickListener();
        this.addDeleteOnClickListener();
    };

    /**
     * Remove Dataview Card from DOM
     */
    removeCard() {
        this._cardSelector.remove();
    };

    addOnCardClickListener() {
        this._cardSelector.off("click.card").on("click.card", this.onShowButtonClick.bind(this));
        this._cardToolsSelector.click(function (e) {
            e.stopPropagation();
        });
    };

    /**
     * Show dataview on click
     */
    onShowButtonClick() {
        // TODO upgrade this provisional solution
        window.location = this._url;
    };

    addOnShowUrlClickListener() {
        let self = this;
        this._cardSelector.find(".fa-link").off("click.customViewLink").on("click.customViewLink", function () {
            // todo better popup window
            window.alert(self._url);
        });
    };

    /**
     * Delete dataview on delete icon click
     */
    addDeleteOnClickListener() {
        let self = this;
        this._cardSelector.find(".fa-trash-o").off("click.deleteDataview").on("click.deleteDataview", function () {
            let id = $(this).parents(".dataview-card").attr("data-for");
            if (window.confirm(polyglot.t("dataviewDeleteConfirmText"))) {
                new Remote({
                    url: "rest/customview/delete",
                    params: {
                        id: Number(id)
                    }
                }).get().then(function (result) {
                    if (result.status === "Ok") {
                        self.removeCard();
                    }
                }).catch(function (err) {
                    console.error(err);
                });
            }
        });
    };
}

export default DataviewCard;
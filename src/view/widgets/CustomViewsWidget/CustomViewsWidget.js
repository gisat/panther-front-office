
import _ from 'underscore';

import Actions from '../../../actions/Actions';
import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';
import viewUtils from '../../../util/viewUtils';

import AboutWindow from './AboutWindow/AboutWindow';
import DataviewCard from './DataviewCard/DataviewCard';
import Widget from '../Widget';

import './CustomViewsWidget.css';

let Config = window.Config;
let polyglot = window.polyglot;

/**
 *
 * @param options {Object}
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @param options.store.dataviews {Dataviews}
 * @param options.store.scopes {Scopes}
 * @constructor
 * @augments Widget
 */
let $ = window.$;
class CustomViewsWidget extends Widget {
    constructor(options) {
        super(options);

        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'CustomViewsWidget', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'CustomViewsWidget', 'constructor', 'Store state must be provided'));
        }
        if (!options.store.dataviews) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'CustomViewsWidget', 'constructor', 'Store dataviews must be provided'));
        }
        if (!options.store.scopes) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'CustomViewsWidget', 'constructor', 'Store scopes must be provided'));
        }

        this._store = options.store;
        this._stateStore = options.store.state;

        this._dispatcher = options.dispatcher;
        this._dispatcher.addListener(this.onEvent.bind(this));
        this.build();
    };

    build() {
        let bodySelector = $('body');
        let isIntro = bodySelector.hasClass('intro');
        if (Config.toggles.showDataviewsOverlay) {
            this._widgetSelector.addClass("open expanded active");
            if (isIntro) {
                this._widgetSelector.addClass("intro-overlay");
                bodySelector.addClass("intro-overlay");
            }
            // this.rebuild();
        }
    };

    /**
     * Get dataviews and redraw widget
     */
    rebuild() {
        this.handleLoading("show");
        let self = this;
        let changed = this._store.state.current().changes;

        if (changed.dataview && Config.toggles.showDataviewsOverlay) {
            this._widgetSelector.removeClass("open expanded active");
            $('#top-toolbar-saved-views').removeClass("open");
            setTimeout(function () {
                self._widgetSelector.draggable("enable");
            }, 500);
        }

        this._store.dataviews.load()
            .then(this.redraw.bind(this))
            .catch(function (err) {
                throw new Error(err);
            });
    };

    /**
     * Redraw widget with dataviews
     * @param data {Array}
     */
    redraw(data) {
        let bodySelector = $('body');
        let isIntro = bodySelector.hasClass('intro');
        this._widgetBodySelector.html('<div class="custom-views-content"></div>');
        this._contentSelector = this._widgetBodySelector.find(".custom-views-content");

        let user = this._stateStore.current().user;
        let isDromasAdmin = false;
        user.groups.forEach(group => {
            if(group.name === 'Aktualizace LPIS admin') {
                isDromasAdmin = true;
            }
        });
        let isAdmin = user.isAdmin;

        if (data.length === 0){
            this._widgetSelector.find(".widget-minimise").trigger("click");
            $("#top-toolbar-saved-views").addClass("hidden");
        } else {
            if (isIntro && Config.toggles.showDataviewsOverlay){
                this.renderAsOverlay(data, isAdmin, isDromasAdmin);

            } else {
                let scope = this._store.state.current().scope;
                this.renderAsWidget(data, scope, isAdmin, isDromasAdmin);
                this._widgetSelector.removeClass("intro-overlay");
                bodySelector.removeClass("intro-overlay");
            }
        }
    };

    /**
     * Add content grouped to one category per scope
     * @param data {Array} data for dataviews card
     * @param isAdmin {boolean} true, if logged user is admin
     */
    renderAsOverlay(data, isAdmin, isDromasAdmin) {
        this._widgetSelector.addClass("open expanded active");

        this.toggleOverlaySwitch(isAdmin);

        let groupedData = this.groupDataByScope(data);
        let scopeNamesPromises = [];
        for (let ds in groupedData) {
            scopeNamesPromises.push(this._store.scopes.byId(Number(ds)));
        }

        let self = this;
        Promise.all(scopeNamesPromises).then(function (results) {
            let scopes = _.flatten(results);
            self.renderAsOverlayContent(scopes, groupedData, isAdmin, isDromasAdmin);
            self.handleLoading("hide");
        }).catch(function (err) {
            throw new Error(err);
        });
    };

    /**
     * Render content of widget in overlay mode
     * @param scopes {Array} Collestion of scopes
     * @param data {Object} Data about dataviews grouped by scope
     * @param isAdmin {boolean} true, if logged user is admin
     */
    renderAsOverlayContent(scopes, data, isAdmin, isDromasAdmin) {
        this._contentSelector.html('<div class="custom-views-categories"></div>' +
            '<div class="custom-views-dataviews">' +
            '<div class="custom-views-dataviews-container"></div>' +
            '</div>');
        this._categoriesContainerSelector = this._contentSelector.find('.custom-views-categories');
        this._dataviewsContainerSelector = this._contentSelector.find('.custom-views-dataviews-container');

        if (Config.toggles.dataviewsOverlayHasIntro) {
            this.renderContentItem("intro", polyglot.t('aboutPlatform'));
            new AboutWindow({
                target: $("#about-window-wrapper"),
                onShowMapsClick: this.onShowMapsClick.bind(this)
            });
        }

        for (let dataset in data) {
            let scope = _.find(scopes, function (scope) {
                return Number(scope.id) === Number(dataset);
            });

            // Filter the scope
            let validUrl = true;
            if(!isAdmin && scope && scope.urls){
                validUrl = scope.urls.indexOf(window.location.origin) !== -1;
            }

            if (scope && scope.name) {
                let name = scope.name;
                this.renderContentItem(dataset, name);

                let window = $('#custom-views-dataviews-' + dataset + ' .custom-views-window-content');
                if (scope.description) {
                    window.append('<div>' + scope.description + '</div>');
                }
                let sortedData = this.sortDataByTime(data[dataset]);
                let self = this;
                sortedData.forEach(function (dataview) {
                    let data = self.prepareDataForCard(dataview);
                    self.addDataviewCard(data, window, isAdmin || isDromasAdmin);
                });
            }
        }

        $(".custom-views-category:first-child").addClass("active");
        this._activeWindow = $(".custom-views-window:first-child");
        this._secondWindow = $(".custom-views-window:nth-child(2)");
        this._thirdWindow = $(".custom-views-window:nth-child(3)");

        this._activeWindow.addClass("active");
        this._secondWindow.addClass("second");
        this._thirdWindow.addClass("third");

        this.addCategoryListener();
    };

    /**
     * Append Item in categories menu and connected window in content
     * @param id {string|number} id of the window
     * @param name {string} name of the category
     */
    renderContentItem(id, name) {
        this._categoriesContainerSelector.append('<div class="custom-views-category" data-for="custom-views-dataviews-' + id + '">' + name + '</div>');
        if (id === "intro") {
            this._dataviewsContainerSelector.append('<div class="custom-views-window" id="custom-views-dataviews-' + id + '">' +
                '<div class="custom-views-window-wrapper" id="about-window-wrapper">' +
                '</div>' +
                '</div>');
        } else {
            this._dataviewsContainerSelector.append('<div class="custom-views-window" id="custom-views-dataviews-' + id + '">' +
                '<div class="custom-views-window-wrapper">' +
                '<div class="custom-views-window-header">' +
                '<h1 class="custom-views-window-header-title"><i>' + polyglot.t("scope") + ":</i>" + name + '</h1>' +
                '</div>' +
                '<div class="custom-views-window-content">' +
                '</div>' +
                '</div>' +
                '</div>');
        }
    };

    /**
     * Show/hide overlay switch
     * @param isAdmin {boolean} true, if logged user is admin
     */
    toggleOverlaySwitch(isAdmin) {
        if (this._overlaySwitchSelector) {
            if (isAdmin) {
                this._overlaySwitchSelector.css("display", "inline-block");
            } else {
                this._overlaySwitchSelector.css("display", "none");
            }
        } else if (isAdmin) {
            this.renderOverlaySwitch(isAdmin);
        }
    };

    /**
     * Add switch to the header toolbar, which allows to admin switch off/on the overlay
     */
    renderOverlaySwitch(isAdmin) {
        if (!this._overlaySwitchSelector){
            $("#header .menu").append("<li id='overlay-switch'><a href='#'>" + polyglot.t("dataviewOverlaySwitchToOld") + "</a></li>");
            this._overlaySwitchSelector = $("#overlay-switch");

            if (isAdmin){
                this._overlaySwitchSelector.addClass("open");
            }

            let self = this;
            this._overlaySwitchSelector.on("click",function(){
                let switcherLink = $(this).find("a");
                let bodySelector = $('body');
                let overlayActive = self._widgetSelector.hasClass("open");
                if (overlayActive){
                    self._widgetSelector.removeClass("open");
                    bodySelector.removeClass("intro-overlay");
                    switcherLink.text(polyglot.t("dataviewOverlaySwitchToNew"));
                } else {
                    self._widgetSelector.addClass("open");
                    bodySelector.addClass("intro-overlay");
                    switcherLink.text(polyglot.t("dataviewOverlaySwitchToOld"));
                }
            });
        }
    };

    /**
     * Add content for selected scope
     * @param data {Array} data for dataviews card
     * @param scope {string|number} current scope
     * @param isAdmin {boolean} true, if logged user is admin
     */
    renderAsWidget(data, scope, isAdmin, isDromasAdmin) {

        //filter dataviews for this scope only
        // TODO move fiter to backend
        let filteredData = this.filterDataByScope(data, scope);
        let sortedData = this.sortDataByTime(filteredData);

        if (sortedData.length === 0) {
            $("#top-toolbar-saved-views").addClass("hidden");
        } else {
            $("#top-toolbar-saved-views").removeClass("hidden");
        }

        let self = this;
        sortedData.forEach(function (dataview) {
            let data = self.prepareDataForCard(dataview);
            self.addDataviewCard(data, self._contentSelector, isAdmin || isDromasAdmin);
        });
        if (Config.dataviewId){
            this._widgetSelector.find(".widget-minimise").trigger("click");
        }
        this.handleLoading("hide");
    };

    /**
     * Add on click listener to category menu item
     */
    addCategoryListener() {

        let self = this;
        $(".custom-views-category").off("click.category").on("click.category", function () {
            let category = $(this);
            let categories = $(".custom-views-category");
            let contentWindows = $(".custom-views-window");
            let selectedId = $(this).attr("data-for");
            let activeId = self._activeWindow.attr("id");
            let secondId = self._secondWindow.attr("id");
            let thirdId = self._thirdWindow.attr("id");
            let index = contentWindows.index(this);

            categories.removeClass("active");
            category.addClass("active");
            contentWindows.removeClass("active").removeClass("second").removeClass("third");

            if (selectedId === secondId) {
                self._activeWindow = $("#" + selectedId);
                self._secondWindow = $("#" + activeId);
            } else if (selectedId === thirdId || selectedId !== activeId) {
                self._activeWindow = $("#" + selectedId);
                self._secondWindow = $("#" + activeId);
                self._thirdWindow = $("#" + secondId);
            }

            self._activeWindow.addClass("active");
            self._secondWindow.addClass("second");
            self._thirdWindow.addClass("third");
        });
    };

    onShowMapsClick() {
        this._categoriesContainerSelector.find(".custom-views-category:nth-child(2)").trigger("click");
    };

    /**
     * @param type {string} type of event
     */
    onEvent(type) {
        if (type === Actions.userChanged || type === "initialLoadingFinished") {
            this.handleLoading("show");
            this._store.scopes.clear();
            this._store.dataviews.load().then(this.redraw.bind(this));
        } else if (type === Actions.dataviewShow) {
            this._widgetSelector.find(".widget-minimise").trigger("click");
        } else if (type === Actions.sharingViewShared) {
            this.rebuild();
        }
    };

    /**
     * Prepare data for dataview card
     * @param d {Object} original data about dataview
     * @return {Object} prepared data about dataview
     */
    prepareDataForCard(d) {
        let language = d.data.language || "en";

        let auth = "";
        if (Config.auth) {
            auth = "&needLogin=true";
        }
        let prepared = {
            id: d.id,
            url: window.location.origin + window.location.pathname + "?id=" + d.id + auth + "&lang=" + language
        };

        if (d.data.name && d.data.name.length > 0) {
            prepared.name = d.data.name;
        } else {
            prepared.name = "Dataview " + d.id;
        }

        if (d.data.description && d.data.description.length > 0) {
            prepared.description = d.data.description;
        } else {
            prepared.description = "Dataview " + d.id;
        }

        prepared.preview = {
            background: 'linear-gradient(135deg, ' + viewUtils.getPseudorandomColor() + ' 0%, ' + viewUtils.getPseudorandomColor() + ' 100%)'
        };

        return prepared;
    };

    /**
     * Group data for dataviews by scope
     * @param data {Array}
     * @returns {Object} data grouped by scope
     */
    groupDataByScope(data) {
        return _.groupBy(data, function (d) {
            return d.data.dataset;
        });
    };

    /**
     * Filter data for dataviews cards by scope
     * @param data {Array}
     * @param scope {string|number} id of current scope
     * @returns {Array} filtered data
     */
    filterDataByScope(data, scope) {
        return _.filter(data, function (d) {
            return d.data.dataset === Number(scope);
        });
    };

    /**
     * Sort data for daataviews by time from the newest
     * @param data {Array}
     * @returns {Array} sorted data
     */
    sortDataByTime(data) {
        return _.sortBy(data, function (d) {
            return -(new Date(d.date).getTime());
        });
    };

    /**
     * Add dataview card to target
     * @param data {Object} data for card
     * @param target {Object} JQuery selector of parent element
     * @param hasTools {boolean} if true, tools will be displayed
     * @returns {DataviewCard}
     */
    addDataviewCard(data, target, hasTools) {
        return new DataviewCard({
            id: data.id,
            url: data.url,
            name: data.name,
            description: data.description,
            dispatcher: this._dispatcher,
            preview: data.preview,
            target: target,
            hasTools: hasTools
        });
    };
}

export default CustomViewsWidget;
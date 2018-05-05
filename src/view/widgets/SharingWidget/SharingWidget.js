
import S from 'string';

import Actions from '../../../actions/Actions';
import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';
import Widget from '../Widget';
import UrbanTepPortalStore from '../../../stores/UrbanTepPortalStore';

import Button from '../../components/Button/Button';

import './SharingWidget.css';

let polyglot = window.polyglot;
let Observer = window.Observer;
let Config = window.Config;

/**
 *
 * @param options {Object}
 * @param options.dispatcher {Object}
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @param options.store.groups {Groups}
 * @param options.store.users {Users}
 * @constructor
 */
let $ = window.$;
class SharingWidget extends Widget {
    constructor(options) {
        super(options);

        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SharingWidget', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SharingWidget', 'constructor', 'Store state must be provided'));
        }
        if (!options.store.groups) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SharingWidget', 'constructor', 'Store groups must be provided'));
        }
        if (!options.store.users) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SharingWidget', 'constructor', 'Store users must be provided'));
        }

        this._store = options.store;

        this.build();

        this._url = '';
        this._dispatcher = options.dispatcher;
        this._dispatcher.addListener(this.onEvent.bind(this));
    };

    get url() {
        return this._url;
    }

    set url(url) {
        this._url = url;
    }

    rebuild() {
        this.handleLoading("show");

        $('#floater-sharing .floater-body').empty();

        let self = this;

        this._store.groups.clear();
        this._store.users.clear();

        Promise.all([
            this._store.groups.all(),
            this._store.users.all()
        ]).then(function (results) {
            let groups = results[0];
            let users = results[1];

            self.addWidgetContent(groups, users);
            self.handleLoading("hide");
        }).catch(function (error) {
            console.error(error);
            alert(polyglot.t('itWasntPossibleToLoadGroupsUsers') + error);
            self.handleLoading("hide");
        });
    };

    /**
     * Add content to widget body and footer
     * @param groups
     * @param users
     */
    addWidgetContent(groups, users) {
        let groupOptions = groups.map(function (group) {
            return '<option value="' + group.id + '">' + group.name + '</option>';
        });
        groupOptions.unshift('<option value=""></option>');
        let userOptions = users.map(function (user) {
            return '<option value="' + user.id + '">' + user.name + '</option>';
        });
        userOptions.unshift('<option value=""></option>');


        let content = S(`
        <form class="basic-form">
            <div class="widget-section">
            <h3>{{dataviewMetadataTitle}}</h3>
            <p>{{dataviewMetadataDescription}}</p>
            <div class="widget-form-row">
                <label>
                    <span>{{nameLabel}}</span>
                    <input type="text" id="sharing-name"/>
        
                </label>
            </div>
            <div class="widget-form-row">
                <label>
                    <span>{{descriptionLabel}}</span>
                    <textarea name="text" id="sharing-description" cols="30" rows="3"></textarea>
                </label>
            </div>
            <div class="widget-form-row">
                <label>
                    <span>{{langLabel}}</span>
                    <select id="sharing-lang">
                        <option value="en">EN</option>
                        <option value="cz">CZ</option>
                    </select>
                </label>
            </div>
        </div>
            <div class="widget-section">
                <h3>{{permissionsTitle}}</h3>
                <p>{{permissionsDescription}}</p>
                <div class="widget-form-row">
                    <label>
                        <span>{{userLabel}}</span>
                        <select id="sharing-user">{{userOptions}}</select>
                    </label>
                </div>
                <div class="widget-form-row">
                    <label>
                        <span>{{groupLabel}}</span>
                        <select id="sharing-group">{{groupOptions}}</select>
                    </label>
                </div>
            </div>
        </form>
        `).template({
            dataviewMetadataTitle: polyglot.t('sharingMetadataTitle'),
            dataviewMetadataDescription: polyglot.t('sharingMetadataDescription'),
            nameLabel: polyglot.t('sharingNameLabel'),
            descriptionLabel: polyglot.t('sharingDescriptionLabel'),
            langLabel: polyglot.t('sharingLangLabel'),
            permissionsTitle: polyglot.t('sharingPermissionsTitle'),
            permissionsDescription: polyglot.t('sharingPermissionsDescription'),
            userLabel: polyglot.t('sharingUserLabel'),
            userOptions: userOptions,
            groupLabel: polyglot.t('sharingGroupLabel'),
            groupOptions: groupOptions
        }).toString();

        $('#floater-sharing .floater-body').html(content);
        $('#floater-sharing .floater-footer').empty();
        this.buildSaveButton();

        // prevent action after enter is pressed while filling out the name
        $("#sharing-name").on('keydown', function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        });
    };

    /**
     * Build button for save the dataview
     * @returns {Button}
     */
    buildSaveButton() {
        return new Button({
            id: "sharing",
            containerSelector: this._widgetSelector.find(".floater-footer"),
            text: polyglot.t("share"),
            onClick: this.onShareClick.bind(this),
            textCentered: true,
            textSmall: false,
            classes: "w8"
        });
    };

    /**
     * Execute on share button click
     */
    onShareClick() {
        let name = $("#floater-sharing .floater-body #sharing-name").val();
        let description = $("#floater-sharing .floater-body #sharing-description").val();
        let language = $("#floater-sharing .floater-body #sharing-lang option:checked").val();
        let state = this._store.state.current();

        Observer.notify("PumaMain.controller.ViewMng.onShare", {
            state: state,
            name: name,
            language: language,
            description: description
        });
    };

    /**
     * Show url on share click
     * @param options {Object}
     */
    showUrl(options) {
        let selectedGroup = $( "#floater-sharing .floater-body #sharing-group option:checked" ).val();
        let selectedUser = $( "#floater-sharing .floater-body #sharing-user option:checked" ).val();
        let minimiseBtn = this._widgetSelector.find(".widget-minimise");
        let state = this._store.state.current();
        var places = state.places;
        if (state.locations){
            places = state.locations;
        }
        let self = this;
        Promise.all([
            this._store.groups.share(selectedGroup, state.scope, places, options.dataviewId),
            this._store.users.share(selectedUser, state.scope, places, options.dataviewId)
        ]).then(function(){
            let auth = "&needLogin=true";
            if (Config.auth && selectedGroup === '2'){
                auth = "";
            }
            self._url = options.url + auth +'&lang=' + $( "#floater-sharing .floater-body #sharing-lang option:checked" ).val();
            if(Config.toggles.isUrbanTep && selectedGroup) {
                if(selectedGroup !== '1' && selectedGroup !== '2' && selectedGroup !== '3') {
                    UrbanTepPortalStore.share(self._url, $("#floater-sharing .floater-body #sharing-name").val(), $("#floater-sharing .floater-body #sharing-group option:checked").text());
                }
            }
            alert(polyglot.t('theStateWasCorrectlyShared') + self._url);
            minimiseBtn.trigger("click");
            self.rebuild();
            self._dispatcher.notify("sharing#viewShared");
        }).catch(function(error){
            alert(polyglot.t('thereWasAnIssueWithSharing') + error);
        });
    };

    /**
     * Add minimise on click listener
     */
    build() {
        this.handleLoading("hide");

        let self = this;
        this._widgetSelector.find(".widget-minimise").off().on("click", function () {
            let item = $('#top-toolbar-share-view');
            if (self._widgetSelector.hasClass("open")) {
                item.removeClass("open");
                self._widgetSelector.removeClass("open");
            } else {
                item.addClass("open");
                self._widgetSelector.addClass("open");
            }
        });

        this.rebuild();
    };

    /**
     * @param type {string} type of event
     * @param options {Object|string}
     */
    onEvent(type, options) {
        if (type === Actions.sharingUrlReceived) {
            this.showUrl(options);
        } else if (type === Actions.userChanged) {
            this.rebuild();
        }
    };
}

export default SharingWidget;
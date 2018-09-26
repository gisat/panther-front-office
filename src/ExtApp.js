import Logger from './util/Logger';

let Config = window.Config;
let polyglot = window.polyglot;
let Ext;

/**
 *
 * @constructor
 */
let $ = window.$;
class ExtApp {
    constructor() {
        Ext = window.Ext;
        Ext.Loader.setConfig({
            enabled: true
            , disableCaching: false
        });

        Ext.Loader.setPath('Ext.ux', 'ux');
        Ext.Loader.setPath('Gisatlib', 'gisatlib');
        Ext.Loader.setPath('Ext', 'extjs-4.1.3/src');
        Ext.Loader.setPath('Puma.patch', 'patch');
        Ext.Loader.setPath('Puma', '_common');
        Ext.Loader.setPath('Puma', '_common');
    }

    setUp() {
        let self = this;
        return new Promise(function (resolve, reject) {
            Ext.application({
                name: 'PumaMain',
                appFolder: '_main',
                controllers: [
                    'DomManipulation', 'Render', 'Store', 'LocationTheme', 'Area', 'Layers',
                    'AttributeConfig', 'ViewMng', 'Login', 'Select', 'Chart'
                ],
                enableQuickTips: true,
                requires: [
                    'Puma.patch.Main', // JJJ zakomentovat při buildu, odkomentovat při sencha create jsb a pak ho z .jsb3 vymazat

                    'Ext.data.reader.Json', 'Ext.util.Point', 'Ext.Layer', 'Ext.window.Window', 'Ext.data.ArrayStore', 'Ext.data.proxy.Memory',
                    'Ext.data.reader.Array', 'Ext.util.Grouper', 'Ext.PluginManager', 'Ext.ComponentLoader', 'Ext.layout.Context', 'Ext.resizer.Resizer',
                    'Ext.panel.Tool', 'Ext.util.CSS', 'Ext.layout.component.Body', 'Ext.Img', 'Ext.menu.Menu', 'Ext.data.Batch', 'Ext.selection.RowModel',
                    'Ext.selection.CellModel', 'Ext.selection.CheckboxModel', 'Ext.grid.PagingScroller', 'Ext.grid.header.Container', 'Ext.grid.column.Column',
                    'Ext.grid.Lockable', 'Ext.view.TableLayout', 'Ext.view.TableChunker', 'Ext.data.Request', 'Ext.grid.column.Number', 'Ext.layout.container.Accordion',
                    'Ext.picker.Color', 'Ext.tree.Panel', 'Ext.grid.column.Action', 'Ext.grid.plugin.DragDrop', 'Ext.layout.container.Table',
                    'Ext.form.field.Checkbox', 'Ext.ux.grid.FiltersFeature', 'PumaMain.view.Chart', 'PumaMain.view.VisualizationForm', 'Puma.view.CommonForm',
                    'Puma.view.CommonGrid', 'Gisatlib.form.HiddenStoreField', 'Ext.form.field.Hidden', 'PumaMain.view.ChartPanel', 'Ext.ux.grid.menu.ListMenu',
                    'Ext.ux.grid.menu.RangeMenu', 'Ext.ux.grid.filter.BooleanFilter', 'Ext.picker.Date', 'Ext.ux.grid.filter.DateTimeFilter', 'Ext.picker.Month',
                    'Ext.ux.grid.filter.ListFilter', 'PumaMain.view.LayerPanel', 'PumaMain.view.MapTools', 'Gisatlib.slider.DiscreteTimeline', 'PumaMain.view.AreaTree'
                ],

                launch: function () {
                    self.loginController = this.getController("Puma.controller.Login");
                    self.domManipulationController = this.getController('DomManipulation');
                    self.renderController = this.getController('Render');
                    self.dataViewController = this.getController('Dataview');

                    resolve();
                }
            });
        })
    };

    afterLoad() {
        // set Home link in header // todo Move this somewhere else?
        $("#home-link").attr("href", Config.projectHome);
        $("#legacy-view-selector > .label").html(Config.basicTexts.appName);
        $("#content-intro > .label").html(Config.basicTexts.appName);

        if (Config.toggles.isUrbanTep) {
            $('html').addClass("urban-tep");
            $('#header .menu #intro-link').hide();
            $('#header .menu #downloads-link').hide();
            $('#header .menu #help-link').hide();
            $('.user .sep').hide();
        }

        if (Config.toggles.hideWorldBank) {
            $('#header .menu #intro-link').hide();
            $('#header .menu #downloads-link').hide();
        }

        if (Config.toggles.hasNewEvaluationTool) {
            $("#placeholder-evaluation-widget").css("display", "block");
        }

        if (Config.toggles.isNewDesign) {
            $("html").addClass("newDesign");
        }

        if (Config.toggles.isSnow) {
            $("html").addClass("snow");
        }

        if (Config.toggles.useWBAgreement) {
            $("html").addClass("toggle-useWBAgreement");
        }

        if (Config.toggles.useWBHeader) {
            $("html").addClass("toggle-useWBHeader");
        }

        if (Config.toggles.useHeader) {
            $("html").addClass("toggle-useHeader");
        }

        if (Config.toggles.useWBFooter) {
            $("html").addClass("toggle-useWBFooter");
        }

        if (!Config.toggles.useNewViewSelector) {
            $("html").addClass("toggle-useLegacyViewSelector");
        }

        if (Config.toggles.useTopToolbar) {
            $("html").addClass("toggle-useTopToolbar");
        }

        if (Config.toggles.allowPumaHelp) {
            $("html").addClass("toggle-allowPumaHelp");
        }

        if (Config.toggles.allowDownloadsLink) {
            $("html").addClass("toggle-allowDownloadsLink");
        }

        if (Config.toggles.usePumaLogo) {
            $("html").addClass("toggle-usePumaLogo");
        }

        if (Config.toggles.hideSelectorToolbar) {
            $("html").addClass("toggle-hideSelectorToolbar");
        }

        if (Config.toggles[window.location.origin]) {
            Config.toggles[window.location.origin].classes.forEach(function (className) {
                $("html").addClass(className);
            });
        }

        // dromas view
        let isDromas = $('html').hasClass("dromas");
        if (isDromas) {
            $('#content-intro > .label').html("");
            $('#header').prepend('<div class="project-logo"></div>');
            $('#map-holder').prepend('<div id="intro-overlay"></div>')
        }

        Ext.Ajax.method = 'POST';
        Ext.tip.QuickTipManager.init();

        Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
            cls: 'standardqtip'
        });
        Ext.window.Window.prototype.resizable = false;

        let url = new URL(window.location);
        let id = url.searchParams.get('id');

        let self = this;
        if (url.searchParams.get('needLogin')) {
            $('#hideAllExceptLogin').show();

            this.loginController.getApplication().on('login',function(loggedIn) {
                Config.dataviewId = id;
                $('#hideAllExceptLogin').hide();
                self.login(loggedIn, id);
            });
        } else if (id) {
            Config.dataviewId = id;
            // Load stores when only for print or loading the whole application.
            let stores = ['location', 'theme', 'layergroup', 'attributeset', 'attribute', 'visualization', 'year', 'areatemplate', 'symbology', 'dataset', 'topic'];
            let promises = [];
            let self = this;
            stores.forEach(function (storeName) {
                promises.push(new Promise(function (resolve, reject) {
                    let store = Ext.StoreMgr.lookup(storeName);
                    store.on('datachanged', function (data) {
                        resolve(data);
                    });
					store.on('load', self.afterStoreLoad.bind(self));
                    store.load();
                }));
            });

            Promise.all(promises).then(function (data) {
                self.dataViewController.onLoadingFinished();
                self.domManipulationController.renderApp();
                self.renderController.renderApp();
            }).catch(function (err) {
                Logger.logMessage(Logger.LEVEL_SEVERE, 'Ext', 'afterLoad', err);
                alert(polyglot.t("notPossibleToLoadData"));
            });
        } else {
            window.Stores.notify("initialLoadingFinished");
        }
    };

    login(loggedIn, id) {
        if (loggedIn) {
            let stores = ['location', 'theme', 'layergroup', 'attributeset', 'attribute', 'visualization', 'year', 'areatemplate', 'symbology', 'dataset', 'topic'];
			let self = this;
            stores.forEach(function (store) {
                let extStore = Ext.StoreMgr.lookup(store);
				extStore.on('load', self.afterStoreLoad.bind(self));
				extStore.load();
            });

            this.dataViewController.onLoadingFinished();

            if (this._dataviewId !== Config.dataviewId) {
                this.domManipulationController.renderApp();
                this.renderController.renderApp();
            }

            this._dataviewId = Config.dataviewId;
        } else {
            window.Stores.notify("initialLoadingFinished");
            this.loginController.onLoginClicked(null, true);
        }
    };

    afterStoreLoad(store, records){
		if ((store.storeId === 'symbology' || store.storeId === 'areatemplate') && records){
			let data = [];
			records.forEach(function(record){
				data.push(record.raw);
			});
			switch(store.storeId){
				case 'symbology':
					window.Stores.notify("STYLES_LOADED", data);
					break;
				case 'areatemplate':
					window.Stores.notify("LAYER_TEMPLATES_LOADED", data);
					break;
			}
		}
    }
}

export default ExtApp;
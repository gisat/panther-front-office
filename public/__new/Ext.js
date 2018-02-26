define([
    'js/util/Promise'
], function(Promise){
    /**
     *
     * @constructor
     */
    var ExtApp = function() {
        Ext.Loader.setConfig({
            enabled: true
            , disableCaching: false
        });

        Ext.Loader.setPath('Ext.ux', 'ux');
        Ext.Loader.setPath('Gisatlib', 'gisatlib');
        Ext.Loader.setPath('Ext', 'extjs-4.1.3/src');
        Ext.Loader.setPath('Puma.patch', 'patch');
        Ext.Loader.setPath('Puma', '_common');
    };

    ExtApp.prototype.setUp = function() {
        var self = this;
        return new Promise(function(resolve, reject){
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
                    'Ext.ux.grid.filter.ListFilter',  'PumaMain.view.LayerPanel', 'PumaMain.view.MapTools', 'Gisatlib.slider.DiscreteTimeline', 'PumaMain.view.AreaTree'
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

    ExtApp.prototype.afterLoad = function() {
        // set Home link in header // todo Move this somewhere else?
        $("#home-link").attr("href", Config.projectHome);
        $("title").html(Config.basicTexts.appTitle);
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
        var isDromas = $('html').hasClass("dromas");
        if (isDromas) {
            $('#content-intro > .label').html("");
            $('#header').prepend('<div class="project-logo"></div>');
            $('#map-holder').prepend('<div id="intro-overlay"></div>')
        }

        window.location.origin = window.location.origin || (window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : ''));
        Ext.Ajax.method = 'POST';
        Ext.tip.QuickTipManager.init();

        Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
            cls: 'standardqtip'
        });
        Ext.window.Window.prototype.resizable = false;

        var url = new URL(window.location);
        var id = url.searchParams.get('id');

        var self = this;
        if (url.searchParams.get('needLogin')) {
            $('#hideAllExceptLogin').show();

            this.on('login', function (loggedIn) {
                self.login(loggedIn);
            });
        } else if (id) {
            Config.dataviewId = id;
            // Load stores when only for print or loading the whole application.
            var stores = ['location', 'theme', 'layergroup', 'attributeset', 'attribute', 'visualization', 'year', 'areatemplate', 'symbology', 'dataset', 'topic', 'dataview'];
            var promises = [];
            stores.forEach(function (storeName) {
                promises.push(new Promise(function (resolve, reject) {
                    var store = Ext.StoreMgr.lookup(storeName);
                    store.on('datachanged', function (data) {
                        resolve(data);
                    });
                    store.load();
                }));
            });

            Promise.all(promises).then(function () {
                self.domManipulationController.renderApp();
                self.renderController.renderApp();
            }).catch(function (err) {
                console.log(err);
                alert(polyglot.t("notPossibleToLoadData"));
            });
        } else {
            this.domManipulationController.renderIntro();
            this.renderController.renderIntro();
        }
    };

    ExtApp.prototype.login = function(loggedIn) {
        if (loggedIn) {
            Config.dataviewId = id;
            $('#hideAllExceptLogin').hide();

            var stores = ['location', 'theme', 'layergroup', 'attributeset', 'attribute', 'visualization', 'year', 'areatemplate', 'symbology', 'dataset', 'topic', 'dataview'];
            stores.forEach(function (store) {
                Ext.StoreMgr.lookup(store).load();
            });

            this.dataViewController.onLoadingFinished();

            if (this._dataviewId !== id) {
                this.domManipulationController.renderApp();
                this.renderController.renderApp();
            }

            this._dataviewId = id;
        } else {
            window.Stores.notify("initialLoadingFinished");
            this.loginController.onLoginClicked();
        }
    };

    return ExtApp;
});
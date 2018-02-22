Ext.Loader.setConfig({
    enabled: true
    , disableCaching: false
});

Ext.Loader.setPath('Ext.ux', 'ux');
Ext.Loader.setPath('Gisatlib', 'gisatlib');
Ext.Loader.setPath('Ext', 'extjs-4.1.3/src');
Ext.Loader.setPath('Puma.patch', 'patch');
Ext.Loader.setPath('Puma', '_common');

Ext.application({
    name: 'PumaMain',
    appFolder: '_main',
    controllers: ['Export', 'DomManipulation', 'Render', 'Store', 'LocationTheme', 'Area', 'Layers', 'Screenshot', 'AttributeConfig', 'ViewMng', 'Login', 'Select', 'Chart'],
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
        // replace protocol with no-ssl http when loading chart or map in Phantomjs
        //if(location.protocol=="http:"){
        //	var originalUrl = Config.url;
        //	Config.url = Config.url.replace("https://", "http://");
        //	if(originalUrl != Config.url){
        //		console.log("Config.url replaced:", originalUrl, " -> ", Config.url);
        //	}
        //}

        this.geoserverLogin();

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

        if (Config.toggles.isUrbis) {
            $("html").addClass("urbis");

            $(".field.scope .label").html(Config.urbisTexts.scopeName);
            $(".field.place .label").html(Config.urbisTexts.placeName);
            $(".field.theme .label").html(Config.urbisTexts.themeName);

            $("#content-intro-guide").html("<h2>Selection guide</h2><h3>" + Config.urbisTexts.scopeName + "</h3><p>" +
                Config.urbisTexts.scopeAbout + "</p><h3>" + Config.urbisTexts.placeName + "</h3><p>" +
                Config.urbisTexts.placeAbout + "</p><h3>" + Config.urbisTexts.themeName + "</h3><p>" +
                Config.urbisTexts.themeAbout + "</p>");

            var aboutProject = "<div id='about-urbis'><h2>About project</h2><p>To get an overview about the URBIS project - Urban Land Recycling Information Services for Sustainable Cities, please visit the <a href='http://www.ict-urbis.eu/' target='_blank'>URBIS homepage</a>.</p></div>";
            $("#content-intro-guide").append(aboutProject);
        }

        if (Config.toggles.isEea) {
            $("html").addClass("eea");
            $(".field.place .label").html(Config.eeaTexts.placeName);
            $("#content-intro-guide h3:nth-child(4)").html("");
            $("#content-intro-guide p:nth-child(5)").html("");
        }

        if (Config.toggles.isSnow) {
            $("html").addClass("snow");
        }

        if (Config.toggles.hasOwnProperty("isMelodies") && Config.toggles.isMelodies) {
            $("html").addClass("melodies");
            $("#footer-bar").html("").append("<img alt='eu-logo' src='images/melodies/eu-logo.png'>")
                .append("<p>This research has received funding from the European Union Seventh Framework Programme (FP7/2013-2016) under grant agreement number 603525. It is coordinated by the University of Reading and operated by a 16 member consortium. </p>");
            $("#footer-legal").html("").append("<img src='images/melodies/gisat-logo-2.png'>")
                .append("<p>Copyright © 2014 GISAT s.r.o.</p>");
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
        if (Config.exportPage) {
            this.getController('Export').initConf();
            return;
        }
        Ext.tip.QuickTipManager.init();

        Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
            cls: 'standardqtip'
        });
        Ext.window.Window.prototype.resizable = false;

        var loginController = this.getController('Puma.controller.Login');
        var search = window.location.search.split('?')[1];
        var afterId = search ? search.split('id=')[1] : null;
        var id = afterId ? afterId.split('&')[0] : null;
        if (new URL(window.location).searchParams.get('needLogin')) {
            $('#hideAllExceptLogin').show();

            this.on('login', function (loggedIn) {
                if (loggedIn) {
                    Config.dataviewId = id;
                    $('#hideAllExceptLogin').hide();

                    var stores = ['location', 'theme', 'layergroup', 'attributeset', 'attribute', 'visualization', 'year', 'areatemplate', 'symbology', 'dataset', 'topic', 'dataview'];
                    stores.forEach(function (store) {
                        Ext.StoreMgr.lookup(store).load();
                    });

                    this.getController('Dataview').onLoadingFinished();

                    if (this._dataviewId !== id) {
                        this.getController('DomManipulation').renderApp();
                        this.getController('Render').renderApp();
                    }

                    this._dataviewId = id;
                } else {
                    window.Stores.notify("initialLoadingFinished");
                    loginController.onLoginClicked();
                }
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
            var self = this;
            Promise.all(promises).then(function () {
                self.getController('DomManipulation').renderApp();
                self.getController('Render').renderApp();
            }).catch(function (err) {
                console.log(err);
                alert(polyglot.t("notPossibleToLoadData"));
            });
        } else {
            Config.dataviewId = id;
            this.getController('Render').renderIntro();
        }
    },

    geoserverLogin: function () {
        $.ajax({
            type: "POST",
            url: Config.geoServerLoginUrl,
            data: {
                username: Config.geoServerUser,
                password: Config.geoServerPassword
            }
        }).done(function (res) {
            $('body').append('<div id="geoserver-login"></div>');
            var geoserverEl = $('#geoserver-login');
            geoserverEl.html(res);
            var loginInfo = geoserverEl.find('.username').text();
            var isLogged = loginInfo.slice(0, 6) === "Logged";
            if (isLogged) {
                console.log("GEOSERVER AUTHENTICATION: Authentication was successful")
            } else {
                console.error("GEOSERVER AUTHENTICATION: Authentication failed!");
            }
            var element = document.getElementById('geoserver-login');
            element.remove();
        }).fail(function (err) {
            console.error("GEOSERVER AUTHENTICATION: Authentication failed: " + err);
        });
    }
});

Ext.onReady(function () {
    Stores.notify('extLoaded');
});

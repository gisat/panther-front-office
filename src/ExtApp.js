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

        window.Stores.addListener(this.onEvent.bind(this));
    }

    setUp() {
        let self = this;
        return new Promise(function (resolve, reject) {
            Ext.application({
                name: 'PumaMain',
                appFolder: '_main',
                controllers: [
                    'DomManipulation', 'Render', 'Store', 'LocationTheme', 'Area', 'Layers',
                    'AttributeConfig', 'ViewMng', 'Select', 'Chart'
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
                    self.domManipulationController = this.getController('DomManipulation');
                    self.renderController = this.getController('Render');
                    self.dataViewController = this.getController('Dataview');

                    resolve();
                }
            });
        })
    };

    initialLoad(data){
		let scopesStore = Ext.StoreMgr.lookup('dataset');
		let placesStore = Ext.StoreMgr.lookup('location');
		let themesStore = Ext.StoreMgr.lookup('theme');
		let yearsStore = Ext.StoreMgr.lookup('year');
		let visualizationsStore = Ext.StoreMgr.lookup('visualization');

		let locationStore = Ext.StoreMgr.lookup('location4init');
		let themeStore = Ext.StoreMgr.lookup('theme4sel');
		let yearStore = Ext.StoreMgr.lookup('year4sel');
		let visStore = Ext.StoreMgr.lookup('visualization4sel');

		if (data.scopes){
		    scopesStore.add(data.scopes);
        }
		if (data.places){
			placesStore.add(data.places);
			locationStore.add(data.places);
		}
		if (data.themes){
			themesStore.add(data.themes);
			themeStore.add(data.themes);
		}
		if (data.periods){
			yearsStore.add(data.periods);
			yearStore.add(data.periods);
		}

		if (data.visualizations){
			visualizationsStore.add(data.visualizations);
			visStore.add(data.visualizations);
		}

		if (data.attributeSets){
			this.addAttributeSetsToStore(data.attributeSets);
		}

		if (data.attributes){
			this.addAttributesToStore(data.attributes);
		}

		this.domManipulationController.renderApp();
		this.renderController.renderApp();
    };

	addAttributesToStore(data){
		Ext.StoreMgr.lookup('attribute').add(data);
	}

    addAttributeSetsToStore(data){
		Ext.StoreMgr.lookup('attributeset').add(data);
	}

    applyDataview(data){
		this.dataViewController.onLoadingFinished(data.dataview);
	};

    afterLoad() {
		$('#view-selector > .group').hide();

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

		window.Stores.notify("initialLoadingFinished");
    };

    onEvent(type, options){
        if (type === "SHOW_HEADER_LOGO"){
			$('#content-intro > .label').html("");
			$('#home-page').html('<img src="' + options + '" />');
        } else if (type === "REDUX_ATTRIBUTE_SETS_ADD"){
			if (options.length){
				this.addAttributeSetsToStore(options);
			}
		} else if (type === "REDUX_ATTRIBUTES_ADD"){
			if (options.length){
				this.addAttributesToStore(options);
			}
		}
    }
}

export default ExtApp;
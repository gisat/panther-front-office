

import Actions from './actions/Actions';
import AggregatedChartWidget from './view/widgets/AggregatedChartWidget/AggregatedChartWidget';
import Attributes from './util/metadata/Attributes';
import AttributesStore from './stores/gisat/Attributes';
import AttributeSets from './stores/gisat/AttributeSets';
import ChartContainer from './view/charts/ChartContainer';
import Customization from './util/Customization';
import Dataviews from './stores/gisat/Dataviews';
import EvaluationWidget from './view/widgets/EvaluationWidget/EvaluationWidget';
import ExtApp from './ExtApp';
import FeatureInfoTool from './view/tools/FeatureInfoTool/FeatureInfoTool';
import Filter from './util/Filter';
import FrontOffice from './FrontOffice';
import Groups from './stores/gisat/Groups';
import IntegrateCustomLayersWidget from './view/widgets/IntegrateCustomLayersWidget/IntegrateCustomLayersWidget'
import Layers from './stores/gisat/Layers';
import Locations from './stores/gisat/Locations';
import Map from './view/map/Map';
import MapsContainer from './view/mapsContainer/MapsContainer';
import MapStore from './stores/internal/MapStore';
import MapToolsWidget from './view/widgets/MapToolsWidget/MapToolsWidget';
import OSMWidget from './view/widgets/OSMWidget/OSMWidget';
import PanelIFrame from './view/PanelIFrame/PanelIFrame';
import Periods from './stores/gisat/Periods';
import PeriodsSelector from './view/selectors/PeriodsSelector/PeriodsSelector';
import Scopes from './stores/gisat/Scopes';
import SelectionStore from './stores/internal/SelectionStore';
import SnowMapController from './view/SnowMapController';
import SnowWidget from './view/widgets/SnowWidget/SnowWidget';
import StateStore from './stores/internal/StateStore';
import Themes from './stores/gisat/Themes';
import TopToolBar from './view/TopToolBar';
import Users from './stores/gisat/Users';
import Visualizations from './stores/gisat/Visualizations';
import WmsLayers from './stores/gisat/WmsLayers';
import WorldWindWidget from './view/widgets/WorldWindWidget/WorldWindWidget';
import places from "./subscribers/places";
import Uuid from "./util/Uuid";

let Config = window.Config;
let polyglot = window.polyglot;
let Widgets = window.Widgets;

let $ = window.$;

function loadApp(initialData) {
    let store = {
        attributes: new AttributesStore(initialData.attributes),
        attributeSets: new AttributeSets(initialData.attributeSets),
        dataviews: new Dataviews(),
        groups: new Groups(),
        layers: new Layers(),
        locations: new Locations(initialData.places),
        periods: new Periods(initialData.periods),
        scopes: new Scopes(initialData.scopes),
        themes: new Themes(initialData.themes),
        users: new Users(),
        visualizations: new Visualizations(),
        wmsLayers: new WmsLayers()
    };

	applyProjectSettings();
    if(!new URL(window.location).searchParams.get('id')) {
        $('#loading-screen').hide();
        return;
    }

    function applyProjectSettings(){
        let url = window.location.origin;
        let projectConfig = Config.toggles[url];

        if (projectConfig && projectConfig.classes && projectConfig.classes.length){
			window.Stores.notify("application#setHtmlClass", {
			    configuration: 'forUrl',
                htmlClass: projectConfig.classes[0]});
        }

        if (projectConfig && projectConfig.intro && projectConfig.intro.title){
            $("title").html(projectConfig.intro.title);
        }
    }

    $(document).ready(function () {
        function createScript(src, dataMain) {
            return new Promise(function (resolve, reject) {
                var callback = function () {
                    resolve();
                };
                var startupScript = document.createElement("script");
                startupScript.type = "text/javascript";
                startupScript.src = src;
                startupScript.async = 1;
                startupScript.onload = callback;
                document.getElementsByTagName('head')[0].appendChild(startupScript);
                if (dataMain) {
                    document.getElementsByTagName('head')[0].lastChild.setAttribute("data-main", dataMain);
                }
            });
        }
        function createLink(href) {
            return new Promise(function (resolve, reject) {
                var callback = function () {
                    resolve();
                };
                var startupScript = document.createElement("link");
                startupScript.type = "text/css";
                startupScript.async = 1;
                startupScript.href = href;
                startupScript.rel = 'stylesheet';
                startupScript.onload = callback;
                document.getElementsByTagName('head')[0].appendChild(startupScript);
            });
        }

        let ext;
        createScript('lib/OpenLayers.js').then(function(){
            return createScript('gisatlib/OpenLayers/Geoserver23.js');
        }).then(function(){
            return createScript('lib/Highcharts-3.0.0/js/highcharts.src.js');
        }).then(function(){
            return createScript('lib/Highcharts-3.0.0/js/highcharts-more.js');
        }).then(function(){
            return createScript('lib/Highcharts-3.0.0/js/modules/exporting.js');
        }).then(function(){
            return createScript('extjs-4.1.3/ext-all.js');
        }).then(function(){
            var urlLang = new URL(window.location).searchParams.get('lang');
            if(urlLang === "cz") {
                return createScript('extjs-4.1.3/locale/ext-lang-cs.js');
            }
        }).then(() => {
            ext = new ExtApp();
            return ext.setUp();
        }).then(function () {
			return ext.initialLoad(initialData);
		}).then(function () {
            return ext.afterLoad();
        }).then(function () {
			setUpNewApp();
			ext.applyDataview(initialData);

			if (initialData.activeScopeStyle){
				applyScopeStyle(initialData.activeScopeStyle);
            }
        }).catch(err => {
            console.error('Loading#', err);
        });

        // load project styles depending on the toggles
        if((Config.toggles.hasOwnProperty("hasNewEvaluationTool") && Config.toggles.hasNewEvaluationTool) ||
            (Config.toggles.hasOwnProperty("hasNewFeatureInfo") && Config.toggles.hasNewFeatureInfo) ||
            (Config.toggles.hasOwnProperty("hasNew3Dmap") && Config.toggles.hasNew3Dmap) ||
            (Config.toggles.hasOwnProperty("isMelodies") && Config.toggles.isMelodies))
        {
            createLink("styles/font-awesome.min.css");
            createLink("styles/jquery-ui.css");
            createLink("styles/style.css");
            createLink("styles/select2.min.css");
        }
        if(Config.toggles.isNewDesign){
            createLink("css/newDesign.css");
            createLink("styles/projects.css");
        }
    });

    function applyScopeStyle(style) {
        if (style.logoSrc){
			window.Stores.notify("SHOW_HEADER_LOGO", initialData.activeScopeStyle.logoSrc);
        }
	}

    function setUpNewApp() {
        function stop(event){
            event.preventDefault();
            event.stopPropagation();
        }
        window.addEventListener('dragenter', stop);
        window.addEventListener('dragover', stop);
        window.addEventListener('dragleave', stop);

        window.Stores.addListener(sortFloaters);

        var tools = [];
        var widgets = [];

        var stateStore = new StateStore({
            dispatcher: window.Stores,
            store: {},
            activeKeys: initialData.activeKeys
        });
        window.stateStore = stateStore;

        var mapStore = new MapStore({
            dispatcher: window.Stores,
            store: {
                state: stateStore,
                wms: store.wmsLayers
            }
        });

        /**
         * Temporary solution for generating snapshots.
         */
        window.Stores.generateSnapshot = function() {
            var promises = [];

            mapStore.getAll().forEach(function(map){
                promises.push(map.snapshot().then(function(snapshotUrl){
                    let uuid = new Uuid().generate();
                    return {
                        uuid: uuid,
                        name: 'Map ' + uuid,
                        source: snapshotUrl
                    }
                }))
            });

            return Promise.all(promises);
        };

        window.selectionStore = new SelectionStore({
            dispatcher: window.Stores,
            store: {
                state: stateStore
            }
        });


        var attributes = buildAttributes();
        var filter = buildFilter(stateStore);
        var olMap = buildOpenLayersMap(stateStore);

        // customization
        new Customization({
            dispatcher: window.Stores,
            useWorldWindOnly: Config.toggles.useWorldWindOnly,
            skipSelection: Config.toggles.skipInitialSelection,
            store: {
                locations: store.locations,
                themes: store.themes,
                scopes: store.scopes,
                state: stateStore
            }
        });
        if(Config.toggles.home) {
            $('#home-page').attr('href', Config.toggles.home);
        }
        if(Config.toggles.administration) {
            $('#bo-link a').attr('href', Config.toggles.administration);
        }
        if(Config.toggles.topLinks) {
            var links = Config.toggles.topLinks.map(function(link){
                return '<li><a href="'+link.url+'" target="_blank">'+link.text+'</a></li>';
            });
            $('#header .menu').append(links);
        }

        // Chart container
        new ChartContainer({
            dispatcher: window.Stores
        });

        // ALWAYS add new feature info
        var featureInfoTool = buildFeatureInfoTool(mapStore, stateStore);
        tools.push(featureInfoTool);

        new PeriodsSelector({
            containerSelector: $("#content-application .group-visualization"),
            dispatcher: window.Stores,
            maxSelected: 12,
            store: {
                periods: store.periods,
                scopes: store.scopes,
                state: stateStore
            }
        });
        $("#view-selector .period").addClass("hidden");

        if(Config.toggles.useTopToolbar){
            var topToolBar = new TopToolBar({
                dispatcher: window.Stores,
                store: {
                    scopes: store.scopes,
                    state: stateStore,
                    map: mapStore
                }
            });
        }
        // create tools and widgets according to configuration
        if(Config.toggles.hasOwnProperty("hasNew3Dmap") && Config.toggles.hasNew3Dmap){
            var mapsContainer = buildMapsContainer(mapStore, stateStore);
            var worldWindWidget = buildWorldWindWidget(mapsContainer, topToolBar, stateStore, mapStore);
            widgets.push(worldWindWidget);
            var mapToolsWidget = buildMapToolsWidget(featureInfoTool, stateStore, mapStore);
            widgets.push(mapToolsWidget);

            if(Config.toggles.hasOsmWidget) {
                widgets.push(buildOsmWidget(mapsContainer, mapStore));
            }
        }
        if(Config.toggles.hasOwnProperty("hasNewEvaluationTool") && Config.toggles.hasNewEvaluationTool){
            var aggregatedWidget = buildAggregatedChartWidget(filter, stateStore);
            var evaluationTool = buildEvaluationWidget(filter, stateStore, aggregatedWidget);
            widgets.push(evaluationTool);
            widgets.push(aggregatedWidget);
        }
        if(Config.toggles.isSnow){
            var panelIFrame = new PanelIFrame(Config.snowUrl + 'snow/');
            //var panelIFrame = new PanelIFrame('http://localhost:63326/panther-front-office/src/iframe-test.html');
            var snowMapController = new SnowMapController({
                iFrame: panelIFrame
            });

            widgets.push(buildSnowWidget(snowMapController, panelIFrame));
            snowViewChanges();
        }

        widgets.push(buildIntegrateCustomLayersWidget());

        // build app, map is class for OpenLayers map
        new FrontOffice({
            dispatcher: window.Stores,
            attributesMetadata: attributes,
            mapsContainer: mapsContainer,
            tools: tools,
            topToolBar: topToolBar,
            widgets: widgets,
            widgetOptions: {
                olMap: olMap
            },
            store: {
                attributes: store.attributes,
                attributeSets: store.attributeSets,
                dataviews: store.dataviews,
                groups: store.groups,
                layers: store.layers,
                locations: store.locations,
                periods: store.periods,
                scopes: store.scopes,
                themes: store.themes,
                users: store.users,
                visualizations: store.visualizations,
                wmsLayers: store.wmsLayers,
                map: mapStore,
                state: stateStore
            }
        });

        var floater = $(".floater");

        floater.draggable({
            containment: "body",
            handle: ".floater-header"
        });

        floater.on("click", ".widget-minimise", function(e){
            var mode3d = $("body").hasClass("mode-3d");
            if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
                var floater = $(this).parent().parent().parent();
                if (Config.toggles.useNewViewSelector && Config.toggles.useTopToolbar){
                    var id = floater.attr('id');
                    floater.removeClass('open');
                    $('.item[data-for=' + id + ']').removeClass('open');
                }
                window.Stores.notify("widget#changedState", {floater: floater});
            }
        });

        $("body").on("click drag", ".floating-window", function(){
            window.Stores.notify(Actions.floatersSort, {
                fromExt: false,
                floaterJQuerySelector: $(this)
            });
        });

        $("body").on("click drag", ".x-window", function(){
            window.Stores.notify(Actions.floatersSort, {
                fromExt: false,
                xWindowJQuerySelector: $(this)[0]
            });
        });

        $('#header>h1').text(polyglot.t('dataExploration'));
        $('#header .menu #intro-link a').text(polyglot.t('introduction'));
        $('#header .menu #downloads-link a').text(polyglot.t('downloads'));
        $('#header .menu #help-link a').text(polyglot.t('help'));
        $('#header .menu #bo-link a').text(polyglot.t('administration'));
        $('#header .user .login').text(polyglot.t('login'));
        $('#header .user .signup').text(polyglot.t('signUp'));
        $('#content #content-intro>div.label').text(polyglot.t('dataExploration'));
        $('#content #content-intro .scope .label').text(polyglot.t('scope'));
        $('#content #content-intro .place .label').text(polyglot.t('place'));
        $('#content #content-intro .theme .label').text(polyglot.t('theme'));
        $('#content #content-intro-guide').html(polyglot.t('selectionGuide'));
        $('#content #content-application .scope .label').text(polyglot.t('scope'));
        $('#content #content-application .place .label').text(polyglot.t('place'));
        $('#content #content-application .theme .label').text(polyglot.t('theme'));
        $('#content #content-application .period .label').text(polyglot.t('year'));
        $('#content #content-application .visualization .label').text(polyglot.t('visualization'));
        $('#content #content-application #top-toolbar #top-toolbar-tools #top-toolbar-snapshot').attr('title', polyglot.t('takeMapSnapshot'));
        $('#content #content-application #top-toolbar #top-toolbar-tools #top-toolbar-context-help').attr('title', polyglot.t('contextHelp'));
        $('#content #content-application #sidebar-tools #sidebar-tools-toggle').attr('title', polyglot.t('tools'));
        $('#content #content-application #sidebar-reports #sidebar-reports-toggle').attr('title', polyglot.t('reports'));
    }

    /**
     * Move active floater on the top
     * @param type {string} type of action
     * @param options {Object}
     * @param options.fromExt {boolean} True, if notification comes from Ext code
     * @param [options.xWindow] {Object} Optional. Ext window.
     * @param [options.xWindowJQuerySelector] {Object} Optional. JQuery selector of Ext window element
     * @param [options.floaterJQuerySelector] {Object} Optional. JQuery selector of floating window element
     */
    function sortFloaters(type, options) {
        setTimeout(function () {
            if (type === Actions.floatersSort) {
                if (options.fromExt) {
                    window.ActiveWindowZindex = Number(options.xWindow.el.dom.style.zIndex);
                    $(".floating-window").removeClass("active").css("zIndex", "");
                } else {
                    if (options.xWindowJQuerySelector) {
                        window.ActiveWindowZindex = Number(options.xWindowJQuerySelector.style.zIndex);
                        $(".floating-window").removeClass("active").css("zIndex", "");
                    } else if (options.floaterJQuerySelector) {
                        $(".floating-window").removeClass("active").css("zIndex", "");
                        options.floaterJQuerySelector.addClass("active");
                        if (window.ActiveWindowZindex > 0) {
                            options.floaterJQuerySelector.css("zIndex", (window.ActiveWindowZindex + 1));
                        }
                    }
                }
            }
        }, 20);
    }

    /**
     * Build Attributes instance
     * @returns {Attributes}
     */
    function buildAttributes() {
        return new Attributes({
            dispatcher: window.Stores,
            store: {
                attributes: store.attributes,
                attributeSets: store.attributeSets
            }
        });
    }

    /**
     * Build Filter instance
     * @returns {Filter}
     */
    function buildFilter(stateStore) {
        return new Filter({
            dispatcher: window.Stores,
            store: {
                state: stateStore
            }
        });
    }

    /**
     * Build Map instance
     * @returns {Map}
     */
    function buildOpenLayersMap(stateStore) {
        return new Map({
            store: {
                state: stateStore
            }
        });
    }

    /**
     * Build Evaluation Widget instance
     * @param filter {Filter}
     * @param stateStore {StateStore}
     * @param aggregatedChart {StateStore}
     * @returns {EvaluationWidget}
     */
    function buildEvaluationWidget(filter, stateStore, aggregatedChart) {
        let isOpen = false;
        if (Config.toggles.hasOwnProperty("isUrbis") && Config.toggles.isUrbis) {
            isOpen = true;
        }

        return new EvaluationWidget({
            filter: filter,
            elementId: 'evaluation-widget',
            name: polyglot.t('areasFilter'),
            placeholderTargetId: 'widget-container',
            aggregatedChart: aggregatedChart,
            isOpen: isOpen,
			isPinnable: true,
            dispatcher: window.Stores,
            store: {
                state: stateStore
            }
        });
    }

    function buildAggregatedChartWidget(filter, stateStore) {
        return new AggregatedChartWidget({
            filter: filter,
            elementId: 'functional-urban-area-result',
            name: "Aggregated Chart",
            placeholderTargetId: 'widget-container',
            store: {
                state: stateStore
            }
        })
    }



    /**
     * Build SnowWidget instance
     * @param mapController {SnowMapController}
     * @param iFrame {PanelIFrame}
     * @returns {SnowWidget}
     */
    function buildSnowWidget(mapController, iFrame) {
        return new SnowWidget({
            elementId: 'snow-widget',
            name: polyglot.t('savedConfigurations'),
            placeholderTargetId: 'widget-container',
            iFrame: iFrame,
            mapController: mapController,
            dispatcher: window.Stores
        });
    }

    /**
     * Build WorldWindWidget instance
     * @param mapsContainer {MapsContainer}
     * @param stateStore {StateStore}
     * @returns {WorldWindWidget}
     */
    function buildWorldWindWidget(mapsContainer, topToolBar, stateStore, mapStore) {
        return new WorldWindWidget({
            elementId: 'world-wind-widget',
            name: polyglot.t('layers'),
            mapsContainer: mapsContainer,
            placeholderTargetId: 'widget-container',
            topToolBar: topToolBar,
            dispatcher: window.Stores,
            store: {
                periods: store.periods,
                state: stateStore,
                map: mapStore,
                wmsLayers: store.wmsLayers
            },
            isWithoutFooter: true,
            isFloaterExtAlike: false,
			isPinnable: true
        });
    }

    /**
     * Build Feature Info Tool instance
     * @returns {FeatureInfoTool}
     */
    function buildFeatureInfoTool(mapStore, stateStore) {
        return new FeatureInfoTool({
            id: 'feature-info',
            control2dClass: 'btn-tool-feature-info',
            dispatcher: window.Stores,
            store: {
                map: mapStore,
                state: stateStore
            }
        });
    }

    function buildIntegrateCustomLayersWidget() {
        return new IntegrateCustomLayersWidget({
            elementId: 'custom-integration-layers',
            name: polyglot.t('integrateCustomLayer'),
            placeholderTargetId: 'widget-container'
        });
    }

    /**
     * Build container for world wind maps within content element
     * @param mapStore {MapStore}
     * @param stateStore {StateStore}
     * @returns {MapsContainer}
     */
    function buildMapsContainer(mapStore, stateStore) {
        return new MapsContainer({
            id: "maps-container",
            dispatcher: window.Stores,
            target: $("#content"),
            store: {
                periods: store.periods,
                locations: store.locations,
                map: mapStore,
                state: stateStore,
                scopes: store.scopes,
                wmsLayers: store.wmsLayers
            }
        })
    }

    /**
     * Build widget for the Open Street Map vector information.
     * @param mapsContainer
     * @returns {OSMWidget}
     */
    function buildOsmWidget(mapsContainer, mapStore) {
        return new OSMWidget({
            elementId: 'osm-widget',
            name: polyglot.t('openStreetMaps'),
            mapsContainer: mapsContainer,
            store: {
                map: mapStore
            },
            dispatcher: window.Stores,
            isWithoutFooter: true,
            is3dOnly: true
        });
    }

    /**
     * Build widget of map tools for world wind maps
     * @param featureInfo {FeatureInfoTool}
     * @returns {MapToolsWidget}
     */
    function buildMapToolsWidget(featureInfo, stateStore, mapStore) {
        return new MapToolsWidget({
            elementId: 'map-tools-widget',
            name: polyglot.t("mapTools"),
            is3dOnly: true,
            isWithoutFooter: true,
            isPinnable: true,
            dispatcher: window.Stores,
            featureInfo: featureInfo,
            store: {
                map: mapStore,
                state: stateStore
            }
        })
    }

    /**
     * Modifications of FO view for SNOW PORTAL
     */
    function snowViewChanges() {
        // set correct link to intro page
        let introLink = $("#intro-link");
        if (introLink.length) {
            introLink.remove();
        }
        // use snow portal logo
        let headerSelector = $("#header");
        headerSelector.find("h1").remove();
        headerSelector.prepend("<a href='" + Config.snowUrl + "intro' id='project-logo'></a>");

        // hide top toolbar tools
        let topToolbarTools = $("#top-toolbar-tools");
        topToolbarTools.remove();
    }
}

export default loadApp;
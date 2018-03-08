requirejs.config({
    baseUrl: './__new',
	waitSeconds: 200,

    paths: {
        'css': 'lib/css.min',
        'd3': 'lib/d3.min',
        'earcut': 'lib/earcut-2.1.1.min',
        'jquery': 'lib/jquery-3.0.0',
        'jquery-private': 'js/jquery-private',
        'jquery-ui': 'lib/jquery-ui.min',
        'osmtogeojson': 'lib/osmtogeojson-3.0.0',
        'resize': 'lib/detect-element-resize',
		'select2': 'lib/select2.full.min',
        'string': 'lib/string',
        'underscore': 'lib/underscore-min',
        'text': 'lib/text',
		'tinysort': 'lib/tinysort.min',
        'wicket': 'lib/wicket',
        'worldwind': 'lib/worldwind.min'
    },

    map: {
        // '*' means all modules will get 'jquery-private' for their 'jquery' dependency.
        '*': {
            'css': 'css',
            'jquery': 'jquery-private'
        },

        // 'jquery-private' wants the real jQuery module though. If this line was not here, there would be an unresolvable cyclic dependency.
        'jquery-private': {
            'jquery': 'jquery'
        }
    },

    shim: {
        'jquery-ui': ['jquery'],
        'underscore': {
            exports: '_'
        }
    }
});

define(['js/actions/Actions',
		'js/view/widgets/AggregatedChartWidget/AggregatedChartWidget',
		'js/util/metadata/Attributes',
        'js/util/metadata/AnalyticalUnits',
        'js/view/charts/ChartContainer',
        'js/view/widgets/CityWidget/CityWidget',
        'js/view/widgets/CustomDrawingWidget/CustomDrawingWidget',
		'js/view/widgets/CustomViewsWidget/CustomViewsWidget',
		'js/util/Customization',
        'js/view/widgets/EvaluationWidget/EvaluationWidget',
        'js/view/tools/FeatureInfoTool/FeatureInfoTool',
        'js/util/Filter',
        'js/util/Floater',
		'./FrontOffice',
        'js/util/Logger',
        'js/view/map/Map',
		'js/view/mapsContainer/MapsContainer',
		'js/stores/internal/MapStore',
		'js/view/widgets/MapToolsWidget/MapToolsWidget',
		'js/view/widgets/OSMWidget/OSMWidget',
		'js/view/PanelIFrame/PanelIFrame',
		'js/view/selectors/PeriodsSelector/PeriodsSelector',
		'js/view/widgets/PeriodsWidget/PeriodsWidget',
		'js/util/Placeholder',
		'js/util/Remote',
		'js/view/widgets/SharingWidget/SharingWidget',
		'js/stores/internal/SelectionStore',
		'js/view/SnowMapController',
		'js/view/widgets/SnowWidget/SnowWidget',
		'js/stores/internal/StateStore',
		'js/stores/Stores',
        'js/view/TopToolBar',
        'js/view/widgets/WorldWindWidget/WorldWindWidget',

        'string',
        'jquery',
        'jquery-ui',
        'underscore'
], function (Actions,
			 AggregatedChartWidget,
			 Attributes,
             AnalyticalUnits,
             ChartContainer,
             CityWidget,
             CustomDrawingWidget,
			 CustomViewsWidget,
			 Customization,
             EvaluationWidget,
             FeatureInfoTool,
             Filter,
             Floater,
			 FrontOffice,
             Logger,
             Map,
             MapsContainer,
			 MapStore,
			 MapToolsWidget,
			 OSMWidget,
			 PanelIFrame,
			 PeriodsSelector,
			 PeriodsWidget,
			 Placeholder,
			 Remote,
			 SharingWidget,
			 SelectionStore,
			 SnowMapController,
			 SnowWidget,
			 StateStore,
			 Stores,
			 TopToolBar,
             WorldWindWidget,

             S,
             $){

    $(document).ready(function() {
    	window.Stores.addListener(sortFloaters);

        var tools = [];
        var widgets = [];

        var stateStore = new StateStore({
			dispatcher: window.Stores
		});
		var mapStore = new MapStore({
			dispatcher: window.Stores
		});
        var selectionStore = new SelectionStore({
			dispatcher: window.Stores,
			stateStore: stateStore
		});
        window.selectionStore = selectionStore;

		Stores.register('state', stateStore);
        Stores.register('selection', selectionStore);
        Stores.register('map', mapStore);

        var attributes = buildAttributes();
        var filter = buildFilter();
        var olMap = buildOpenLayersMap();

		// customization
		new Customization({
			dispatcher: window.Stores,
			useWorldWindOnly: Config.toggles.useWorldWindOnly,
			skipSelection: Config.toggles.skipInitialSelection
		});

		// Chart container
		new ChartContainer({
			dispatcher: window.Stores
		});

		// ALWAYS add new feature info
		var featureInfoTool = buildFeatureInfoTool();
		tools.push(featureInfoTool);

        if (Config.toggles.hasPeriodsSelector){
        	new PeriodsSelector({
				containerSelector: $("#content-application .group-visualization"),
				dispatcher: window.Stores,
				maxSelected: 12
			});
        	$("#view-selector .period").addClass("hidden");
		}

        if(Config.toggles.useTopToolbar){
            var topToolBar = new TopToolBar({
				dispatcher: window.Stores
			});
        }
        // create tools and widgets according to configuration
        if(Config.toggles.hasOwnProperty("hasNew3Dmap") && Config.toggles.hasNew3Dmap){
        	var mapsContainer = buildMapsContainer(mapStore, stateStore);
			var worldWindWidget = buildWorldWindWidget(mapsContainer, topToolBar, stateStore);
			widgets.push(worldWindWidget);
			var mapToolsWidget = buildMapToolsWidget(featureInfoTool);
			widgets.push(mapToolsWidget);

            if(Config.toggles.hasOsmWidget) {
                widgets.push(buildOsmWidget(mapsContainer, mapStore));
            }
        }
        if(Config.toggles.hasPeriodsWidget){
			var periodsWidget = buildPeriodsWidget(mapsContainer);
			widgets.push(periodsWidget);
		}
        if(Config.toggles.hasOwnProperty("hasNewEvaluationTool") && Config.toggles.hasNewEvaluationTool){
        	var aggregatedWidget = buildAggregatedChartWidget(filter, stateStore);
        	var evaluationTool = buildEvaluationWidget(filter, stateStore, aggregatedWidget);
            widgets.push(evaluationTool);
            widgets.push(aggregatedWidget);
        }
        if(Config.toggles.hasOwnProperty("hasNewCustomPolygonsTool") && Config.toggles.hasNewCustomPolygonsTool){
            widgets.push(buildCustomDrawingWidget());
        }
        if(Config.toggles.hasOwnProperty("isMelodies") && Config.toggles.isMelodies){
            widgets.push(buildCityWidget());
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

		widgets.push(buildCustomViewsWidget());
		widgets.push(buildSharingWidget());

		// build app, map is class for OpenLayers map
		new FrontOffice({
			attributesMetadata: attributes,
			tools: tools,
			widgets: widgets,
			widgetOptions: {
				olMap: olMap
			}
		});

        var widgetElement = $("#widget-container");
        var floater = $(".floater");

        /* TODO obsolete code? */
        widgetElement.on("click", ".placeholder", function(e){
            if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
                var placeholderSelector = "#" + $(this).attr("id");
                var floaterSelector = "#" + $(this).attr("id").replace("placeholder", "floater");
                var floater = $(floaterSelector);
                var placeholder = $(placeholderSelector);
                if (floater.hasClass("open")) {
                    Floater.minimise(floater);
                    Placeholder.floaterClosed(placeholder);
                    ExchangeParams.options.openWidgets[floaterSelector.slice(1)] = false;
                }
                else {
                    Floater.maximise(floater);
                    Placeholder.floaterOpened(placeholder);
                    $(".floating-window").removeClass("active");
                    floater.addClass("active");
                    ExchangeParams.options.openWidgets[floaterSelector.slice(1)] = true;
                }
            }
        });
        /* TODO end of obsolete code */


        floater.on("click", ".widget-minimise", function(e){
            var mode3d = $("body").hasClass("mode-3d");
            if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
                var floater = $(this).parent().parent().parent();
                if (Config.toggles.useNewViewSelector && Config.toggles.useTopToolbar){
                    var id = floater.attr('id');
                    floater.removeClass('open');
                    $('.item[data-for=' + id + ']').removeClass('open');
                } else {
                    if (!mode3d){
                        var placeholderSelector = "#" + floater.attr("id").replace("floater", "placeholder");
                        var placeholder = $(placeholderSelector);
                        Floater.minimise(floater);
                        Placeholder.floaterClosed(placeholder);
                        ExchangeParams.options.openWidgets[floater.attr("id")] = false;
                    }
                }
				window.Stores.notify("widget#changedState", {floater: floater});
            }
        });

        floater.draggable({
            containment: "body",
            handle: ".floater-header"
        });

        $("body").on("click drag", ".floating-window", function(){
			window.Stores.notify(Actions.floatersSort, {
				fromExt: false,
				floaterJQuerySelector: $(this)
			});
		});

		$("body").on("click drag", ".x-window:not(#loginwindow)", function(){
			window.Stores.notify(Actions.floatersSort, {
				fromExt: false,
				xWindowJQuerySelector: $(this)[0]
			});
		});
    });

	/**
	 * Move active floater on the top
	 * @param type {string} type of action
	 * @param options {Object}
	 * @param options.fromExt {boolean} True, if notification comes from Ext code
	 * @param [options.xWindow] {Object} Optional. Ext window.
	 * @param [options.xWindowJQuerySelector] {Object} Optional. JQuery selector of Ext window element
	 * @param [options.floaterJQuerySelector] {Object} Optional. JQuery selector of floating window element
	 */
	function sortFloaters (type, options){
		setTimeout(function(){
			if (type === Actions.floatersSort){
				if (options.fromExt){
					window.ActiveWindowZindex = Number(options.xWindow.el.dom.style.zIndex);
					$(".floating-window").removeClass("active").css("zIndex", "");
				} else {
					if (options.xWindowJQuerySelector){
						window.ActiveWindowZindex = Number(options.xWindowJQuerySelector.style.zIndex);
						$(".floating-window").removeClass("active").css("zIndex", "");
					} else if (options.floaterJQuerySelector){
						$(".floating-window").removeClass("active").css("zIndex", "");
						options.floaterJQuerySelector.addClass("active");
						if (window.ActiveWindowZindex > 0){
							options.floaterJQuerySelector.css("zIndex", (window.ActiveWindowZindex + 1));
						}
					}
				}
			}
		},20);
	}

	/**
     * Build Attributes instance
     * @returns {Attributes}
     */
    function buildAttributes (){
        return new Attributes();
    }

	/**
	 * Build Filter instance
     * @returns {Filter}
     */
    function buildFilter (){
        return new Filter({
			dispatcher: window.Stores
		});
    }

	/**
	 * Build Map instance
     * @returns {Map}
     */
    function buildOpenLayersMap (){
        return new Map();
    }

    /**
	 * Build Evaluation Widget instance
     * @param filter {Filter}
	 * @param stateStore {StateStore}
	 * @param aggregatedChart {StateStore}
     * @returns {EvaluationWidget}
     */
    function buildEvaluationWidget (filter, stateStore, aggregatedChart){
		var isOpen = false;
		if (Config.toggles.hasOwnProperty("isUrbis") && Config.toggles.isUrbis){
			isOpen = true;
		}

        return new EvaluationWidget({
            filter: filter,
			stateStore: stateStore,
            elementId: 'evaluation-widget',
            name: polyglot.t('areasFilter'),
            placeholderTargetId: 'widget-container',
			aggregatedChart: aggregatedChart,
			isOpen: isOpen,
			dispatcher: window.Stores
        });
    }

    function buildAggregatedChartWidget(filter, stateStore) {
		return new AggregatedChartWidget({
			filter: filter,
			elementId: 'functional-urban-area-result',
			name: "Aggregated Chart",
			placeholderTargetId: 'widget-container',
			stateStore: stateStore
		})
	}

	/**
     * Build Custom Drawing Widget instance
     * @returns {CustomDrawingWidget}
     */
    function buildCustomDrawingWidget (){
        return new CustomDrawingWidget({
            elementId: 'custom-polygons-widget',
            name: 'Custom Features',
            placeholderTargetId: 'widget-container'
        });
    }

	/**
	 * Build City Widget instance
     * @returns {CityWidget}
     */
    function buildCityWidget (){
        return new CityWidget({
            elementId: 'city-selection',
            name: polyglot.t('urbanDynamicTool'),
            placeholderTargetId: 'widget-container',
            selections: [{
                id: 'melodies-city-selection',
                name: polyglot.t('selectCity'),
                options: ['Brno', 'České Budějovice', 'Plzeň', 'Ostrava']
            }, {
                id: 'melodies-start-selection',
                name: polyglot.t('selectStart'),
                options: ['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016']
            }, {
                id: 'melodies-end-selection',
                name: polyglot.t('selectEnd'),
                options: ['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016']
            }]
        })
    }

    function buildPeriodsWidget (mapsContainer){
    	return new PeriodsWidget({
			elementId: 'periods-widget',
			name: polyglot.t('periods'),
			mapsContainer: mapsContainer,
			dispatcher: window.Stores,
			isWithoutFooter: true,
			is3dOnly: true
		});
	}

	/**
	 * Build SnowWidget instance
	 * @param mapController {SnowMapController}
	 * @param iFrame {PanelIFrame}
	 * @returns {SnowWidget}
	 */
	function buildSnowWidget (mapController, iFrame){
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
    function buildWorldWindWidget (mapsContainer, topToolBar, stateStore){
        return new WorldWindWidget({
            elementId: 'world-wind-widget',
            name: polyglot.t('layers'),
			mapsContainer: mapsContainer,
            placeholderTargetId: 'widget-container',
            topToolBar: topToolBar,
			dispatcher: window.Stores,
			stateStore: stateStore,
			isWithoutFooter: true,
			isFloaterExtAlike: false
        });
    }

	/**
	 * Build Feature Info Tool instance
     * @returns {FeatureInfoTool}
     */
    function buildFeatureInfoTool(){
        return new FeatureInfoTool({
            id: 'feature-info',
			control2dClass: 'btn-tool-feature-info',
			dispatcher: window.Stores
        });
    }

	/**
	 * It builds widget for sharing.
	 * @returns {*}
	 */
	function buildSharingWidget() {
		Widgets.sharing = new SharingWidget({
			elementId: 'sharing',
			name: polyglot.t('share'),
			placeholderTargetId: 'widget-container',
			dispatcher: window.Stores
		});

		return Widgets.sharing;
	}

	/**
	 * Build container for world wind maps within content element
	 * @param mapStore {MapStore}
	 * @param stateStore {StateStore}
	 * @returns {MapsContainer}
	 */
	function buildMapsContainer(mapStore, stateStore){
		return new MapsContainer({
			id: "maps-container",
			dispatcher: window.Stores,
			mapStore: mapStore,
			stateStore: stateStore,
			target: $("#content")
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
            mapStore: mapStore,
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
	function buildMapToolsWidget(featureInfo){
		return new MapToolsWidget({
			elementId: 'map-tools-widget',
			name: polyglot.t("mapTools"),
			is3dOnly: true,
			isWithoutFooter: true,
			dispatcher: window.Stores,
			featureInfo: featureInfo
		})
	}

	/**
	 * Build widget for dealing with custom views
	 * @returns {CustomViewsWidget}
	 */
	function buildCustomViewsWidget(){
		return new CustomViewsWidget({
			elementId: 'custom-views-widget',
			name: polyglot.t("customViews"),
			isWithoutFooter: true,
			isExpanded: true,
			isExpandable: true,
			dispatcher: window.Stores
		})
	}

	/**
	 * Modifications of FO view for SNOW PORTAL
	 */
	function snowViewChanges(){
		// set correct link to intro page
		var introLink = $("#intro-link");
		if (introLink.length){
			introLink.remove();
		}
		// use snow portal logo
		var headerSelector = $("#header");
		headerSelector.find("h1").remove();
		headerSelector.prepend("<a href='" + Config.snowUrl + "intro' id='project-logo'></a>");

		// hide top toolbar tools
		var topToolbarTools = $("#top-toolbar-tools");
		topToolbarTools.remove();
	}
});
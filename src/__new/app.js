requirejs.config({
    baseUrl: './__new',

    paths: {
        'css': 'lib/css.min',
        'd3': 'lib/d3.min',
        'jquery': 'lib/jquery-3.0.0',
        'jquery-private': 'js/jquery-private',
        'jquery-ui': 'lib/jquery-ui.min',
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

define(['js/view/widgets/AggregatedChartWidget/AggregatedChartWidget',
		'js/util/metadata/Attributes',
        'js/util/metadata/AnalyticalUnits',
        'js/view/widgets/CityWidget/CityWidget',
        'js/view/widgets/CustomDrawingWidget/CustomDrawingWidget',
        'js/view/widgets/EvaluationWidget/EvaluationWidget',
        'js/view/tools/FeatureInfoTool/FeatureInfoTool',
        'js/util/Filter',
        'js/util/Floater',
		'./FrontOffice',
        'js/util/Logger',
        'js/view/map/Map',
		'js/view/mapsContainer/MapsContainer',
		'js/stores/internal/MapStore',
		'js/view/selectors/PeriodsSelector/PeriodsSelector',
		'js/view/widgets/PeriodsWidget/PeriodsWidget',
		'js/util/Placeholder',
		'js/util/Remote',
		'js/view/widgets/SharingWidget/SharingWidget',
		'js/stores/internal/SelectionStore',
		'js/stores/internal/StateStore',
		'js/stores/Stores',
        'js/view/TopToolBar',
        'js/view/widgets/WorldWindWidget/WorldWindWidget',

        'string',
        'jquery',
        'jquery-ui',
        'underscore'
], function (AggregatedChartWidget,
			 Attributes,
             AnalyticalUnits,
             CityWidget,
             CustomDrawingWidget,
             EvaluationWidget,
             FeatureInfoTool,
             Filter,
             Floater,
			 FrontOffice,
             Logger,
             Map,
             MapsContainer,
			 MapStore,
			 PeriodsSelector,
			 PeriodsWidget,
			 Placeholder,
			 Remote,
			 SharingWidget,
			 SelectionStore,
			 StateStore,
			 Stores,
			 TopToolBar,
             WorldWindWidget,

             S,
             $){

    $(document).ready(function() {
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

        if (Config.toggles.hasPeriodsSelector){
        	new PeriodsSelector({
				containerSelector: $("#content-application .group-visualization"),
				dispatcher: window.Stores
			});
		}

        if(Config.toggles.useTopToolbar){
            var topToolBar = new TopToolBar();
        }
        // create tools and widgets according to configuration
        if(Config.toggles.hasOwnProperty("hasNew3Dmap") && Config.toggles.hasNew3Dmap){
        	var mapsContainer = buildMapsContainer(mapStore, stateStore);
			var worldWindWidget = buildWorldWindWidget(mapsContainer, topToolBar, stateStore);
            widgets.push(worldWindWidget);
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
        if(Config.toggles.hasOwnProperty("hasNewFeatureInfo") && Config.toggles.hasNewFeatureInfo){
            tools.push(buildFeatureInfoTool());
        }

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
                    $(".floater").removeClass("active");
                    floater.addClass("active");
                    ExchangeParams.options.openWidgets[floaterSelector.slice(1)] = true;
                }
            }
        });
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
            }
        });

        floater.draggable({
            containment: "body",
            handle: ".floater-header"
        }).on("click drag", function(){
            $(".floater, .tool-window, #feature-info-window").removeClass("active");
            $(this).addClass("active");
        });
    });

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
            name: 'Evaluation Tool',
            placeholderTargetId: 'widget-container',
			aggregatedChart: aggregatedChart,
			isOpen: isOpen
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
            name: 'UrbanDynamic Tool',
            placeholderTargetId: 'widget-container',
            selections: [{
                id: 'melodies-city-selection',
                name: 'Select city',
                options: ['Brno', 'České Budějovice', 'Plzeň', 'Ostrava']
            }, {
                id: 'melodies-start-selection',
                name: 'Select start',
                options: ['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016']
            }, {
                id: 'melodies-end-selection',
                name: 'Select end',
                options: ['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016']
            }]
        })
    }

    function buildPeriodsWidget (mapsContainer){
    	return new PeriodsWidget({
			elementId: 'periods-widget',
			name: 'Periods',
			mapsContainer: mapsContainer,
			dispatcher: window.Stores,
			isWithoutFooter: true,
			is3dOnly: true
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
            name: 'Layers',
			mapsContainer: mapsContainer,
            placeholderTargetId: 'widget-container',
            topToolBar: topToolBar,
			dispatcher: window.Stores,
			stateStore: stateStore,
			isWithoutFooter: true,
			isFloaterExtAlike: true
        });
    }

	/**
	 * Build Feature Info Tool instance
     * @returns {FeatureInfoTool}
     */
    function buildFeatureInfoTool(){
        return new FeatureInfoTool({
            id: 'feature-info',
            elementClass: 'btn-tool-feature-info'
        });
    }

	/**
	 * It builds widget for sharing.
	 * @returns {*}
	 */
	function buildSharingWidget() {
		Widgets.sharing = new SharingWidget({
			elementId: 'sharing',
			name: 'Share',
			placeholderTargetId: 'widget-container'
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
});
requirejs.config({
    baseUrl: './__new',

    paths: {
        'css': 'lib/css.min',
        'd3': 'lib/d3.min',
        'jquery': 'lib/jquery-3.0.0',
        'jquery-private': 'js/jquery-private',
        'jquery-ui': 'lib/jquery-ui.min',
        'resize': 'lib/detect-element-resize',
        'string': 'lib/string',
        'underscore': 'lib/underscore-min',
        'text': 'lib/text',
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

define(['js/util/metadata/Attributes',
        'js/util/metadata/AnalyticalUnits',
        'js/view/widgets/CityWidget/CityWidget',
        'js/view/widgets/CustomDrawingWidget/CustomDrawingWidget',
        'js/view/widgets/EvaluationWidget/EvaluationWidget',
        'js/view/tools/FeatureInfoTool/FeatureInfoTool',
        'js/view/widgets/FunctionalUrbanAreaWidget/FunctionalUrbanAreaWidget',
        'js/view/widgets/FunctionalUrbanAreaResultWidget/FunctionalUrbanAreaResultWidget',
        'js/util/Filter',
        'js/util/Floater',
		'./FrontOffice',
        'js/util/Logger',
        'js/view/map/Map',
        'js/view/widgets_3D/MapDiagramsWidget/MapDiagramsWidget',
        'js/view/PanelIFrame/PanelIFrame',
        'js/util/Placeholder',
		'js/util/Remote',
        'js/view/SnowMapController',
        'js/view/widgets/SnowWidget/SnowWidget',
		'js/stores/Stores',
        'js/view/TopToolBar',
        'js/view/worldWind/WorldWindMap',
        'js/view/widgets/WorldWindWidget/WorldWindWidget',

        'string',
        'jquery',
        'jquery-ui',
        'underscore'
], function (Attributes,
             AnalyticalUnits,
             CityWidget,
             CustomDrawingWidget,
             EvaluationWidget,
             FeatureInfoTool,
             FunctionalUrbanAreaWidget,
			 FunctionalUrbanAreaResultWidget,
			 Filter,
             Floater,
			 FrontOffice,
             Logger,
             Map,
             MapDiagramsWidget,
			 PanelIFrame,
             Placeholder,
			 Remote,
             SnowMapController,
             SnowWidget,
			 Stores,
			 TopToolBar,
             WorldWindMap,
             WorldWindWidget,

             S,
             $){

    $(document).ready(function() {
        var tools = [];
        var widgets = [];

        var attributes = buildAttributes();

        var filter = buildFilter();
        var olMap = buildOpenLayersMap();
        var webWorldWind = null;

        if(Config.toggles.useTopToolbar){
            var topToolBar = new TopToolBar();
        }

        // create tools and widgets according to configuration
        if(Config.toggles.hasOwnProperty("hasNew3Dmap") && Config.toggles.hasNew3Dmap){
            webWorldWind = buildWorldWindMap();
            widgets.push(buildWorldWindWidget(webWorldWind, topToolBar));
        }

        if(Config.toggles.isSnow){
            var panelIFrame = new PanelIFrame(Config.snowUrl + 'snow/');
            //var panelIFrame = new PanelIFrame('http://localhost:63326/panther-front-office/src/iframe-test.html');

            var snowMapController = new SnowMapController({
                iFrame: panelIFrame,
                worldWind: webWorldWind
            });

            widgets.push(buildSnowWidget(snowMapController, panelIFrame));
        }
        if(Config.toggles.hasOwnProperty("hasNewEvaluationTool") && Config.toggles.hasNewEvaluationTool){
            widgets.push(buildEvaluationWidget(filter));
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

		if(Config.toggles.hasFunctionalUrbanArea){
            var results = buildFunctionalUrbanAreaResultWidget();
			tools.push(buildFunctionalUrbanAreaWidget(results));
			tools.push(results);
		}

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
        return new Filter();
    }

	/**
	 * Build Map instance
     * @returns {Map}
     */
    function buildOpenLayersMap (){
        return new Map();
    }

    /**
     * Build World Wind Map instance
     * @returns {WorldWindMap}
     */
    function buildWorldWindMap (){
        return new WorldWindMap();
    }


    /**
	 * Build Evaluation Widget instance
     * @param filter {Filter}
     * @returns {EvaluationWidget}
     */
    function buildEvaluationWidget (filter){
        return new EvaluationWidget({
            filter: filter,
            elementId: 'evaluation-widget',
            name: 'Evaluation Tool',
            placeholderTargetId: 'widget-container'
        });
    }

    function buildFunctionalUrbanAreaWidget(results) {
        return new FunctionalUrbanAreaWidget({
            elementId: 'functional-urban-area',
            name: "Functional Urban Area",
            placeholderTargetId: 'widget-container',
            results: results
        });
    }

    function buildFunctionalUrbanAreaResultWidget() {
		return new FunctionalUrbanAreaResultWidget({
			elementId: 'functional-urban-area-result',
			name: "Functional Urban Area Results",
			placeholderTargetId: 'widget-container'
		});
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

    /**
     * Build SnowWidget instance
     * @param iFrame {PanelIFrame}
     * @returns {SnowWidget}
     */
    function buildSnowWidget (mapController, iFrame){
        return new SnowWidget({
            elementId: 'snow-widget',
            name: 'Saved configurations',
            placeholderTargetId: 'widget-container',
            iFrame: iFrame,
            mapController: mapController
        });
    }

    /**
     * Build WorldWindWidget instance
     * @param webWorldWind {WorldWindMap}
     * @returns {WorldWindWidget}
     */
    function buildWorldWindWidget (webWorldWind, topToolBar){
        return new WorldWindWidget({
            elementId: 'world-wind-widget',
            name: 'Layers',
            placeholderTargetId: 'widget-container',
            iconId: 'top-toolbar-3dmap',
            worldWind: webWorldWind,
            topToolBar: topToolBar
        });
    }

	/**
	 * Build Feature Info Tool instance
     * @returns {FeatureInfoTool}
     */
    function buildFeatureInfoTool(){
        return new FeatureInfoTool({
            id: 'feature-info',
            elementClass: 'btn-tool-feature-info',
        });
    }
});
requirejs.config({
    baseUrl: './__new',

    paths: {
        'css': 'lib/css.min',
        'jquery': 'lib/jquery-3.0.0',
        'jquery-private': 'js/jquery-private',
        'jquery-ui': 'lib/jquery-ui.min',
        'string': 'lib/string',
        'underscore': 'lib/underscore-min',
        'text': 'lib/text'
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
        'js/view/widgets/CityWidget/CityWidget',
        'js/view/widgets/EvaluationWidget/EvaluationWidget',
        'js/view/tools/FeatureInfoTool/FeatureInfoTool',
        'js/util/Filter',
        'js/util/Floater',
		'./FrontOffice',
        'js/util/Logger',
        'js/view/map/Map',
        'js/util/Placeholder',
		'js/util/Remote',
		'js/stores/Stores',

        'string',
        'jquery',
        'jquery-ui',
        'underscore'
], function (Attributes,
             CityWidget,
             EvaluationWidget,
             FeatureInfoTool,
             Filter,
             Floater,
			 FrontOffice,
             Logger,
             Map,
             Placeholder,
			 Remote,
			 Stores,

             S,
             $){

    $(document).ready(function() {
        var tools = [];
        
		if(Config.toggles.hasOwnProperty("hasNewEvaluationTool") && Config.toggles.hasNewEvaluationTool){
            new EvaluationWidget({
                attributesMetadata: new Attributes(),
                filter: new Filter(),
                elementId: 'evaluation-widget',
                name: 'Evaluation Tool',
                targetId: 'widget-container'
            });
        }

        if(Config.toggles.hasOwnProperty("hasNewFeatureInfo") && Config.toggles.hasNewFeatureInfo){
            tools.push(new FeatureInfoTool({
                elementId: 'feature-info-tool',
                targetId: 'tools-container'
            }));
        }

        if (Config.toggles.hasOwnProperty("isMelodies") && Config.toggles.isMelodies){
            new CityWidget({
                elementId: 'city-selection',
                name: 'UrbanDynamic Tool',
                targetId: 'widget-container',
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
            });
        }

        new FrontOffice({
            attributesMetadata: new Attributes(),
            tools: tools,
            map: new Map()
        });

        var widgets = $("#widget-container");
        widgets.on("click", ".placeholder", function(e){
            if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
                var placeholderSelector = "#" + $(this).attr("id");
                var floaterSelector = "#" + $(this).attr("id").replace("placeholder", "floater");
                var floater = $(floaterSelector);
                var placeholder = $(placeholderSelector);
                if (floater.hasClass("open")) {
                    Floater.minimise(floater);
                    Placeholder.floaterClosed(placeholder);
                }
                else {
                    Floater.maximise(floater);
                    Placeholder.floaterOpened(placeholder);
                    $(".floater").removeClass("active");
                    floater.addClass("active");
                }
            }
        });
        widgets.on("click", ".widget-minimise", function(e){
            if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
                var floater = $(this).parent().parent().parent();
                var placeholderSelector = "#" + floater.attr("id").replace("floater", "placeholder");
                var placeholder = $(placeholderSelector);
                Floater.minimise(floater);
                Placeholder.floaterClosed(placeholder);
            }
        });
        $(".floater").draggable({
            containment: "body",
            handle: ".floater-header",
            stop: function (ev, ui) {
                var element = $(this);
                element.css({
                    width: "",
                    height: ""
                });
            }
        }).on("click",function(){
            $(".floater").removeClass("active");
            $(this).addClass("active");
        });
    });
});
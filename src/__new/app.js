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

define(['js/view/widgets/EvaluationWidget/EvaluationWidget',
        'js/util/DataFilters',
        'js/util/Floater',
		'./FrontOffice',
        'js/util/Logger',
        'js/data/mockData',
        'js/util/Placeholder',
		'js/util/Remote',
		'js/stores/Stores',

        'string',
        'jquery',
        'jquery-ui',
        'underscore'
], function (EvaluationWidget,
             DataFilters,
             Floater,
			 FrontOffice,
             Logger,
             mockData,
             Placeholder,
			 Remote,
			 Stores,

             S,
             $){

	new FrontOffice();


	//$('body').on("click", "#evaluation-confirm", function(){
	//	new Remote({
	//		method: "POST",
	//		url: window.Config.url + "api/filter/filter",
	//		params: {
	//			dataset: JSON.stringify(2), // scope
	//			years: JSON.stringify([7]), // years id
	//			areas: JSON.stringify({
	//				"1":{ //place
	//					"6":[ // level
	//						"CZ010","CZ063","CZ064","CZ020","CZ031","CZ032","CZ041","CZ042","CZ051","CZ052","CZ053","CZ072","CZ071","CZ080"
	//					]}
	//			}),
	//			filters: JSON.stringify([]),
	//			attrs: JSON.stringify([{
	//				"as": 8,
	//				"attr": 10,
	//				"normType": "area"
	//			},{
	//				"as": 8,
	//				"attr": 21,
	//				"normType": "area"
	//			}])
	//		}
	//	}).then(function(result){
	//		var output = JSON.parse(result);
	//		console.log(output);
	//	});
	//});

    $(document).ready(function() {

		if(window.Config.toggles.hasNewEvaluationTool){
			new EvaluationWidget({
				data: mockData,
				elementId: 'evaluation-widget',
				filter: new DataFilters(),
				name: 'Evaluation Tool',
				targetId: 'widget-container',
				tools: ['settings']
			});
		}

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
            containment: "window",
            handle: ".floater-header",
            stop: function (ev, ui) {
                var element = $(this);
                element.css({
                    width: "",
                    height: ""
                });
            }
        });
        $(".tool-window").draggable({
            containment: "window",
            handle: ".tool-window-header",
            stop: function (ev, ui) {
                var element = $(this);
                element.css({
                    width: "",
                    height: ""
                });
            }
        });
    });
});
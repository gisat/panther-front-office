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
        'js/view/widgets/EvaluationWidget/EvaluationWidget',
        'js/util/Filter',
        'js/util/Floater',
		'./FrontOffice',
        'js/util/Logger',
        'js/util/Placeholder',
		'js/util/Remote',
		'js/stores/Stores',

        'string',
        'jquery',
        'jquery-ui',
        'underscore'
], function (Attributes,
             EvaluationWidget,
             Filter,
             Floater,
			 FrontOffice,
             Logger,
             Placeholder,
			 Remote,
			 Stores,

             S,
             $){

	new FrontOffice();

    $(document).ready(function() {

		if(window.Config.toggles.hasNewEvaluationTool){
			new EvaluationWidget({
				attributesMetadata: new Attributes(),
                filter: new Filter(),
				elementId: 'evaluation-widget',
				name: 'Evaluation Tool',
				targetId: 'widget-container'
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

        // positioning of tools container
        var container = $("#widget-container .placeholders-container");
        if (Config.toggles.allowPumaHelp){
            container.css({
                paddingLeft: "6rem"
            })
        }
    });
});
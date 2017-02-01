define(['../../../error/ArgumentError',
		'../../../error/NotFoundError',

		'../Widget',

		'jquery',
		'string',
		'text!./WorldWindWidget.html',
		'css!./WorldWindWidget'
], function(ArgumentError,
			NotFoundError,
			Widget,

			$,
			S,
			htmlBody
){
	var WorldWindWidget = function(options){
		Widget.apply(this, arguments);
	};

	WorldWindWidget.prototype = Object.create(Widget.prototype);

	WorldWindWidget.prototype.rebuild = function(attributes, options){
		console.log("aaaa");
	};

	return WorldWindWidget;
});
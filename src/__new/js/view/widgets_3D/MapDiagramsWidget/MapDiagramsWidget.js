define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../Widget3D',

	'string',
	'jquery'
], function (ArgumentError,
			 NotFoundError,
			 Logger,

			 Widget3D,

			 S,
			 $) {
	"use strict";

	/**
	 * Class representing widget for map diagrams creating
	 * @augments Widget3D
	 * @constructor
	 */
	var MapDiagramsWidget = function (options) {
		Widget3D.apply(this, arguments);
	};

	MapDiagramsWidget.prototype = Object.create(Widget3D.prototype);

	return MapDiagramsWidget;
});
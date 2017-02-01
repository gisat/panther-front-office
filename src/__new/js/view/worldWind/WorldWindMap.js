define(['../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',

		'jquery',
		'css!./WorldWindMap'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$
){
	/**
	 * Class World Wind Map
	 * @param options {Object}
	 * @constructor
	 */
	var WorldWindMap = function(options){
		this.buildContainer();
	};

	/**
	 * It builds Web World Wind container
	 */
	WorldWindMap.prototype.buildContainer = function(){
		$("#main").append('<div id="world-wind-container"></div>');
	};

	/**
	 * It returns container for rendering of Web World Wind
	 * @returns {*}
	 */
	WorldWindMap.prototype.getContainer = function(){
		return $("#world-wind-container");
	};

	return WorldWindMap;
});
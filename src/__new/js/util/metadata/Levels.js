define([],function(){

	/**
	 * Class for gathering metadata about levels and connected areas
	 * @constructor
	 */

	var Levels = function(){
		this.data = {};
	};

	/**
	 * It returns gids of all areas for all levels
	 * @returns {Object}
	 */
	Levels.prototype.getAreasForAllLevels = function(){
		return this.data;
	};

	/**
	 * It returns gids of all areas for given level
	 * @param level {string} Id of analysis level
	 * @returns {Array} Gids of areas
	 */
	Levels.prototype.getAreas = function(level){
		return this.data[level];
	};

	/**
	 * It adds new level and list of areas
	 * @param level {string} Id of analysis level
	 * @param areas {Array} Gids of areas
	 */
	Levels.prototype.addAreas = function(level, areas){
		this.data[level] = areas;
	};

	return Levels;
});
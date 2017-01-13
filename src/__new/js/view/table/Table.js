define([
	'../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'jquery',
	'css!./Table'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$
){

	/**
	 * Basic class for table
	 * @param options {Object}
	 * @param options.elementId {Object}
	 * @param options.targetId {Object}
	 * @constructor
	 */
	var Table = function(options) {
		if (!options.elementId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Table", "constructor", "missingElementId"));
		}
		if (!options.targetId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Table", "constructor", "missingTargetElementId"));
		}

		this._tableId = options.elementId;
		this._target = $("#" + options.targetId);
		if (this._target.length == 0){
			throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "Table", "constructor", "missingHTMLElement"));
		}
		this.build();
	};

	/**
	 * Build table
	 */
	Table.prototype.build = function(){
		this._target.append("<table class='new-table' id='" + this._tableId + "'></table>");
		this._table = $("#" + this._tableId);
	};

	/**
	 * Clear table content
	 */
	Table.prototype.clear = function(){
		this._table.html("");
	};

	return Table;
});

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
	 * @param options.class {string} optional table class
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

		this._class = 'new-table';
		if(options.class){
			this._class += ' ' + options.class;
		}

		this.build();
	};

	/**
	 * Build table
	 */
	Table.prototype.build = function(){
		this._target.append("<table class='"+ this._class +"' id='" + this._tableId + "'></table>");
		this._table = $("#" + this._tableId);
	};

	/**
	 * Clear table content
	 */
	Table.prototype.clear = function(){
		this._table.html("");
		this._header = false;
	};

	/**
	 * Returns table JQuery object
	 * @returns {jQuery}
	 */
	Table.prototype.getTable = function(){
		return this._table;
	};

	/**
	 * Clear table when there is no record in it
	 */
	Table.prototype.checkRecords = function(){
		var table = this.getTable();
		var recs = table.find("tr.record-row");
		var allSaved = true;

		$.each(recs, function( index, row ) {
			if (!$(row).hasClass("saved")){
				allSaved = false;
			}
		});

		// clear the table if there is no record in it
		if (recs.length == 0){
			allSaved = false;
			this.clear();
		}
	};

	return Table;
});

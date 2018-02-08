define([
	'../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'jquery',
	'underscore',
	'css!./Table'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$,
			_
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
		if (this._target.length === 0){
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
		if (recs.length === 0){
			allSaved = false;
			this.clear();
		}
	};

	/**
	 * Append content to table
	 * TODO handle if data is array
	 * @param data {Object|Array}
	 */
	Table.prototype.appendContent = function(data){
		var content = '';
		if (_.isObject(data) && !_.isArray(data)){
			content = this.renderContentFromObjectData(data)
		}
		this._table.addClass("key-value-table").append(content);
	};

	/**
	 * Render table content from object. Each property is a separate row, where key is the first column. If value is object, the row is higlighted and it's properties are rendered as next rows.
	 * @param data {Object}
	 */
	Table.prototype.renderContentFromObjectData = function(data){
		var content = "";
		var self = this;
		if (data && !_.isEmpty(data)){
			for (var key in data){
				var value = data[key];
				if (typeof value === 'object'){
					content += self.renderRow([key], true, 2);
					content += self.renderContentFromObjectData(value);
				} else {
					content += self.renderRow([key, value], false, null);
				}
			}
		}
		return content;
	};

	/**
	 * Render table row
	 * @param columns {Array} List of columns
	 * @param highlihted {boolean} true, if columns are 'th' type
	 * @param colspan {number} number of joined columns
	 * @returns {string} HTML of row
	 */
	Table.prototype.renderRow = function(columns, highlihted, colspan){
		var content = '<tr>';
		var self = this;

		columns.forEach(function(column){
			if (highlihted){
				content += self.renderHighlightedColumn(column, colspan);
			} else {
				content += self.renderColumn(column);
			}
		});
		return content += '</tr>';
	};

	/**
	 * Render table column
	 * @param value {string|number|array}
	 * @returns {string} HTML of column
	 */
	Table.prototype.renderColumn = function(value){
		if (_.isArray(value)){
			value = value.join(",");
		}
		return '<td>' + value + '</td>'
	};

	/**
	 * Render highlighted table column
	 * @param value {string|number|array}
	 * @param colspan {number} number of joined columns
	 * @returns {string} HTML of column
	 */
	Table.prototype.renderHighlightedColumn = function(value, colspan){
		var cspan = "";
		if (_.isArray(value)){
			value = value.join(",");
		}
		if (colspan){
			cspan = 'colspan="' + colspan + '"';
		}
		return '<th ' + cspan + '>' + value + '</th>'
	};

	return Table;
});

define([
	'./Table',
	'jquery',
	'css!./TableCustomAU'
], function(
			Table,
			$
){

	/**
	 * @constructor
	 */
	var TableCustomAU = function(options) {
		Table.apply(this, arguments);
		this._recordCount = 1;
	};

	TableCustomAU.prototype = Object.create(Table.prototype);

	/**
	 * Add record to the table
	 * @param id {string} id of the feature
	 */
	TableCustomAU.prototype.addRecord = function(id){
		if (!this._header){
			this._header = this.buildHeader();
		}

		var html = '<tr data-id="' + id + '">' +
				'<td>' + this._recordCount  + '</td>' +
				'<td class="record-name"><input type="text"></td>' +
				'<td class="save-record"><div class="widget-button button-save-record">Save</div></td>' +
				'<td class="delete-record"><div class="widget-button button-delete-record">Delete</div></td>' +
			'</tr>';
		this._table.append(html);
		this._recordCount++;
	};

	/**
	 * Build table header
	 * @returns {boolean}
	 */
	TableCustomAU.prototype.buildHeader = function(){
		var html = '<tr>' +
			'<th>#</th>' +
			'<th>Name</th>' +
			'<th></th>' +
			'<th></th>' +
			'</tr>';
		this._table.append(html);
		return true;
	};

	/**
	 * Delete whole row
	 * @param dataId {string} data-id attribute value
	 */
	TableCustomAU.prototype.deleteRecord = function(dataId){
		this._table.find("tr[data-id=" + dataId + "]").remove();
	};

	return TableCustomAU;
});

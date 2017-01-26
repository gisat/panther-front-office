define([
	'./Table',
	'jquery',
	'css!./TableCustomDrawing'
], function(
			Table,
			$
){

	/**
	 * @constructor
	 */
	var TableCustomDrawing = function(options) {
		Table.apply(this, arguments);
		this._recordCount = 1;
	};

	TableCustomDrawing.prototype = Object.create(Table.prototype);

	TableCustomDrawing.prototype.rebuild = function(data){
		this.clear();
		this._recordCount = 1;

		var self = this;
		data.forEach(function(record){
			self.addRecord("", record.uuid, record.name);
		});
	};

	/**
	 * Add record to the table
	 * @param olid {string} olid of the feature
	 * @param uuid {string} uuid of the feature
	 * @param name {string} name of the feature
	 */
	TableCustomDrawing.prototype.addRecord = function(olid, uuid, name){
		if (!this._header){
			this._header = this.buildHeader();
		}

		var featureName = "";
		var openLayersID = "";
		var uniqueID = "";
		var disabled = "";
		if (name){
			featureName = name;
			disabled = 'disabled="disabled"';
		}
		if (olid){
			openLayersID = olid;
		}
		if (uuid){
			uniqueID = uuid;
		}

		var html = '<tr class="record-row" data-olid="' + openLayersID + '" data-uuid="' + uniqueID + '">' +
				'<td>' + this._recordCount  + '</td>' +
				'<td class="record-name"><input type="text" value="' + featureName + '" ' + disabled + '></td>' +
				'<td class="save-record"><div class="widget-button button-save-record" ' + disabled + '>Save</div></td>' +
				'<td class="delete-record"><div class="widget-button button-delete-record">Delete</div></td>' +
			'</tr>';
		this._table.append(html);
		this._recordCount++;
	};

	/**
	 * Build table header
	 * @returns {boolean}
	 */
	TableCustomDrawing.prototype.buildHeader = function(){
		var html = '<tr class="header">' +
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
	 * @param uuid {string} uuid of the record
	 */
	TableCustomDrawing.prototype.deleteRecord = function(uuid){
		this._table.find("tr[data-uuid=" + uuid + "]").remove();
	};

	return TableCustomDrawing;
});

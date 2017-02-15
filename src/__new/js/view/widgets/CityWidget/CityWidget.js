define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/Remote',
	'../inputs/selectbox/SelectBox',
	'../Widget',

	'jquery',
	'underscore',

	'css!./CityWidget'
], function(ArgumentError,
			NotFoundError,
			Logger,
			Remote,
			SelectBox,
			Widget,

			$,
			_){

	/**
	 * Widget for Melodies project. User can select city, start and end year and send the request to the server.
	 * @param options {Object}
	 * @param options.elementId {string} Id of the widget
	 * @param options.name {string} Name of the widget
	 * @param options.targetId {string} container Id
	 * @param options.selections {Object[]} selection
	 * @constructor
	 */
	var CityWidget = function(options) {
		Widget.apply(this, arguments);
		this._selectBoxes = [];
		this.build(options);
	};

	CityWidget.prototype = Object.create(Widget.prototype);
	
	CityWidget.prototype.rebuild = function(){
		this.handleLoading("hide");
	};

	/**
	 * Build the widget content
	 * @param options
	 */
	CityWidget.prototype.build = function(options){
		var self = this;
		if(options.hasOwnProperty("selections")){
			options.selections.forEach(function(selection){
				var selectBox = self.addSelection(selection.id, selection.name, selection.options);
				self._selectBoxes.push(selectBox);
				self.addSelectionListener(selection.id);
			});
		}
		this.prepareFooter();
	};

	/**
	 * Add the selection row
	 * @param id {string} Id of the select box
	 * @param name {string} Selection label
	 * @param options {Array} Selection options
	 * @returns {SelectBox}
	 */
	CityWidget.prototype.addSelection = function(id, name, options){
		return new SelectBox({
			id: id,
			name: name,
			target: this._widgetBodySelector,
			data: options
		});
	};

	/**
	 * It builds the footer button
	 */
	CityWidget.prototype.prepareFooter = function(){
		this._widgetSelector.find(".floater-footer").append('<div class="floater-row">' +
				'<div class="widget-button" id="melodies-selection-confirm">Send</div>' +
			'</div>' +
			'<div class="floater-row table-row" id="melodies-monitoring-table">' +
				'<table>' +
				'</table>' +
			'</div>');
		this.addFooterListener();
		this.addStatusMonitoring();
	};

	/**
	 * Add the loop for status monitoring
	 */
	CityWidget.prototype.addStatusMonitoring = function(){
		var self = this;
		setInterval(function(){
			self.getProcessStatus();
		}, 2000);
	};

	/**
	 * Rebuild status table
	 * @param data {Array} Information about proceses
	 */
	CityWidget.prototype.rebuildFooterTable = function(data){
		var table = $("#melodies-monitoring-table table");
		table.html("");

		var tableBody = "";
		for (var i = data.length; i--; i >= 0){
			var content = '<tr>';
			content += '<td class="column-id">' + (i+1) + '</td>';
			content += '<td>' + data[i].name + '</td>';
			content += '<td>(' + data[i].from + '-' + data[i].to + ')</td>';
			content += '<td class="column-status ' + data[i].status.toLowerCase() + '">' + data[i].status + '</td>';
			content += '</tr>';
			tableBody += content;
		}
		table.append(tableBody);
	};

	/**
	 * Add listener to select button. It makes the confirm button active each time user clicks on the button.
	 * @param selectBox {string} Id of select box
	 */
	CityWidget.prototype.addSelectionListener = function(selectBox){
		$('#' + selectBox + '-button').on("click",function(){
			$('#melodies-selection-confirm').html("Send").attr("disabled", false).removeClass("failed");
		});
	};

	/**
	 * Add listener to confirm button. It sends the request on click.
	 */
	CityWidget.prototype.addFooterListener = function(){
		var self = this;
		$('#melodies-selection-confirm').on("click",function(){
			self.sendData();
		});
	};

	/**
	 * Get status of all proceses
	 * @returns {*|Promise}
	 */
	CityWidget.prototype.getProcessStatus = function(){
		var self = this;
		return new Remote({
			method: "GET",
			url: window.Config.url + "wps/mellodies/status"
		}).then(function(response){
			var data = JSON.parse(response);
			self.rebuildFooterTable(data);
		});
	};

	/**
	 * Post the request containing currently selected parameters
	 * @returns {*|Promise}
	 */
	CityWidget.prototype.sendData = function(){
		return new Remote({
			method: "POST",
			url: window.Config.url + "wps/mellodies/run",
			params: {
				name: this._selectBoxes[0].getValue(),
				from: this._selectBoxes[1].getValue(),
				to: this._selectBoxes[2].getValue()
			}
		}).then(function(response){
			var data = JSON.parse(response);
			if (data.status == "Ok"){
				$('#melodies-selection-confirm').html("Request has been sent...").attr("disabled", true);
			}
			else {
				$('#melodies-selection-confirm').html("Failed to send request!").attr("disabled", true).addClass("failed");
			}
		});
	};

	return CityWidget;
});
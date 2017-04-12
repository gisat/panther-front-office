define([
	'jquery'
], function (
	$
) {
	"use strict";

	var CustomLayers = function() {
		this._target = $('#custom-layers');
		this._target.on('click.customLayers', '.ptr-btn', this.handleClick.bind(this));
		this.build();
	};


	CustomLayers.prototype.build = function(){

		this._target.empty();

		this._target.append(
			'<div id="custom-layers-container">' +
				'<div class="custom-layers-content" id="custom-layers-start">' +
					'<div>' +
						'<div class="ptr-btn primary" id="custom-layers-file-btn">Load from file…</div>' +
						'<div class="ptr-btn primary" id="custom-layers-wms-btn">Connect to WMS…</div>' +
					'</div>' +
				'</div>' +
				'<div class="custom-layers-content" id="custom-layers-action">' +
				'</div>' +
			'</div>'
		);

		this._container = this._target.find('#custom-layers-container');

	};

	CustomLayers.prototype.handleClick = function(e) {
		// todo button & modifiers check
		var targetId = e.target.getAttribute('id');
		switch (targetId) {
			case 'custom-layers-file-btn':
				this.buildFileForm();
				this.view('action');
				break;
			case 'custom-layers-file-cancel-btn':
				this.clearAction();
				this.view();
				break;
			case 'custom-layers-file-load-btn':
				this.loadFile();
				break;
			case 'custom-layers-wms-btn':
				this.buildWMSForm();
				this.view('action');
				break;
			case 'custom-layers-wms-cancel-btn':
				this.clearAction();
				this.view();
				break;
			case 'custom-layers-wms-add-btn':
				this.addWMS();
				break;
			default:
				console.log('CustomLayers#handleClick' + targetId);
		}
	};

	CustomLayers.prototype.clearAction = function() {
		this._target.find('#custom-layers-action').empty();
		this._action = null;
	};

	CustomLayers.prototype.buildFileForm = function() {
		if (this._action != 'file') {
			this.clearAction();
			this._action = 'file';
			var target = this._target.find('#custom-layers-action');
			target.append(
				'<label class="container">' +
					'File' +
					'<input type="file" id="custom-layers-file-file" />' +
				'</label>' +
				'<label class="container">' +
					'Layer name' +
					'<input type="text" id="custom-layers-file-name" />' +
				'</label>' +
				'<div class="ptr-btn-group">' +
					'<div class="ptr-btn primary" id="custom-layers-file-load-btn">Load</div>' +
					'<div class="ptr-btn" id="custom-layers-file-cancel-btn">Cancel</div>' +
				'</div>'
			);
		}
	};

	CustomLayers.prototype.buildWMSForm = function() {
		if (this._action != 'wms') {
			this.clearAction();
			this._action = 'wms';
			var target = this._target.find('#custom-layers-action');
			target.append(
				'<label class="container">' +
					'WMS address' +
					'<input type="text" id="custom-layers-wms-address" value="http://services.sentinel-hub.com/v1/wms/56748ba2-4a88-4854-beea-86f9afc63e35" />' + // TODO remove value
				'</label>' +
				'<label class="container">' +
					'WMS layer' +
					'<input type="text" id="custom-layers-wms-layer" value="TRUE_COLOR_ENHANCED" />' + // TODO remove value
				'</label>' +
				'<label class="container">' +
					'Layer name' +
					'<input type="text" id="custom-layers-wms-name" value="Sentinel" />' + // TODO remove value
				'</label>' +
				'<div class="ptr-btn-group">' +
					'<div class="ptr-btn primary" id="custom-layers-wms-add-btn">Add</div>' +
					'<div class="ptr-btn" id="custom-layers-wms-cancel-btn">Cancel</div>' +
				'</div>'
			);
		}
	};

	CustomLayers.prototype.view = function(view) {
		this._container.removeClass('view-action');
		if (view) this._container.addClass('view-' + view);
	};



	CustomLayers.prototype.loadFile = function() {
		var fileInput = this._container.find('#custom-layers-file-file')[0];
		var file = fileInput.files[0];
		var name = this._container.find('#custom-layers-file-name')[0].value;
		var url = Config.url + 'rest/layerImporter/import';
		//var url = 'http://192.168.2.112/backend/' + 'rest/layerImporter/import';
		var payload = new FormData();
		payload.append('file', file);
		payload.append('scope', ThemeYearConfParams.dataset);
		payload.append('theme', ThemeYearConfParams.theme);
		payload.append('name', name);
		var self = this;
		$.post({
			url: url,
			data: payload,
			processData: false,
			contentType: false
		})
			.done(function(data){
				console.log(data);
				self.checkStatus(data.id);
			});

	};


	CustomLayers.prototype.addWMS = function() {
		var wmsAddress = this._container.find('#custom-layers-wms-address')[0].value;
		var wmsLayer = this._container.find('#custom-layers-wms-layer')[0].value;
		var name = this._container.find('#custom-layers-wms-name')[0].value;
		var url = Config.url + 'rest/wms/layer';

		var payload = {
			'url': wmsAddress,
			'layer': wmsLayer,
			'scope': ThemeYearConfParams.dataset,
			'periods': null, // TODO where to get all Periods?
			'places': ThemeYearConfParams.allPlaces,
			'name': name
		};

		var self = this;
		$.post({
			url: url,
			data: JSON.stringify(payload),
			processData: false,
			contentType: "application/json"
		})
			.done(function(data){
				console.log(data);
				self.addWMSToLayers(data.id);
			});
	};


	CustomLayers.prototype.checkStatus = function(operationId) {
		var url = Config.url + 'rest/layerImporter/status/' + operationId;
		//var url = 'http://192.168.2.112/backend/' + 'rest/layerImporter/status/' + operationId;
		var self = this;
		$.get(url).done(function(data) {
			console.log('SATATUS', data);
			if (data.status == 'done') {
				console.log('WHEEEEEEEEE');
			} else if (data.status == 'error') {
				console.log('BUUUUUUUU');
			} else {
				setTimeout(self.checkStatus.bind(self, operationId), 4000);
			}
		});
	};



	CustomLayers.prototype.addWMSToLayers = function(operationId) {
		console.log("******");

		// TODO add to layer tree
	};




	return CustomLayers;
});


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
		this._actionContainer = this._container.find('#custom-layers-action');

	};

	CustomLayers.prototype.handleClick = function(e) {
		// todo button & modifiers check
		var targetId = e.target.getAttribute('id');
		switch (targetId) {
			case 'custom-layers-file-btn':
				this.buildFileForm();
				this.view('action');
				break;
			case 'custom-layers-wms-btn':
				this.buildWMSForm();
				this.view('action');
				break;
			case 'custom-layers-action-back-btn':
			case 'custom-layers-file-cancel-btn':
			case 'custom-layers-wms-cancel-btn':
				this.clearAction();
				this.view();
				break;
			case 'custom-layers-file-load-btn':
				this.loadFile();
				break;
			case 'custom-layers-wms-add-btn':
				this.addWMS();
				break;
			default:
				console.log('CustomLayers#handleClick' + targetId);
		}
	};

	CustomLayers.prototype.clearAction = function() {
		this._action = null;
		this._actionContainer.empty();
	};

	CustomLayers.prototype.buildFileForm = function() {
		if (this._action != 'file') {
			this.clearAction();
			this._action = 'file';
			this._actionContainer.append(
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
			this._actionContainer.append(
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
		this.buildFileImport();
		$.post({
			url: url,
			data: payload,
			processData: false,
			contentType: false
		})
			.done(function(data){
				self.checkStatus(data.id);
			})
			.fail(function(data){

			});

	};

	CustomLayers.prototype.buildFileImport = function() {
		this._actionContainer.empty();
		this._actionContainer.append(
			'<div class="custom-layers-status"></div>' +
			'<div class="custom-layers-progress"><div></div></div>' +
			'<div class="custom-layers-status-message"></div>' +
			'<div class="custom-layers-file-post-import"></div>' +
			'<div class="ptr-btn-group"></div>'
		);
	};


	CustomLayers.prototype.checkStatus = function(operationId) {
		var url = Config.url + 'rest/layerImporter/status/' + operationId;
		//var url = 'http://192.168.2.112/backend/' + 'rest/layerImporter/status/' + operationId;
		var self = this;
		$.get(url).done(function(data) {
			if (data.status == 'done') {
				self.updateFileStatus(data);
			} else if (data.status == 'error') {
				self.updateFileStatus(data);
			} else {
				self.updateFileStatus(data);
				setTimeout(self.checkStatus.bind(self, operationId), 4000);
			}
		});
	};

	CustomLayers.prototype.updateFileStatus = function(result) {
		var statusEl = this._actionContainer.find('.custom-layers-status').first();
		var statusMessageEl = this._actionContainer.find('.custom-layers-status-message').first();
		var progressEl = this._actionContainer.find('.custom-layers-progress').first().find('div').first();
		var btnGroupEl = this._actionContainer.find('.ptr-btn-group').first();
		if (result.status == 'done') {
			//var postInfoEl = this._actionContainer.find('.custom-layers-file-post-import').first();
			statusEl.html('Layer imported succesfully.');
			statusEl.addClass('success');
			progressEl.css('width','100%');
			//btnGroupEl.empty();
			btnGroupEl.append(
				'<div class="ptr-btn" id="custom-layers-action-back-btn">Back</div>'
			);
		} else if (result.status == 'error') {
			statusEl.html('Import failed');
			statusEl.addClass('error');
			statusMessageEl.html('Error: ' + result.message);
			progressEl.css('background-color', '#f00');
			//btnGroupEl.empty();
			btnGroupEl.append(
				'<div class="ptr-btn" id="custom-layers-action-back-btn">Back</div>'
			);
		} else {
			var progress = (result.progress || 0) + "%";
			statusEl.html('Importing…');
			progressEl.css('width', progress);

		}
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
			'periods': ThemeYearConfParams.allYears,
			'places': ThemeYearConfParams.allPlaces,
			'name': name
		};

		var addButton = this._container.find('#custom-layers-wms-add-btn')[0];
		addButton.classList.add('disabled');
		addButton.innerHTML = 'Adding...';

		var cancelButton = this._container.find('#custom-layers-wms-cancel-btn')[0];
		cancelButton.classList.add('disabled');


		var self = this;
		$.post({
				url: url,
				data: JSON.stringify(payload),
				processData: false,
				contentType: "application/json"
			})
			.fail(function(xhr, message){
				console.error("Add WMS failed: ", message);
				addButton.innerHTML = "Add";
				addButton.classList.remove('disabled');
				cancelButton.classList.remove('disabled');
				alert("Adding WMS layer failed.\n" + message);
			})
			.done(function(){
				self.addWMSToLayers();
				self.clearAction();
				self.view();
			});

	};



	CustomLayers.prototype.addWMSToLayers = function() {

		// reload WMS layers from
		Observer.notify('PumaMain.controller.LocationTheme.reloadWmsLayers');


		// TODO add to selected layers?
		var selectedLayersStore = Ext.StoreMgr.lookup('selectedlayers');
	};




	return CustomLayers;
});


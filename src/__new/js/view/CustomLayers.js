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
						'<div class="ptr-btn disabled" id="custom-layers-wms-btn">Connect to WMS…</div>' +
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
			case 'custom-layers-action-back-btn':
			case 'custom-layers-file-cancel-btn':
				this.clearAction();
				this.view();
				break;
			case 'custom-layers-file-load-btn':
				this.loadFile();
				break;
			default:
				console.log('CustomLayers#handleClick' + targetId);
		}
	};

	CustomLayers.prototype.clearAction = function() {
		this._actionContainer.empty();
		this._action = null;
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

	CustomLayers.prototype.checkStatus = function(operationId) {
		var url = Config.url + 'rest/layerImporter/status/' + operationId;
		//var url = 'http://192.168.2.112/backend/' + 'rest/layerImporter/status/' + operationId;
		var self = this;
		$.get(url).done(function(data) {
			if (data.status == 'done') {
				self.buildFileResult(data);
			} else if (data.status == 'error') {
				self.buildFileResult(data);
			} else {
				self.buildFileStatus(data);
				setTimeout(self.checkStatus.bind(self, operationId), 4000);
			}
		});
	};

	CustomLayers.prototype.buildFileStatus = function(result) {
		this._actionContainer.empty();
		this._actionContainer.append(
			'<div class="custom-layers-status">Importing…</div>' +
			'<div class="custom-layers-progress"><div style="width:' + result.progress || 0 + '%"></div></div> '
		);
	};

	CustomLayers.prototype.buildFileResult = function(result) {
		this._actionContainer.empty();
		if (result.status == 'done') {
			this._actionContainer.append(
				'<div class="custom-layers-status">Layer imported succesfully.</div>' +
				'<div class="custom-layers-file-post-import"></div> ' +
				'<div class="ptr-btn" id="custom-layers-action-back-btn">Back</div>'
			);
		}
	};




	return CustomLayers;
});


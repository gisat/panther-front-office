define([
	'../Widget',
	'jquery',

	'css!./IntegrateCustomLayersWidget'
], function(Widget,

			$){

	/**
	 * Class representing a widget for integration of custom layers in the solution.
	 * @augments Widget
	 * @param options {Object}
	 * @param options.target {jQuery} Jquery object containing this piece.
	 * @constructor
	 */
	var IntegrateCustomLayersWidget = function(options){
		Widget.call(this, options);

		this._target = $('#floater-custom-integration-layers .floater-body');
		this._target.on('click.customLayers', '.ptr-btn', this.handleClick.bind(this));
		this.rebuild();
	};

	IntegrateCustomLayersWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Rebuild all tools in widget
	 */
	IntegrateCustomLayersWidget.prototype.rebuild = function(){
		this.handleLoading("show");

		this._target.empty();

		this._target.append(
			'<div id="custom-layers-container">' +
			'<div class="custom-layers-content" id="custom-layers-start">' +
			'<div>' +
			'<div class="ptr-btn primary" id="custom-layers-file-btn">'+polyglot.t('loadFromFile')+'</div>' +
			'<div class="ptr-btn primary" id="custom-layers-wms-btn">'+polyglot.t('connectToWms')+'</div>' +
			'</div>' +
			'</div>' +
			'<div class="custom-layers-content" id="custom-layers-action">' +
			'</div>' +
			'</div>'
		);

		this._container = this._target.find('#custom-layers-container');
		this._actionContainer = this._container.find('#custom-layers-action');

		this.handleLoading("hide");
	};

	IntegrateCustomLayersWidget.prototype.handleClick = function(e) {
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
				this.loadFile('rest/layerImporter/import');
				break;
			case 'custom-layers-file-load-without-statistics-btn':
				this.loadFile('rest/layerImporter/importNoStatistics');
				break;
			case 'custom-layers-wms-add-btn':
				this.addWMS();
				break;
			default:
				console.log('CustomLayers#handleClick' + targetId);
		}
	};

	IntegrateCustomLayersWidget.prototype.clearAction = function() {
		this._action = null;
		this._actionContainer.empty();
	};

	IntegrateCustomLayersWidget.prototype.buildFileForm = function() {
		if (this._action != 'file') {
			this.clearAction();
			this._action = 'file';
			this._actionContainer.append(
				'<label class="container">' +
				polyglot.t('file') +
				'<input type="file" id="custom-layers-file-file" />' +
				'</label>' +
				'<label class="container">' +
				polyglot.t('layerName') +
				'<input type="text" id="custom-layers-file-name" />' +
				'</label>' +
				'<div class="ptr-btn-group">' +
				'<div class="ptr-btn primary" id="custom-layers-file-load-btn">'+polyglot.t('load')+'</div>' +
				'<div class="ptr-btn primary" id="custom-layers-file-load-without-statistics-btn">'+polyglot.t('loadWithoutStatistics')+'</div>' +
				'<div class="ptr-btn" id="custom-layers-file-cancel-btn">'+polyglot.t('cancel')+'</div>' +
				'</div>'
			);
		}
	};

	IntegrateCustomLayersWidget.prototype.buildWMSForm = function() {
		if (this._action != 'wms') {
			this.clearAction();
			this._action = 'wms';
			this._actionContainer.append(
				'<label class="container">' +
				polyglot.t('wmsAddress') +
				'<input type="text" id="custom-layers-wms-address" />' +
				'</label>' +
				'<label class="container">' +
				polyglot.t('wmsLayer') +
				'<input type="text" id="custom-layers-wms-layer" />' +
				'</label>' +
				'<label class="container">' +
				polyglot.t('layerName') +
				'<input type="text" id="custom-layers-wms-name" />' +
				'</label>' +
				'<div class="ptr-btn-group">' +
				'<div class="ptr-btn primary" id="custom-layers-wms-add-btn">'+polyglot.t('add')+'</div>' +
				'<div class="ptr-btn" id="custom-layers-wms-cancel-btn">'+polyglot.t('cancel')+'</div>' +
				'</div>' +
				'<div class="custom-layers-status"></div>'
			);
		}
	};

	IntegrateCustomLayersWidget.prototype.view = function(view) {
		this._container.removeClass('view-action');
		if (view) this._container.addClass('view-' + view);
	};



	IntegrateCustomLayersWidget.prototype.loadFile = function(relativeUrl) {
		var fileInput = this._container.find('#custom-layers-file-file')[0];
		var file = fileInput.files[0];
		var name = this._container.find('#custom-layers-file-name')[0].value;
		var url = Config.url + relativeUrl;
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

	IntegrateCustomLayersWidget.prototype.buildFileImport = function() {
		this._actionContainer.empty();
		this._actionContainer.append(
			'<div class="custom-layers-status"></div>' +
			'<div class="custom-layers-progress"><div></div></div>' +
			'<div class="custom-layers-status-message"></div>' +
			'<div class="custom-layers-file-post-import"></div>' +
			'<div class="ptr-btn-group"></div>'
		);
	};


	IntegrateCustomLayersWidget.prototype.checkStatus = function(operationId) {
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

	IntegrateCustomLayersWidget.prototype.updateFileStatus = function(result) {
		var statusEl = this._actionContainer.find('.custom-layers-status').first();
		var statusMessageEl = this._actionContainer.find('.custom-layers-status-message').first();
		var progressEl = this._actionContainer.find('.custom-layers-progress').first().find('div').first();
		var btnGroupEl = this._actionContainer.find('.ptr-btn-group').first();
		if (result.status == 'done') {
			//var postInfoEl = this._actionContainer.find('.custom-layers-file-post-import').first();
			statusEl.html(polyglot.t('layerImportedSuccessfully'));
			statusEl.addClass('success');
			progressEl.css('width','100%');
			//btnGroupEl.empty();
			btnGroupEl.append(
				'<div class="ptr-btn" id="custom-layers-action-back-btn">'+polyglot.t('back')+'</div>'
			);
		} else if (result.status == 'error') {
			statusEl.html(polyglot.t('importFailed'));
			statusEl.addClass('error');
			statusMessageEl.html(polyglot.t('Error') + ': ' + result.message);
			progressEl.css('background-color', '#f00');
			//btnGroupEl.empty();
			btnGroupEl.append(
				'<div class="ptr-btn" id="custom-layers-action-back-btn">'+polyglot.t('back')+'</div>'
			);
		} else {
			var progress = (result.progress || 0) + "%";
			statusEl.html(polyglot.t('importing'));
			progressEl.css('width', progress);

		}
	};


	IntegrateCustomLayersWidget.prototype.addWMS = function() {
		var wmsAddress = this._container.find('#custom-layers-wms-address')[0].value;
		var wmsLayer = this._container.find('#custom-layers-wms-layer')[0].value;
		var name = this._container.find('#custom-layers-wms-name')[0].value;

		var addButton = this._container.find('#custom-layers-wms-add-btn')[0];
		addButton.classList.add('disabled');
		addButton.innerHTML = polyglot.t('adding');

		var cancelButton = this._container.find('#custom-layers-wms-cancel-btn')[0];
		cancelButton.classList.add('disabled');

		var statusEl = this._container.find('.custom-layers-status')[0];
		statusEl.classList.remove('error');
		statusEl.innerHTML = '';

		// form validation
		var errors = [];
		const urlRegex = /^((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*/gmi;
		var matches = urlRegex.exec(wmsAddress);
		if(matches === null){
			errors.push(polyglot.t("wmsAddressIsMissing"));
		}
		if(!wmsLayer){
			errors.push(polyglot.t('wmsLayerIsMissing'));
		}
		if(!name){
			errors.push(polyglot.t('layerNameIsMissing'));
		}

		if(errors.length){
			statusEl.classList.add('error');
			statusEl.innerHTML = errors.join('<br>');
			addButton.innerHTML = polyglot.t("add");
			addButton.classList.remove('disabled');
			cancelButton.classList.remove('disabled');
			return;
		}

		// make request
		var url = Config.url + 'rest/wms/layer';
		var payload = {
			'url': wmsAddress,
			'layer': wmsLayer,
			'scope': ThemeYearConfParams.dataset,
			'periods': ThemeYearConfParams.allYears,
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
			.fail(function(xhr, message){
				console.error("Add WMS failed: ", message);
				statusEl.classList.add('error');
				statusEl.innerHTML = polyglot.t("addingWmsLayerFailed") + message;
			})
			.done(function(){
				self.addWMSToLayers();
				statusEl.classList.remove('error');
				statusEl.innerHTML = polyglot.t('layerSuccessfullyAdded');
			})
			.always(function(){
				addButton.innerHTML = polyglot.t("add");
				addButton.classList.remove('disabled');
				cancelButton.classList.remove('disabled');
			});

	};

	IntegrateCustomLayersWidget.prototype.addWMSToLayers = function() {
		// reload WMS layers from
		Observer.notify('PumaMain.controller.LocationTheme.reloadWmsLayers');

	};

	return IntegrateCustomLayersWidget;
});
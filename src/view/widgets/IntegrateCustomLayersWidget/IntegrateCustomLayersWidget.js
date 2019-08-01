import Widget from '../Widget';

import './IntegrateCustomLayersWidget.css';

/**
 * Class representing a widget for integration of custom layers in the solution.
 * @augments Widget
 * @param options {Object}
 * @param options.target {jQuery} Jquery object containing this piece.
 * @constructor
 */
let $ = window.$;
let polyglot, Config, ThemeYearConfParams, Observer;
class IntegrateCustomLayersWidget extends Widget {
    constructor(options) {
        super(options);

        polyglot = window.polyglot;
        Config = window.Config;
        ThemeYearConfParams = window.Config;
        Observer = window.Observer;

        this._target = $('#floater-custom-integration-layers .floater-body');
        this._target.on('click.customLayers', '.ptr-btn', this.handleClick.bind(this));
        this.rebuild();
    };

    /**
     * Rebuild all tools in widget
     */
    rebuild() {
        this.handleLoading("show");

        this._target.empty();

        this._target.append(
            '<div id="custom-layers-container">' +
            '<div class="custom-layers-content" id="custom-layers-start">' +
            '<div>' +
            '<div class="ptr-btn primary" id="custom-layers-file-btn">' + polyglot.t('loadFromFile') + '</div>' +
            '<div class="ptr-btn primary" id="custom-layers-wms-btn">' + polyglot.t('connectToWms') + '</div>' +
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

    handleClick(e) {
        // todo button & modifiers check
        let targetId = e.target.getAttribute('id');
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

    clearAction () {
        this._action = null;
        this._actionContainer.empty();
    };

    buildFileForm () {
        if (this._action !== 'file') {
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
                '<div class="ptr-btn primary" id="custom-layers-file-load-btn">' + polyglot.t('load') + '</div>' +
                '<div class="ptr-btn primary" id="custom-layers-file-load-without-statistics-btn">' + polyglot.t('loadWithoutStatistics') + '</div>' +
                '<div class="ptr-btn" id="custom-layers-file-cancel-btn">' + polyglot.t('cancel') + '</div>' +
                '</div>'
            );
        }
    };

    buildWMSForm () {
        if (this._action !== 'wms') {
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
                '<div class="ptr-btn primary" id="custom-layers-wms-add-btn">' + polyglot.t('add') + '</div>' +
                '<div class="ptr-btn" id="custom-layers-wms-cancel-btn">' + polyglot.t('cancel') + '</div>' +
                '</div>' +
                '<div class="custom-layers-status"></div>'
            );
        }
    };

    view (view) {
        this._container.removeClass('view-action');
        if (view) this._container.addClass('view-' + view);
    };


    loadFile (relativeUrl) {
        let fileInput = this._container.find('#custom-layers-file-file')[0];
        let file = fileInput.files[0];
        let name = this._container.find('#custom-layers-file-name')[0].value;
        let url = Config.url + relativeUrl;
        //let url = 'http://192.168.2.112/backend/' + 'rest/layerImporter/import';
        let payload = new FormData();
        payload.append('file', file);
        payload.append('scope', ThemeYearConfParams.dataset);
        payload.append('theme', ThemeYearConfParams.theme);
        payload.append('name', name);
        let self = this;
        this.buildFileImport();
        $.post({
            url: url,
            data: payload,
            processData: false,
            contentType: false
        })
            .done(function (data) {
                self.checkStatus(data.id);
            })
            .fail(function (data) {

            });

    };

    buildFileImport () {
        this._actionContainer.empty();
        this._actionContainer.append(
            '<div class="custom-layers-status"></div>' +
            '<div class="custom-layers-progress"><div></div></div>' +
            '<div class="custom-layers-status-message"></div>' +
            '<div class="custom-layers-file-post-import"></div>' +
            '<div class="ptr-btn-group"></div>'
        );
    };


    checkStatus(operationId) {
        let url = Config.url + 'rest/layerImporter/status/' + operationId;
        //let url = 'http://192.168.2.112/backend/' + 'rest/layerImporter/status/' + operationId;
        let self = this;
        $.get(url).done(function (data) {
            if (data.status === 'done') {
                self.updateFileStatus(data);
            } else if (data.status === 'error') {
                self.updateFileStatus(data);
            } else {
                self.updateFileStatus(data);
                setTimeout(self.checkStatus.bind(self, operationId), 4000);
            }
        });
    };

    updateFileStatus (result) {
        let statusEl = this._actionContainer.find('.custom-layers-status').first();
        let statusMessageEl = this._actionContainer.find('.custom-layers-status-message').first();
        let progressEl = this._actionContainer.find('.custom-layers-progress').first().find('div').first();
        let btnGroupEl = this._actionContainer.find('.ptr-btn-group').first();
        if (result.status === 'done') {
            //let postInfoEl = this._actionContainer.find('.custom-layers-file-post-import').first();
            statusEl.html(polyglot.t('layerImportedSuccessfully'));
            statusEl.addClass('success');
            progressEl.css('width', '100%');
            //btnGroupEl.empty();
            btnGroupEl.append(
                '<div class="ptr-btn" id="custom-layers-action-back-btn">' + polyglot.t('back') + '</div>'
            );
        } else if (result.status === 'error') {
            statusEl.html(polyglot.t('importFailed'));
            statusEl.addClass('error');
            statusMessageEl.html(polyglot.t('Error') + ': ' + result.message);
            progressEl.css('background-color', '#f00');
            //btnGroupEl.empty();
            btnGroupEl.append(
                '<div class="ptr-btn" id="custom-layers-action-back-btn">' + polyglot.t('back') + '</div>'
            );
        } else {
            let progress = (result.progress || 0) + "%";
            statusEl.html(polyglot.t('importing'));
            progressEl.css('width', progress);

        }
    };


    addWMS () {
        let wmsAddress = this._container.find('#custom-layers-wms-address')[0].value;
        let wmsLayer = this._container.find('#custom-layers-wms-layer')[0].value;
        let name = this._container.find('#custom-layers-wms-name')[0].value;

        let addButton = this._container.find('#custom-layers-wms-add-btn')[0];
        addButton.classList.add('disabled');
        addButton.innerHTML = polyglot.t('adding');

        let cancelButton = this._container.find('#custom-layers-wms-cancel-btn')[0];
        cancelButton.classList.add('disabled');

        let statusEl = this._container.find('.custom-layers-status')[0];
        statusEl.classList.remove('error');
        statusEl.innerHTML = '';

        // form validation
        let errors = [];
        const urlRegex = /^((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*/gmi;
        let matches = urlRegex.exec(wmsAddress);
        if (matches === null) {
            errors.push(polyglot.t("wmsAddressIsMissing"));
        }
        if (!wmsLayer) {
            errors.push(polyglot.t('wmsLayerIsMissing'));
        }
        if (!name) {
            errors.push(polyglot.t('layerNameIsMissing'));
        }

        if (errors.length) {
            statusEl.classList.add('error');
            statusEl.innerHTML = errors.join('<br>');
            addButton.innerHTML = polyglot.t("add");
            addButton.classList.remove('disabled');
            cancelButton.classList.remove('disabled');
            return;
        }

        // make request
        let url = Config.url + 'rest/wms/layer';
        let payload = {
            'url': wmsAddress,
            'layer': wmsLayer,
            'scope': ThemeYearConfParams.dataset,
            'periods': ThemeYearConfParams.allYears,
            'places': ThemeYearConfParams.allPlaces,
            'name': name
        };
        let self = this;
        $.post({
            url: url,
            data: JSON.stringify(payload),
            processData: false,
            contentType: "application/json"
        })
            .fail(function (xhr, message) {
                console.error("Add WMS failed: ", message);
                statusEl.classList.add('error');
                statusEl.innerHTML = polyglot.t("addingWmsLayerFailed") + message;
            })
            .done(function () {
                self.addWMSToLayers();
                statusEl.classList.remove('error');
                statusEl.innerHTML = polyglot.t('layerSuccessfullyAdded');
            })
            .always(function () {
                addButton.innerHTML = polyglot.t("add");
                addButton.classList.remove('disabled');
                cancelButton.classList.remove('disabled');
            });

    };

    addWMSToLayers () {
        // reload WMS layers from
        Observer.notify('PumaMain.controller.LocationTheme.reloadWmsLayers');

    };
}

export default IntegrateCustomLayersWidget;
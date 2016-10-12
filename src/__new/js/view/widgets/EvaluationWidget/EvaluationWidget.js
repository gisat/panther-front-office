define([
    '../../../error/ArgumentError',
    '../../../error/NotFoundError',
    '../inputs/checkbox/Checkbox',
    '../../../util/Logger',
    '../../map/Map',
    '../../../util/MapExport',
	'../../../util/Remote',
    '../inputs/selectbox/SelectBox',
    '../widgetTools/settings/Settings',
    '../inputs/sliderbox/SliderBox',
	'../../../stores/Stores',
    '../Widget',

    'jquery',
    'string',
    'underscore',

    'text!./EvaluationWidgetFooter.html',
    'css!./EvaluationWidget'
], function(ArgumentError,
            NotFoundError,
            Checkbox,
            Logger,
            Map,
            MapExport,
			Remote,
            SelectBox,
            Settings,
            SliderBox,
			Stores,
            Widget,

            $,
            S,
            _,
            htmlFooterContent){

    /**
     * It creates an Evaluation Tool
     * @param options {Object}
     * @param options.attributesMetadata {Object} instance of class for collecting of attributes metadata
     * @param options.elementId {String} ID of widget
     * @param options.filter {Object} instance of class for data filtering
     * @param options.targetId {String} ID of an element in which should be the widget rendered
     * @param options.name {String} Name of the widget
     * @param options.tools {Array} List of tools which should be connected with this widget
     * @constructor
     */
    var EvaluationWidget = function(options) {
        Widget.apply(this, arguments);

        if (!options.elementId){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "EvaluationWidget", "constructor", "missingElementId"));
        }
        if (!options.targetId){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "EvaluationWidget", "constructor", "missingTargetElementId"));
        }

        this._name = options.name || "";
        this._widgetId = options.elementId;
        this._target = $("#" + options.targetId);
        if (this._target.length == 0){
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "EvaluationWidget", "constructor", "missingHTMLElement"));
        }

        // Call the method from parent
        Widget.prototype.build.call(this, this._widgetId, this._target, this._name);

        this._widgetSelector = $("#floater-" + this._widgetId);
        this._placeholderSelector = $("#placeholder-" + this._widgetId);
        this._widgetBodySelector = this._widgetSelector.find(".floater-body");

        if (Config.toggles.hasOwnProperty("isUrbis") && Config.toggles.isUrbis){
            this._widgetSelector.addClass("open");
            this._widgetSelector.css("display","block"); // redundant, but necessary for animation
            this._placeholderSelector.removeClass("open");
        }

        this._attributesMetadata = options.attributesMetadata;
        this._filter = options.filter;
        this._settings = null;

        this.build();
        Observer.addListener("rebuild", this.rebuild.bind(this));
    };

    EvaluationWidget.prototype = Object.create(Widget.prototype);

	/**
     * It rebuilds the widget for given attributes. First, it collects attributes metadata. Secondly, it rebuilds the view of the widget and settings window
     */
    EvaluationWidget.prototype.rebuild = function(){
        var self = this;
        this._widgetSelector.find(".floater-overlay").css("display","block");
        this._attributesMetadata.getData().then(function(result){
            self._attributes = [];
            var attrForRequest = [];

            result.forEach(function(attrSet){
                attrSet.forEach(function(attribute){
                    attrForRequest.push(attribute);
                });
            });

            self._attributesMetadata.filterAttribute(attrForRequest).then(function(attributes){
                if (attributes.length > 0){
                    attributes.forEach(function(attribute){
                        var about = {
                            attribute: attribute.attribute,
                            attributeName: attribute.attributeName,
                            attributeType: attribute.type,
                            attributeSet: attribute.attributeSet,
                            attributeSetName: attribute.attributeSetName,
                            units: attribute.units
                        };

                        if (about.attributeType == "numeric"){
                            self._attributes.push({
                                values: [Number(attribute.min), Number(attribute.max)],
                                distribution: attribute.distribution,
                                about: about
                            });
                        }
                        else if (about.attributeType == "boolean") {
                            self._attributes.push({
                                about: about
                            });
                        }
                        else if (about.attributeType == "text"){
                            self._attributes.push({
                                about: about,
                                values: attribute.values
                            });
                        }
                    });
                }
                if (self._attributes.length){
                    self.prepareFooter();
                    self.rebuildViewAndSettings();
                }
                else {
                    self.noDataEcho();
                }
            });
        });
        this.rebuildMap();
        ThemeYearConfParams.datasetChanged = false;
    };

    /**
     * Build the widget basic view of the widget
     */
    EvaluationWidget.prototype.build = function(){
        this.buildSettings();
    };

	/**
     * Notify the user, if no attribute sets are linked to analytical units
     */
    EvaluationWidget.prototype.noDataEcho = function(){
        var info = '<p>There are no linked attribute sets to analytical units probably! Please, go to the BackOffice and link the data properly.</p>';
        this._widgetBodySelector.html("").append(info);
        this._widgetSelector.find(".floater-overlay").css("display","none");
    };

	/**
     * Create settings icon and attach the listener for opening
     */
    EvaluationWidget.prototype.buildSettings = function(){
        var tool = "settings";
        var name = "Settings";
        this._widgetSelector.find(".floater-tools-container").append('<div title="'+ name +'" class="floater-tool widget-'+ tool +'">' +
            '<img alt="' + name + '" src="__new/img/'+ tool +'.png"/>' +
            '</div>');
        this.addSettingsListener();
    };

    EvaluationWidget.prototype.rebuildMap = function(){
        if (!this._map){
            this._map = new Map({
                map: OneLevelAreas.map
            });
        }
        else {
            this._map.removeLayers();
        }
    };

	/**
     * Rebuild settings with given attributes, get all categories (one category per attribute) and rebuild the inputs (one input per attribute - slider, checkbox or select menu).
     */
    EvaluationWidget.prototype.rebuildViewAndSettings = function(){
        this._settings = new Settings({
            attributes: this._attributes,
            target: this._target,
            widgetId: this._widgetId
        });
        this._categories = this._settings.getCategories();
        this.rebuildInputs(this._categories);
        this.disableExports();

        this._settingsConfirm = this._settings.getConfirmButton();
        this.addSettingsChangeListener(this._settingsConfirm);
    };


	/**
     * It prepares all the inputs for data filtering (checkbox for attributes with boolean values, slider for numeric, select menu for text).
     * Finally, filter the data according current values of inputs.
     * @param categories {Object} data about categories
     */
    EvaluationWidget.prototype.rebuildInputs = function(categories){
        this._widgetBodySelector.html('');
        this._inputs = {
            checkboxes: [],
            sliders: [],
            selects: []
        };

        var self = this;
        for (var key in categories){
            if (categories.hasOwnProperty(key) && categories[key].active == true){
                var input = categories[key].input;
                var name = categories[key].name;
                var units = categories[key].attrData.about.units;
                var attrId = categories[key].attrData.about.attribute;
                var attrSetId = categories[key].attrData.about.attributeSet;
                var id = "attr-" + categories[key].attrData.about.attribute;
                if (input == "slider") {
                    var min = categories[key].attrData.values[0];
                    var max = categories[key].attrData.values[1];
                    var step = 0.005;
                    if (min <= -1000 || max >= 1000){
                        step = 1
                    }
                    var thresholds = [min, max];
                    var slider = self.buildSliderInput(id, name, units, thresholds, step, attrId, attrSetId);
                    slider.distribution = categories[key].attrData.distribution;
                    slider.origValues = categories[key].attrData.values;
                    this._inputs.sliders.push(slider);
                }

                else if (input == "checkbox"){
                    var checkbox = this.buildCheckboxInput(id, name);
                    this._inputs.checkboxes.push(checkbox);
                }

                else if (input == "select") {
                    var options = categories[key].attrData.values;
                    var select = this.buildSelectInput(key, name, options);
                    this._inputs.selects.push(select);
                }
            }
        }
        this.amount();
        this.addSliderListener();
        this.addInputsListener();
    };

    /**
     * It returns the checkbox
     * @param id {string} ID of the data theme
     * @param name {string} Name of the data theme
     * @returns {Checkbox}
     */
    EvaluationWidget.prototype.buildCheckboxInput = function(id, name){
        return new Checkbox({
            id: id,
            name: name,
            target: this._widgetBodySelector,
            containerId: "floater-" + this._widgetId
        });
    };

    /**
     * It returns the box with select input
     * @param id {string} ID of the data theme
     * @param name {string} Name of the data theme
     * @param options {Array} Select options
     * @returns {SelectBox}
     */
    EvaluationWidget.prototype.buildSelectInput = function(id, name, options){
        return new SelectBox({
            id: id,
            name: name,
            target: this._widgetBodySelector,
            data: options
        });
    };

    /**
     * It returns the slider box
     * @param attrId {string} ID of the attribute
     * @param attrSetId {string} ID of the attribute set ID
     * @param id {string} ID of the data theme
     * @param name {string} Name of the data theme
     * @param units {string} Units
     * @param thresholds {Array} Start and end value of the slider
     * @param step {number} step of the slider
     * @returns {SliderBox}
     */
    EvaluationWidget.prototype.buildSliderInput = function(id, name, units, thresholds, step, attrId, attrSetId){
        return new SliderBox({
            attrId: attrId,
            attrSetId: attrSetId,
            id: id,
            name: name,
            units: units,
            target: this._widgetBodySelector,
            range: thresholds,
            step: step,
            values: thresholds,
            isRange: true
        });
    };

    /**
     * It builds the footer button
     */
    EvaluationWidget.prototype.prepareFooter = function (){
        var html = S(htmlFooterContent).template().toString();
        this._widgetSelector.find(".floater-footer").html("").append(html);
    };

    EvaluationWidget.prototype.filter = function(){
        var self = this;

        setTimeout(function(){
            self._filter.filter(self._categories).then(function(result){
                var areas = result;
                var count = 0;
                if (areas.length > 0){
                    count = areas.length;
                }

                if(count > 0 ) {
                    SelectedAreasExchange.data.data = areas;
                    self.addDownloadListener(areas);

                    if (OneLevelAreas.hasOneLevel) {
                        self._map.removeLayers();
                        self._map.addLayer(areas);
                        Observer.notify('selectInternal');
                    }
                    else {
                        Observer.notify("selectAreas");
                    }

                    $('#evaluation-unselect').attr("disabled", false);
                }
            });
        },100);
    };

    EvaluationWidget.prototype.amount = function() {
        var self = this;
        this._widgetSelector.find(".floater-overlay").css("display","block");
        setTimeout(function(){
            self._filter.amount(self._categories).then(function(result){
                var amountOfAreas = result;
                self.addSelectionConfirmListener(amountOfAreas);
                self.rebuildHistograms(self._inputs.sliders);
                self._widgetSelector.find(".floater-overlay").css("display","none");
            });
        },100);
    };

	/**
     * It rebuilds the histograms with current values
     * @param sliders {Array} array of slider objects
     * @param data {Object} filtered data
     */
    EvaluationWidget.prototype.rebuildHistograms = function(sliders){
        sliders.forEach(function(slider){
            var origValues = slider.origValues;
            var dist = slider.distribution;
            if(slider.hasOwnProperty("histogram")){
                slider.histogram.rebuild(dist,slider._values, origValues);
            }
        });
    };

	/**
     * It adds listener to confirm button. If there is at least one filtered area, listener notifies the Observer
     * @param count {number} Number of currently filtered areas
     * @param filteredData {Array} filtered data
     */
    EvaluationWidget.prototype.addSelectionConfirmListener = function(count){
        var self = this;
        if (count > 0){
            var areasName = "areas";
            if (count == 1){
                areasName = "area";
            }
            $('#evaluation-confirm').html("Select " + count + " " + areasName)
                .off("click.confirm")
                .on("click.confirm", function(){
                    self.filter();
                });
        }
        else {
            $('#evaluation-confirm').html("No area selected")
                .off("click.confirm");
        }


        $('#evaluation-unselect').off("click.unselect").on("click.unselect",
        function(){
            SelectedAreasExchange.data.data = [];
            if (OneLevelAreas.hasOneLevel){
                self._map.removeLayers();
                Observer.notify('selectInternal');
            } else {
                Observer.notify("selectAreas");
            }

            $(this).attr("disabled",true);
        });
    };

	/**
     * Disable export buttons
     */
    EvaluationWidget.prototype.disableExports = function(){
        $("#export-shp, #export-csv").attr("disabled",true);
    };

    EvaluationWidget.prototype.addDownloadListener = function(areas){
        var self = this;

        var filteredAreas = [];
        areas.forEach(function(area){
            filteredAreas.push(area.gid);
        });

        this._mapExport = new MapExport({
            location: areas[0].loc,
            year: JSON.parse(ThemeYearConfParams.years)[0],
            areaTemplate: areas[0].at,
            gids: filteredAreas
        });

        $("#export-shp").off("click.shp").attr("disabled",false).on("click.shp", function(){
            self._mapExport.export("shapefile");
        });
        $("#export-csv").off("click.csv").attr("disabled",false).on("click.csv", function(){
            self._mapExport.export("csv");
        });
    };

    /**
     * It adds onclick listener to settings tool for opening of the settings dialog window
     */
    EvaluationWidget.prototype.addSettingsListener = function() {
        var self = this;
        var tool = "settings";
        $('#floater-' + self._widgetId + ' .widget-' + tool).on("click", function(){
            $('#' + self._widgetId + '-' + tool).show("drop", {direction: "up"}, 200)
                .addClass('open');
        });
    };

    /**
     * It adds the onclick listener to the settings dialog window for rebuilding of the wiget's view
     * @param button {Object} JQuery object representing dailog confirm button
     */
    EvaluationWidget.prototype.addSettingsChangeListener = function(button){
        var self = this;
        button.on("click",function(){
            self._categories = self._settings.getCategories();
            self.rebuildInputs(self._categories);
            self.disableExports();
        })
    };

    /**
     * It adds change listeners to inputs in widget body. Each time some change occurs, filter function is executed
     */
    EvaluationWidget.prototype.addInputsListener = function(){
        var self = this;
        this._widgetSelector.find(".selectmenu" ).off("selectmenuselect")
            .on( "selectmenuselect", self.amount.bind(self))
            .on( "selectmenuselect", self.disableExports.bind(self));
        this._widgetSelector.find(".slider-row").off("slidechange")
            .on( "slidechange", self.amount.bind(self))
            .on( "slidechange", self.disableExports.bind(self));
        this._widgetSelector.find(".checkbox-row").off("click.inputs")
            .on( "click.inputs", self.amount.bind(self))
            .on( "click.inputs", self.disableExports.bind(self));
    };

    /**
     * It adds listener to all sliders for positioning of slider popups
     */
    EvaluationWidget.prototype.addSliderListener = function(){
        // todo do it better
        var isFirefox = typeof InstallTrigger !== 'undefined';
        if (!isFirefox){
            var popup = $('.slider-popup');
            var margin = popup.css("margin-top");
            this._widgetBodySelector.off("scroll").on("scroll",function(e){
                popup.css("margin-top",(margin.slice(0,-2) - e.target.scrollTop)+"px");
            });
        }
    };

    return EvaluationWidget;
});
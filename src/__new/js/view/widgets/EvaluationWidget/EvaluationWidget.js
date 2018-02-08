define([
    '../../../actions/Actions',
    '../../../error/ArgumentError',
    '../../../error/NotFoundError',
    './CategorizeSettings',
    '../../../util/Color',
    '../inputs/checkbox/Checkbox',
    '../../../util/FilteredSld',
    '../../../util/Logger',
    '../../map/Map',
    '../../../util/MapExport',
    '../inputs/multiselectbox/MultiSelectBox',
	'../../../util/Remote',
    '../inputs/selectbox/SelectBox',
    './EvaluationWidgetSettings',
    '../inputs/sliderbox/SliderBox',
    '../../../stores/Stores',
    '../Widget',

    'resize',
    'jquery',
    'string',
    'underscore',

    'text!./EvaluationWidgetFooter.html',
    'css!./EvaluationWidget'
], function(Actions,
            ArgumentError,
            NotFoundError,
			CategorizeSettings,
            Color,
            Checkbox,
            FilteredSld,
            Logger,
            Map,
            MapExport,
            MultiSelectBox,
			Remote,
            SelectBox,
            Settings,
            SliderBox,
            InternalStores,
            Widget,

            resize,
            $,
            S,
            _,
            htmlFooterContent){

    /**
     * @param options {Object}
     * @param options.elementId {String} ID of widget
     * @param options.filter {Object} instance of class for data filtering
     * @param options.stateStore {StateStore}
     * @param options.targetId {String} ID of an element in which should be the widget rendered
     * @param options.name {String} Name of the widget
     * @constructor
     */
    var EvaluationWidget = function(options) {
        Widget.apply(this, arguments);

        if (!options.filter){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "EvaluationWidget", "constructor", "missingFilter"));
        }
		if (!options.stateStore){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "EvaluationWidget", "constructor", "missingStateStore"));
		}
        this._filter = options.filter;
		this._stateStore = options.stateStore;
        this._settings = null;

        this._categorize = new CategorizeSettings({
			widgetId: "categorize",
            target: this._floaterTarget,
			aggregatedChart: options.aggregatedChart
		});

        this.build();
    };

    EvaluationWidget.prototype = Object.create(Widget.prototype);

    /**
     * It rebuilds the widget for given attributes. First, it collects metadata about each attribute, then it rebuilds all components of the widget
     * @param data {Object}
     * @param options {Object}
     */
    EvaluationWidget.prototype.rebuild = function(data, options){
        var attrForRequest;
        if (Array.isArray(data)){
            attrForRequest = data;
        } else {
            attrForRequest = data.attributes;
        }

        var self = this;
        if (attrForRequest.length == 0){
            self.toggleWarning("block", [1,2,3,4]);
            self.handleLoading("hide");
            return;
        }

        if (!this._resizeListener){
            this._resizeListener = true;
            this.addOnResizeListener();
        }
        this._initializeResize = false;
        this.handleLoading("show");
        this._attrForRequest = attrForRequest;

        var distribution = {
            type: 'normal',
            classes: this.computeNumOfClasses()
        };
        this._filter.statistics(attrForRequest, distribution).then(function(attributes){
            self._attributes = [];
            self._attrForRequest = [];
            if (attributes.length > 0){
                attributes.forEach(function(attribute){
                    var about = {
                        attribute: attribute.attribute,
                        attributeName: attribute.attributeName,
                        attributeType: attribute.type,
                        attributeSet: Number(attribute.attributeSet),
                        attributeSetName: attribute.attributeSetName,
                        units: attribute.units,
                        active: attribute.active
                    };
                    self._attrForRequest.push(about);

                    if (about.attributeType == "numeric"){
                        if (self.attributeHasData(attribute)){
							// TODO: Fix ugly hack for showing Kathmandu.
							if(InternalStores.retrieve('state').current().scope == 38433) {
								self._attributes.push({
									values: [Number(attribute.min), Number(attribute.max) + 1000],
									distribution: attribute.distribution,
									about: about
								});
							} else {
								self._attributes.push({
									values: [Number(attribute.min), Number(attribute.max)],
									distribution: attribute.distribution,
									about: about
								});
							}
                        }
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
                self.toggleWarning("none");
                if (!options.hasOwnProperty("rebuildFooter") || options.rebuildFooter == true){
                    self.prepareFooter();
                }
                self.rebuildViewAndSettings();
            } else {
                self.toggleWarning("block", [1,2]);
                self.handleLoading("hide");
            }

            // clear categories and sets
			self._categorize.clearAll();
		});

        this.rebuildMap();
    };

	/**
     * Check, if there are any data for this attribute
	 * @param attribute {Object}
	 * @returns {boolean} false, if there are no data for this attribute
	 */
	EvaluationWidget.prototype.attributeHasData = function(attribute){
	    var hasData = false;
        attribute.distribution.forEach(function(cls){
           if (cls !== 0){
			   hasData = true;
           }
        });
        if (attribute.min === attribute.max){
			hasData = true;
        }
        return hasData;
    };

	/**
     * According to the width of floater set number of classes for histogram
     * @returns {number} Number of classes
     */
    EvaluationWidget.prototype.computeNumOfClasses = function(){
        var width = this._widgetSelector.width();
        if (width < 350){
            return 20;
        } if (width >= 350 && width < 450){
            return 30;
        } else if (width >= 450 && width < 550){
            return 40;
        } else {
            return 50;
        }
    };

    /**
     * Build the widget basic view of the widget
     */
    EvaluationWidget.prototype.build = function(){
        this.buildSettings();
        this._dispatcher.addListener(this.onEvent.bind(this));
    };

	/**
     * Create settings icon and attach the listener for opening
     */
    EvaluationWidget.prototype.buildSettings = function(){
        var tool = "settings";
        var name = polyglot.t("settings");
        this._widgetSelector.find(".floater-tools-container").append('<div title="'+ name +'" class="floater-tool widget-'+ tool +'">' +
			'<i class="fa fa-sliders"></i>' +
            '</div>');
        this.addSettingsListener();

        this._settings = new Settings({
            target: this._floaterTarget,
            widgetId: this._widgetId
        });
    };

	/**
     * It rebuilds the map. If map is present, it removes previously added layers
     */
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
        this._settings.rebuild(this._attributes);
        this._categories = this._settings.getCategories();
        this.setAttributesState(this._categories);
        this.rebuildInputs(this._categories);
        this.disableExports();

        this._settingsConfirm = this._settings.getConfirmButton();
        this.addSettingsChangeListener(this._settingsConfirm);
    };


	/**
     * It prepares all the inputs for data filtering (checkbox for attributes with boolean values, slider for numeric, select menu for text).
     * Finally, get amount of areas which fit to current values of inputs.
     * @param categories {Object} data about categories
     */
    EvaluationWidget.prototype.rebuildInputs = function(categories){
        this._widgetBodySelector.html("");
        this._inputs = {
            checkboxes: [],
            sliders: [],
            selects: []
        };

        var self = this;
        for (var key in categories){
            if (categories.hasOwnProperty(key) && categories[key].active == true){
                var input = categories[key].input;
                var multioptions = categories[key].multioptions;
                var name = categories[key].name;
                var units = categories[key].attrData.about.units;
                var attrId = categories[key].attrData.about.attribute;
                var attrSetId = categories[key].attrData.about.attributeSet;
                var id = "input-as-" + attrSetId + "-attr-" + attrId;
                if (input == "slider") {
                    var min = categories[key].attrData.values[0];
                    var max = categories[key].attrData.values[1];
                    var step = 0.0005;
                    var thresholds = [min, max];
                    var slider = self.buildSliderInput(id, name, units, thresholds, step, attrId, attrSetId);
                    slider.distribution = categories[key].attrData.distribution;
                    slider.origValues = categories[key].attrData.values;
                    this._inputs.sliders.push(slider);
                }

                else if (input == "checkbox"){
                    var checkbox = this.buildCheckboxInput(id, name, this._widgetBodySelector);
                    this._inputs.checkboxes.push(checkbox);
                }

                else if (input == "select") {
                    var options = categories[key].attrData.values;
                    var select;
                    if (multioptions){
                        select = this.buildMultiSelectInput(id, name, options);
                    } else {
                        select = this.buildSelectInput(id, name, options);
                    }
                    this._inputs.selects.push(select);
                }
            }
        }

        // TODO remove and uncomment when backend is ready
        if (this._inputs.checkboxes.length == 0 && this._inputs.sliders.length == 0 && this._inputs.selects.length == 0){
            self.handleLoading("hide");
        } else {
            this.amount();
        }
        //this.amount();
        this.addSliderListener();
        this.addInputsListener();
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
     * It returns the box with multi select input
     * @param id {string} ID of the data theme
     * @param name {string} Name of the data theme
     * @param options {Array} Select options
     * @returns {MultiSelectBox}
     */
    EvaluationWidget.prototype.buildMultiSelectInput = function(id, name, options){
        return new MultiSelectBox({
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
		var currentState = this._stateStore.current();

		var addCategoryClass = "hidden";
		if (currentState.scopeFull.aggregated === true){
		    addCategoryClass = "";
        }

        var html = S(htmlFooterContent).template({
            hidden: addCategoryClass,
            clearSelection: polyglot.t("clearSelection"),
            addCategory: polyglot.t("addCategory"),
            exportToGeoJson: polyglot.t("exportToGeoJson"),
            exportToXls: polyglot.t("exportToXls"),
            exportToShp: polyglot.t("exportToShp"),
            exportToCsv: polyglot.t("exportToCsv")
        }).toString();
        this._widgetSelector.find(".floater-footer").html("").append(html);
    };

	/**
     * Filter the data according to current state of inputs
     */
    EvaluationWidget.prototype.filter = function(){
        var self = this;

        setTimeout(function(){
			self._filter.filter(self._categories, "filter").then(function(areas){
				var count = 0;
                if (areas.length > 0){
                    count = areas.length;
                }
                if (count > 0 ) {
                    SelectedAreasExchange.data.data = areas;
                    self.addDownloadListener(areas);

                    if (!OneLevelAreas.hasOneLevel) {
                        Observer.notify("selectAreas");
                    }
                    $('#evaluation-unselect').attr("disabled", false);
                }
                self.handleLoading("hide");
            });
        },100);
    };

	/**
     * Get the amount of areas which fit to current values of inputs.
     */
    EvaluationWidget.prototype.amount = function() {
        var self = this;
        this.handleLoading("show");
        setTimeout(function(){
            self._filter.filter(self._categories, "amount").then(function(result){
                self.addSelectionConfirmListener(result);
				self.addCategoryListener();
                self.rebuildPopups(self._inputs.sliders);
                self.handleLoading("hide");
            });
        },100);
    };

	/**
     * It rebuilds the histograms with current values
     * @param sliders {Array} array of slider objects
     */
    EvaluationWidget.prototype.rebuildPopups = function(sliders){
        sliders.forEach(function(slider){
            slider.rebuildPopup();
            if(slider.hasOwnProperty("histogram")){
                slider.histogram.rebuild(slider.distribution, slider._values, slider.origValues);
            }
        });
    };

	/**
     * It adds listener to confirm button. If there is at least one selected area, do the filter
     * @param amount {Object} Number of currently filtered areas
     */
    EvaluationWidget.prototype.addSelectionConfirmListener = function(amount){
        var self = this;
        var count = 0;

        if(Select.selectedAreasMap && Select.selectedAreasMap[Select.actualColor] && Select.selectedAreasMap[Select.actualColor].length > 0) {
            count = Select.selectedAreasMap[Select.actualColor].length;
            if(count > 0) {
                $('#evaluation-confirm').attr("disabled", true);
                $('#evaluation-unselect').attr("disabled", false);
            }
        } else if (amount && amount.hasOwnProperty("amount")){
            count = amount.amount;
        }

        if (count > 0){
            var areasName = polyglot.t("areas");
            if (count === 1){
                areasName = polyglot.t("area");
            }
            $('#evaluation-confirm').html(polyglot.t("select") + " " + count + " " + areasName)
                .removeClass("hidden")
                .off("click.confirm")
                .on("click.confirm", function(){
                    self.handleLoading("show");
                    self.filter();
                    if (!OneLevelAreas.hasOneLevel){
                        $(this).attr("disabled",true);
                    }
                });
        }
        else {
            $('#evaluation-confirm').html(polyglot.t("noAreaSelected"))
                .off("click.confirm");
        }

        self.addUnselectListener();
    };

    EvaluationWidget.prototype.addCategoryListener = function(){
        var self = this;

		$('#evaluation-add-category')
			.attr("disabled", false)
			.off("click.addcategory")
			.on("click.addcategory", function(){
				$(".floating-window").removeClass("active");
				setTimeout(function(){
					$('#categorize-settings').addClass('open').addClass('active');
					var attributes = self._filter.getAttributesFromCategories(self._categories);
					self._categorize.addCategory(attributes);
				},50);
			});
    };

	/**
	 * Add listener to unselect button
     */
    EvaluationWidget.prototype.addUnselectListener = function(){
        var self = this;
        $('#evaluation-unselect').off("click.unselect").on("click.unselect", function(){
                SelectedAreasExchange.data.data = [];
                if (OneLevelAreas.hasOneLevel){
                    self._map.removeLayers();
                    Observer.notify('selectInternal');
                } else {
                    self._dispatcher.notify("selection#clearAll");
                }
                self.resetButtons();
        });
    };

	/**
     * Add listener to export buttons
     * @param areas {Array} List of selected areas
     */
    EvaluationWidget.prototype.addDownloadListener = function(areas){
        var self = this;
        var filteredAreas = [];

        var locations;
        if (ThemeYearConfParams.place.length > 0){
            locations = [Number(ThemeYearConfParams.place)];
        } else {
            locations = ThemeYearConfParams.allPlaces;
        }

        areas.forEach(function(area){
            filteredAreas.push(area.gid);
        });
        this._mapExport = new MapExport({
            attributes: JSON.stringify(this._attrForRequest),
            places: JSON.stringify(locations),
            periods: ThemeYearConfParams.years,
            areaTemplate: ThemeYearConfParams.auCurrentAt,
            gids: JSON.stringify(filteredAreas)
        });

        $("#export-shp").off("click.shp").attr("disabled",false).on("click.shp", function(){
            self._mapExport.export("shp");
        });
        $("#export-csv").off("click.csv").attr("disabled",false).on("click.csv", function(){
            self._mapExport.export("csv");
        });
        $("#export-json").off("click.json").attr("disabled",false).on("click.json", function(){
            self._mapExport.export("json");
        });
        $("#export-xls").off("click.xls").attr("disabled",false).on("click.xls", function(){
            self._mapExport.export("xls");
        });
    };

    /**
     * It adds change listeners to inputs in widget body. Each time some change occurs, filter function is executed
     */
    EvaluationWidget.prototype.addInputsListener = function(){
        var self = this;
        this._widgetSelector.find(".ui-checkboxradio-label" ).off("click.checkboxradio")
            .on( "click.checkboxradio", self.amount.bind(self))
            .on( "click.checkboxradio", self.disableExports.bind(self));
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
	 * Rebuild histograms on floater resize
     */
    EvaluationWidget.prototype.addOnResizeListener = function(){
        var self = this;
        var id = this._widgetSelector.attr("id");
        var resizeElement = document.getElementById(id);

        var timeout;
        resize.addResizeListener(resizeElement, function(){
            clearTimeout(timeout);
            timeout = setTimeout(function(){
                    if (self._initializeResize){
                        if (self._inputs){
                            self.rebuildPopups(self._inputs.sliders);
                        }
                        self.rebuild(self._attrForRequest, {
                            rebuildFooter: false
                        });
                    }
                    self._initializeResize = true;
                }, 500);
        });
    };

    /**
     * It adds onclick listener to settings tool for opening of the settings dialog window
     */
    EvaluationWidget.prototype.addSettingsListener = function() {
        var self = this;
        var tool = "settings";
        $('#floater-' + self._widgetId + ' .widget-' + tool).on("click", function(){
            var floater = $('#' + self._widgetId + '-' + tool);
            floater.addClass('open');
            setTimeout(function(){
				window.Stores.notify('floaters#sort', {
					fromExt: false,
					floaterJQuerySelector: floater
				});
            },20);
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
            self.setAttributesState(self._categories);
            self.rebuildInputs(self._categories);
            self.disableExports();
        })
    };

    /**
     * It adds listener to all sliders for positioning of slider popups
     */
    EvaluationWidget.prototype.addSliderListener = function(){
        // todo do it better
        var isFirefox = typeof InstallTrigger !== 'undefined';
        if (!isFirefox){
            var popup = $('.slider-popup');
            if (popup.length > 0){
                var margin = popup.css("margin-top");
                this._widgetBodySelector.off("scroll").on("scroll",function(e){
                    popup.css("margin-top",(margin.slice(0,-2) - e.target.scrollTop)+"px");
                });
            }
        }
    };

	/**
     * Prepare attributes for export
     * @param categories {Object}
     */
    EvaluationWidget.prototype.setAttributesState = function(categories){
        var attributes = [];
        for (var attr in categories){
            if (categories.hasOwnProperty(attr)){
                attributes.push(categories[attr].attrData.about);
            }
        }
        ExchangeParams.attributesState = attributes;
    };


	/**
	 * Reset widget
	 */
	EvaluationWidget.prototype.resetWidget = function(){
		this.rebuildInputs(this._categories);
		this.resetButtons();
	};

	/**
     * Reset current selection
	 */
	EvaluationWidget.prototype.resetSelection = function(){
		this.amount();
		this.resetButtons();
    };

	/**
     * Switch buttons in footer to the default state
	 */
	EvaluationWidget.prototype.resetButtons = function(){
		this.disableExports();
		$('#evaluation-confirm').attr("disabled",false);
		$('#evaluation-unselect').attr("disabled",true);
    };

	/**
	 * Disable export buttons
	 */
	EvaluationWidget.prototype.disableExports = function(){
		$("#export-shp, #export-csv, #export-xls, #export-json").attr("disabled",true);
	};

	/**
	 * @param type {string}
	 */
	EvaluationWidget.prototype.onEvent = function(type){
        if (type === Actions.selectionSelected){
            this.addSelectionConfirmListener();
        } else if (type === Actions.selectionEverythingCleared){
            this.resetWidget();
        } else if (type === Actions.selectionActiveCleared){
			this.resetSelection();
		}
    };

    return EvaluationWidget;
});
define([
    '../../../error/ArgumentError',
    '../../../util/dataRequest/attributesMetadata',
    '../../../error/NotFoundError',
    '../inputs/checkbox/Checkbox',
    '../../../util/Logger',
	'../../../util/Remote',
    '../inputs/selectbox/SelectBox',
    '../tools/settings/Settings',
    '../inputs/sliderbox/SliderBox',
	'../../../stores/Stores',
    '../Widget',

    'jquery',

    'css!./EvaluationWidget'
], function(ArgumentError,
            attributesMetadata,
            NotFoundError,
            Checkbox,
            Logger,
			Remote,
            SelectBox,
            Settings,
            SliderBox,
			Stores,
            Widget,

            $){

    /**
     * It creates an Evaluation Tool
     * @param options {Object}
     * @param options.elementId {String} ID of widget I
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

        this._tools = options.tools || [];
        this._name = options.name || "";
        this._widgetId = options.elementId;
        this._target = $("#" + options.targetId);
        if (this._target.length == 0){
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "EvaluationWidget", "constructor", "missingHTMLElement"));
        }

        this._dataSet = options.data;
        this._filter = options.filter;

        // Call the method from parent
        Widget.prototype.build.call(this, this._widgetId, this._target, this._name);

        this._widgetSelector = $("#floater-" + this._widgetId);
        this._widgetBodySelector = this._widgetSelector.find(".floater-body");

        this._attributes = [];
        this._gids = []; //codes of areas
        this._place = null;
        this._level = null;

        this.build();
        Observer.addListener(this.rebuild.bind(this));
    };

    EvaluationWidget.prototype = Object.create(Widget.prototype);

    EvaluationWidget.prototype.rebuild = function(){
        new attributesMetadata().getData().then(function(result){
           console.log(result);
        });
    };

    /**
     * It builds the widget
     */
    EvaluationWidget.prototype.build = function(){
        console.log("build");
        this.prepareFooter();
        this.prepareTools();
    };

    /**
     * It prepares a set of tools connected with this widget
     */
    EvaluationWidget.prototype.prepareTools = function(){
        var self = this;
        this._tools.forEach(function(tool){
            var name = tool.charAt(0).toUpperCase() + tool.slice(1);
            self._widgetSelector.find(".floater-tools-container").append('<div title="'+ name +'" class="floater-tool widget-'+ tool +'">' +
                '<img alt="' + name + '" src="__new/img/'+ tool +'.png"/>' +
                '</div>');

            if (tool == "settings"){
                self._settings = new Settings({
                    dataSet: self._dataSet,
                    target: self._target,
                    widgetId: self._widgetId
                });
                self._categories = self._settings.getCategories();
                self._settingsConfirm = self._settings.getConfirmButton();

                self.rebuildInputs(self._categories);
                self.addSettingsChangeListener(self._settingsConfirm);
            }
            self.addToolListener(tool);
        });
    };

    /**
     * It prepares all the inputs for data filtering
     */
    EvaluationWidget.prototype.rebuildInputs = function(categories){
        this._widgetBodySelector.html('');
        this._inputs = {
            checkboxes: [],
            sliders: [],
            selects: []
        };

        for (var key in categories){
            if (categories.hasOwnProperty(key) && categories[key].active == true){
                var input = categories[key].input;
                var name = categories[key].name;

                if (input == "checkbox"){
                    var checkbox = this.buildCheckboxInput(key, name);
                    this._inputs.checkboxes.push(checkbox);
                }
                else if (input == "slider") {
                    var thresholds = this._filter.getMinMax(this._dataSet, key);
                    var slider = this.buildSliderInput(key, name, thresholds);
                    this._inputs.sliders.push(slider);
                }
                else if (input == "select") {
                    var options = this._filter.getUniqueValues(this._dataSet, key);
                    var select = this.buildSelectInput(key, name, options);
                    this._inputs.selects.push(select);
                }
            }
        }

        this.filter();
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
     * @param id {string} ID of the data theme
     * @param name {string} Name of the data theme
     * @param thresholds {Array} Start and end value of the slider
     * @returns {SliderBox}
     */
    EvaluationWidget.prototype.buildSliderInput = function(id, name, thresholds){
        return new SliderBox({
            data: this._dataSet,
            id: id,
            name: name,
            target: this._widgetBodySelector,
            range: thresholds,
            values: thresholds,
            isRange: true
        });
    };

    /**
     * It builds the footer button
     */
    EvaluationWidget.prototype.prepareFooter = function (){
        this._widgetSelector.find(".floater-footer").append(
            '<div class="widget-button" id="evaluation-confirm"></div>'
        );
    };

    /**
     * Filter data and redraw the footer button
     */
    EvaluationWidget.prototype.filter = function(){
        var self = this;
        setTimeout(function(){
            var filtered = self._filter.filter(self._dataSet, self._inputs);
            var count = _.size(filtered);
            self.rebuildHints(filtered);
            $('#evaluation-confirm').html(count + " selected");
        },100);
    };

    /**
     * It rebuilds hints in selectmenus and histograms in slider popups
     * @param data {JSON} filtered data
     */
    EvaluationWidget.prototype.rebuildHints = function(data){
        var self = this;
        this._inputs.sliders.forEach(function(slider){
            slider.histogram.rebuild(data);
        });

        this._inputs.selects.forEach(function(select){
            var inputs = $.extend(true, {}, self._inputs);
            inputs.selects.forEach(function(item, index){
                if (item._id == select._id){
                    inputs.selects.splice(index, 1);
                }
            });
            var filteredData = self._filter.filter(self._dataSet, inputs);
            if (inputs.checkboxes.length == 0 && inputs.sliders.length == 0 && inputs.selects.length == 0){
                filteredData = self._dataSet;
            }
            select.addSelectOpenListener(filteredData, select._id);

        });
    };

    /**
     * It adds onclick listener to particular widget tool
     * @param tool {string} name of the tool
     */
    EvaluationWidget.prototype.addToolListener = function(tool) {
        var self = this;
        $('#floater-' + self._widgetId + ' .widget-' + tool).on("click", function(){
            $('#' + self._widgetId + '-' + tool).show("drop", {direction: "up"}, 200)
                .addClass('open');
        });
    };

    /**
     * It adds the onclick listener to the tool dialog window
     * @param button {Object} JQuery object representing dailog confirm button
     */
    EvaluationWidget.prototype.addSettingsChangeListener = function(button){
        var self = this;
        button.on("click",function(){
            self._categories = self._settings.getCategories();
            self.rebuildInputs(self._categories);
        })
    };

    /**
     * It adds change listeners to inputs in widget body. Each time some change occurs, filter function is executed
     */
    EvaluationWidget.prototype.addInputsListener = function(){
        var self = this;
        this._widgetSelector.find(".selectmenu" ).off("selectmenuselect").on( "selectmenuselect", self.filter.bind(self));
        this._widgetSelector.find(".slider-row").off("slidechange").on("slidechange", self.filter.bind(self));
        this._widgetSelector.find(".checkbox-row").off("click.inputs").on( "click.inputs", self.filter.bind(self));
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
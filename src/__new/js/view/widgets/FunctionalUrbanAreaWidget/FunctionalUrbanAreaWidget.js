define([
    '../../../error/ArgumentError',
    '../../../error/NotFoundError',
    '../../../util/Color',
    '../inputs/checkbox/Checkbox',
    '../../../util/Logger',
    '../../map/Map',
    '../../../util/MapExport',
    '../inputs/multiselectbox/MultiSelectBox',
	'../../../util/Remote',
    '../inputs/selectbox/SelectBox',
    '../inputs/sliderbox/SliderBox',
    '../Widget',

    'resize',
    'jquery',
    'string',
    'underscore',

    'css!./FunctionalUrbanAreaWidget'
], function(ArgumentError,
            NotFoundError,
            Color,
            Checkbox,
            Logger,
            Map,
            MapExport,
            MultiSelectBox,
			Remote,
            SelectBox,
            SliderBox,
            Widget,

            resize,
            $,
            S,
            _){

    /**
     * @param options {Object}
     * @param options.elementId {String} ID of widget
     * @param options.filter {Object} instance of class for data filtering
     * @param options.targetId {String} ID of an element in which should be the widget rendered
     * @param options.name {String} Name of the widget
	 * @param options.results {Widget} Widget used for showing results.
     * @constructor
     */
    var FunctionalUrbanAreaWidget = function(options) {
        Widget.apply(this, arguments);

        this._settings = null;
        this._sets = [];
        this._results = options.results;

        $(function(){
			this.build();
		}.bind(this));
    };

    FunctionalUrbanAreaWidget.prototype = Object.create(Widget.prototype);

    /**
     * It rebuilds the widget.
     */
    FunctionalUrbanAreaWidget.prototype.build = function(){
        if (!this._resizeListener){
            this._resizeListener = true;
            this.addOnResizeListener();
        }
        this._initializeResize = false;
        this.handleLoading("hide");

        $('#floater-functional-urban-area .floater-body').empty();
        $('#floater-functional-urban-area .floater-body').append(
        	'<div id="klasses">' +
			'	<div>' +
			'		<h3>High Density Clusters</h3>' +
			'		<div>Density threshold: <input type="text" id="hdcDensityThreshold"/></div>' +
			'		<div>Size threshold: <input type="text" id="hdcSizeThreshold" /></div>' +
			'	</div>' +
			'	<div>' +
			'		<h3>Urban Clusters</h3>' +
			'		<div>Density threshold: <input type="text" id="ucDensityThreshold"/></div>' +
			'		<div>Size threshold: <input type="text" id="ucSizeThreshold" /></div>' +
			'	</div>' +
			'	<div>' +
			'		<input type="button" id="add-list" value="Add" /><input type="button" id="show-threshold" value="Show" />' +
			'	</div>' +
			'	<div id="information-sets">' +
			'	</div>' +
			'</div>'
		);
        $('#show-threshold').click(this.show.bind(this));
		$('#add-list').click(this.add.bind(this));
		// Allow for adding multiple sets.
    };

    FunctionalUrbanAreaWidget.prototype.show = function() {
		$('#floater-functional-urban-area-result').addClass('open');
		this._results.build(this._sets);

		this._sets = [];
		this.build();
		$('#floater-functional-urban-area').removeClass('open');
	};

    FunctionalUrbanAreaWidget.prototype.add = function() {
    	this._sets.push({
			hdc: {
				density: $('#hdcDensityThreshold').val(),
				size: $('#hdcSizeThreshold').val()
			},
			uc: {
				density: $('#ucDensityThreshold').val(),
				size: $('#ucSizeThreshold').val()
			}
		});
    	var text = $('#hdcDensityThreshold').val() + ',' + $('#hdcSizeThreshold').val() + ';' +
			$('#ucDensityThreshold').val() + ',' + $('#ucSizeThreshold').val();
    	$('#information-sets').append('' +
			'<div>' +
			'	' + text +
			'</div>'
		);
	};

	/**
	 * Rebuild widget on resize
	 */
	FunctionalUrbanAreaWidget.prototype.addOnResizeListener = function(){
		var self = this;
		var id = this._widgetSelector.attr("id");
		var resizeElement = document.getElementById(id);

		var timeout;
		resize.addResizeListener(resizeElement, function(){
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				if (self._initializeResize){
					self.build();
				}
				self._initializeResize = true;
			}, 500);
		});
	};

    return FunctionalUrbanAreaWidget;
});
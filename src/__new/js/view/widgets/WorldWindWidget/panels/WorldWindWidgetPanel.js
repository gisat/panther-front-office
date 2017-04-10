define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'../../inputs/checkbox/Checkbox',
	'../../../worldWind/layers/layerTools/LayerTools',
	'./panelRow/PanelRow',
	'../../inputs/checkbox/Radiobox',

	'jquery',
	'string',
	'text!./WorldWindWidgetPanel.html',
	'css!./WorldWindWidgetPanel'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Checkbox,
			LayerTools,
			PanelRow,
			Radiobox,

			$,
			S,
			htmlBody
){
	/**
	 * Class representing a panel of WorldWindWidgetPanels
	 * @param options {Object}
	 * @param options.id {string} id of element
	 * @param options.name {string} name of panel
	 * @param options.target {JQuery} JQuery selector of target element
	 * @param options.worldWind {WorldWind.WorldWindow}
	 * @constructor
	 */
	var WorldWindWidgetPanel = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetSection", "constructor", "missingId"));
		}
		if (!options.name){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetSection", "constructor", "missingName"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetSection", "constructor", "missingTarget"));
		}
		if (!options.worldWind){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingWorldWind"));
		}

		this._worldWind = options.worldWind;
		this._id = options.id;
		this._name = options.name;
		this._target = options.target;

		this._isOpen = true;
		if (options.hasOwnProperty("isOpen")){
			this._isOpen = options.isOpen;
		}

		this.build();
	};

	/**
	 * Build panel
	 */
	WorldWindWidgetPanel.prototype.build = function(){
		var html = S(htmlBody).template({
			panelId: this._id,
			name: this._name
		}).toString();
		this._target.append(html);

		this._panelSelector = $("#" + this._id + "-panel");
		this._panelHeaderSelector = $("#" + this._id + "-panel-header");
		this._panelBodySelector = $("#" + this._id + "-panel-body");
		this.toggleState(this._isOpen);

		this.addEventsListeners();
	};

	/**
	 * Add listeners
	 */
	WorldWindWidgetPanel.prototype.addEventsListeners = function(){
		this.addCheckboxOnClickListener();
	};

	/**
	 * Remove all layers from this panel
	 */
	WorldWindWidgetPanel.prototype.clear = function(group){
		this._panelBodySelector.html('');
		this.clearLayers(group);
	};

	/**
	 * Remove all layers from specific group from map and all floaters connected with this group
	 */
	WorldWindWidgetPanel.prototype.clearLayers = function(group){
		$("." + group + "-floater").remove();
		this._worldWind.layers.removeAllLayersFromGroup(group);
		this._panelBodySelector.find(".layer-row").removeClass("checked");
	};

	/**
	 * Show/hide whole panel (header including)
	 * @param action {string} CSS display value
	 */
	WorldWindWidgetPanel.prototype.displayPanel = function(action){
		this._panelSelector.css("display", action);
	};

	/**
	 * Show/hide panel
	 * @param state {boolean} true, if panel should be shown
	 */
	WorldWindWidgetPanel.prototype.toggleState = function(state){
		this._panelHeaderSelector.toggleClass("open", state);
		this._panelBodySelector.toggleClass("open", state);
	};

	/**
	 * Add layer group to panel
	 * @param id {string}
	 * @param name {string}
	 * @returns {*|jQuery|HTMLElement} Selector of the group
	 */
	WorldWindWidgetPanel.prototype.addLayerGroup = function(id, name){
		this._panelBodySelector.append('<div class="panel-layer-group" id="' + id + '-panel-layer-group">' +
				'<div class="panel-layer-group-header open">' +
					'<div class="panel-icon expand-icon"></div>' +
					'<div class="panel-icon folder-icon"></div>' +
				'<h3>' + name + '</h3></div>' +
				'<div class="panel-layer-group-body open"></div>' +
			'</div>');
		return $("#" + id + "-panel-layer-group").find(".panel-layer-group-body");
	};

	/**
	 * Add item to the panel
	 * @param id {string} id of the layer
	 * @param name {string} name of the layer
	 * @param target {*|jQuery|HTMLElement} Selector of the group
	 * @param visible {boolean} true, if layer should be visible
	 */
	WorldWindWidgetPanel.prototype.addLayerControl = function(id, name, target, visible){
		return new PanelRow({
			active: visible,
			id: id,
			groupId: this._id,
			name: name,
			target: target
		});
	};

	/**
	 * Add checkbox to panel
	 * @param id {string} id of checkbox
	 * @param name {string} label
	 * @param target {JQuery} JQuery selector of target element
	 * @param dataId {string} id of data connected with thischeckbox
	 * @param checked {boolean} true if checkbox should be checked
	 * @returns {Checkbox}
	 */
	WorldWindWidgetPanel.prototype.addCheckbox = function(id, name, target, dataId, checked){
		return new Checkbox({
			id: id,
			name: name,
			target: target,
			containerId: this._id + "-panel-body",
			dataId: dataId,
			checked: checked,
			class: "layer-row"
		});
	};

	/**
	 * Add radiobox to panel
	 * @param id {string} id of radio box
	 * @param name {string} label
	 * @param target {JQuery} JQuery selector of target element
	 * @param dataId {string} id of data connected with this radio
	 * @param checked {boolean} true if radio should be checked
	 * @returns {Radiobox}
	 */
	WorldWindWidgetPanel.prototype.addRadio = function(id, name, target, dataId, checked){
		return new Radiobox({
			id: id,
			name: name,
			target: target,
			containerId: this._id + "-panel-body",
			dataId: dataId,
			checked: checked
		});
	};

	/**
	 * Add onclick listener to every radio
	 */
	WorldWindWidgetPanel.prototype.addRadioOnClickListener = function(){
		this._panelBodySelector.find(".radiobox-row").on("click", this.toggleLayers.bind(this));
	};

	/**
	 * Add onclick listener to every checkbox
	 */
	WorldWindWidgetPanel.prototype.addCheckboxOnClickListener = function(){
		this._panelBodySelector.on("click", ".checkbox-row", this.toggleLayer.bind(this));
	};

	/**
	 * Hide/show layer
	 * @param event {Object}
	 */
	WorldWindWidgetPanel.prototype.toggleLayer = function(event){
		var self = this;
		setTimeout(function(){
			var checkbox = $(event.currentTarget);
			var layerId = checkbox.attr("data-id");

			// check/uncheck layer in 2D
			var checkbox2d = $("td[data-for=" + layerId + "]").find("input");
			Stores.notify("checklayer", checkbox2d);

			checkbox2d.trigger("click", ["ctrl"]);


			if (checkbox.hasClass("checked")){
				self._worldWind.layers.showLayer(layerId);
			} else {
				self._worldWind.layers.hideLayer(layerId);
			}
		},50);
	};

	/**
	 * Go through the list of active layers and turn on all active layers from a group
	 * @param groupId {string} id of the group
	 */
	WorldWindWidgetPanel.prototype.switchOnActiveLayers = function(groupId){
		this._activeLayers = Stores.activeLayers;
		var self = this;
		this._activeLayers.forEach(function(layer){
			if (layer.group == groupId){
				var checkbox = $(".checkbox-row[data-id=" + layer.id +"]");
				checkbox.addClass("checked");
				self._worldWind.layers.showLayer(layer.id, layer.order);
			}
		});
	};

	return WorldWindWidgetPanel;
});
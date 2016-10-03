define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/MelodiesRemote',
	'../inputs/selectbox/SelectBox',
	'../Widget',

	'jquery',
	'underscore',

	'css!./BasicWidget'
], function(ArgumentError,
			NotFoundError,
			Logger,
			MelodiesRemote,
			SelectBox,
			Widget,

			$,
			_){

	var BasicWidget = function(options) {
		Widget.apply(this, arguments);

		if (!options.elementId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "BasicWidget", "constructor", "missingElementId"));
		}
		if (!options.targetId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "BasicWidget", "constructor", "missingTargetElementId"));
		}

		this._name = options.name || "";
		this._widgetId = options.elementId;
		this._target = $("#" + options.targetId);
		if (this._target.length == 0){
			throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "BasicWidget", "constructor", "missingHTMLElement"));
		}

		// Call the method from parent
		Widget.prototype.build.call(this, this._widgetId, this._target, this._name);

		this._widgetSelector = $("#floater-" + this._widgetId);
		this._widgetBodySelector = this._widgetSelector.find(".floater-body");

		this._selectBoxes = [];
		this.build(options);
	};

	BasicWidget.prototype = Object.create(Widget.prototype);

	BasicWidget.prototype.build = function(options){
		var self = this;
		if(options.hasOwnProperty("selection")){
			options.selection.forEach(function(selection){
				var selectBox = self.addSelection(selection.id, selection.name, selection.options);
				self._selectBoxes.push(selectBox);
				self.addSelectionListener(selection.id);
			});
		}
		this.prepareFooter();
	};

	/**
	 * Add the selection row
	 * @param id {string} Id of the select box
	 * @param name {string} Selection label
	 * @param options {Array} Selection options
	 * @returns {SelectBox}
	 */
	BasicWidget.prototype.addSelection = function(id, name, options){
		return new SelectBox({
			id: id,
			name: name,
			target: this._widgetBodySelector,
			data: options
		});
	};

	/**
	 * It builds the footer button
	 */
	BasicWidget.prototype.prepareFooter = function(){
		this._widgetSelector.find(".floater-footer").append('<div class="floater-row">' +
			'<div class="widget-button" id="melodies-selection-confirm">Send</div>' +
			'</div>');
		this.addFooterListener();
	};

	BasicWidget.prototype.addSelectionListener = function(selectBox){
		$('#' + selectBox + '-button').on("click",function(){
			$('#melodies-selection-confirm').html("Send").attr("disabled", false).removeClass("failed");
		});
	};

	BasicWidget.prototype.addFooterListener = function(){
		var self = this;
		$('#melodies-selection-confirm').on("click",function(){
			self.sendData();
		});
	};

	BasicWidget.prototype.sendData = function(){
		var city = this._selectBoxes[0].getValue();
		return new MelodiesRemote({
			method: "POST",
			url: window.Config.melodiesRemoteUrl,
			params: {
				city: city
			}
		}).then(function(response){
			if (response == 200){
				$('#melodies-selection-confirm').html("Request has been sent...").attr("disabled", true);
			}
			else {
				$('#melodies-selection-confirm').html("Failed to send request!").attr("disabled", true).addClass("failed");
			}
		});
	};

	return BasicWidget;
});
define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/RemoteJQ',
	'../../../util/viewUtils',

	'./DataviewCard/DataviewCard',
	'../../../stores/Stores',
	'../Widget',

	'jquery',
	'underscore',
	'text!./CustomViewsWidget.html',
	'css!./CustomViewsWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,
			RemoteJQ,
			viewUtils,

			DataviewCard,
			Stores,
			Widget,

			$,
			_,
			CustomViewsHtml){

	/**
	 *
	 * @param options {Object}
	 * @constructor
	 * @augments Widget
	 */
	var CustomViewsWidget = function(options){
		Widget.apply(this, arguments);

		this._dispatcher = options.dispatcher;
		this._dispatcher.addListener(this.onEvent.bind(this));
		this.build();
	};

	CustomViewsWidget.prototype = Object.create(Widget.prototype);

	CustomViewsWidget.prototype.build = function(){
		var bodySelector = $('body');
		var isIntro = bodySelector.hasClass('intro');
		if (Config.toggles.showDataviewsOverlay){
			this._widgetSelector.addClass("open expanded active");
			if (isIntro){
				this._widgetSelector.addClass("intro-overlay");
				bodySelector.addClass("intro-overlay");
			}
			// this.rebuild();
		}
	};

	/**
	 * Get dataviews and redraw widget
	 */
	CustomViewsWidget.prototype.rebuild = function(){
		this.handleLoading("show");
		var self = this;
		var changed = Stores.retrieve("state").current().changes;

		if (changed.dataview && Config.toggles.showDataviewsOverlay){
			this._widgetSelector.removeClass("open expanded active");
			$('#top-toolbar-saved-views').removeClass("open");
			setTimeout(function(){
				self._widgetSelector.draggable("enable");
			},500);
		}

		Stores.retrieve('dataview').load()
			.then(this.redraw.bind(this))
			.catch(function(err){throw new Error(err);});
	};

	/**
	 * Redraw widget with dataviews
	 * @param data {Array}
	 */
	CustomViewsWidget.prototype.redraw = function(data){
		var bodySelector = $('body');
		var isIntro = bodySelector.hasClass('intro');
		this._widgetBodySelector.html('<div class="custom-views-content"></div>');
		this._contentSelector = this._widgetBodySelector.find(".custom-views-content");

		var isAdmin = false;
		if (Config.auth && Config.auth.userId === 1){
			isAdmin = true;
		}

		if (data.length === 0){
			this._widgetSelector.find(".widget-minimise").trigger("click");
			$("#top-toolbar-saved-views").addClass("hidden");
		} else {
			if (isIntro && Config.toggles.showDataviewsOverlay){
				this.renderAsOverlay(data, isAdmin);

			} else {
				var scope = Stores.retrieve("state").current().scope;
				this.renderAsWidget(data, scope, isAdmin);
				this._widgetSelector.removeClass("intro-overlay");
				bodySelector.removeClass("intro-overlay");
			}
		}
	};

	/**
	 * Add content grouped to one category per scope
	 * @param data {Array} data for dataviews card
	 * @param isAdmin {boolean} true, if logged user is admin
	 */
	CustomViewsWidget.prototype.renderAsOverlay = function(data, isAdmin){
		this._widgetSelector.addClass("open expanded active");

		this.toggleOverlaySwitch(isAdmin);

		var groupedData = this.groupDataByScope(data);
		var scopeNamesPromises = [];
		for (var ds in groupedData){
			scopeNamesPromises.push(Stores.retrieve('scope').byId(Number(ds)));
		}

		var self = this;
		Promise.all(scopeNamesPromises).then(function(results){
			var scopes = _.flatten(results);
			self.renderAsOverlayContent(scopes, groupedData, isAdmin);
			self.handleLoading("hide");
		}).catch(function(err){
			throw new Error(err);
		});
	};

	/**
	 * Render content of widget in overlay mode
	 * @param scopes {Array} Collestion of scopes
	 * @param data {Object} Data about dataviews grouped by scope
	 * @param isAdmin {boolean} true, if logged user is admin
	 */
	CustomViewsWidget.prototype.renderAsOverlayContent = function(scopes, data, isAdmin){
		this._contentSelector.html('<div class="custom-views-categories"></div>' +
			'<div class="custom-views-dataviews">' +
				'<div class="custom-views-dataviews-container"></div>' +
			'</div>');
		this._categoriesContainerSelector = this._contentSelector.find('.custom-views-categories');
		this._dataviewsContainerSelector = this._contentSelector.find('.custom-views-dataviews-container');

		if (Config.toggles.dataviewsOverlayHasIntro){
			this.renderContentItem("intro", "About");
		}

		for (var dataset in data){
			var scope = _.find(scopes, function(scope){
				return Number(scope.id) === Number(dataset);
			});

			if (scope && scope.name){
				var name = scope.name;
				this.renderContentItem(dataset, name);

				var window = $('#custom-views-dataviews-' + dataset + ' .custom-views-window-content');
				var sortedData = this.sortDataByTime(data[dataset]);
				var self = this;
				sortedData.forEach(function(dataview){
					var data = self.prepareDataForCard(dataview);
					self.addDataviewCard(data, window, isAdmin);
				});
			}
		}

		$(".custom-views-category:first-child").addClass("active");
		this._activeWindow = $(".custom-views-window:first-child");
		this._secondWindow = $(".custom-views-window:nth-child(2)");
		this._thirdWindow = $(".custom-views-window:nth-child(3)");

		this._activeWindow.addClass("active");
		this._secondWindow.addClass("second");
		this._thirdWindow.addClass("third");

		this.addCategoryListener();
	};

	/**
	 * Append Item in categories menu and connected window in content
	 * @param id {string|number} id of the window
	 * @param name {string} name of the category
	 */
	CustomViewsWidget.prototype.renderContentItem = function(id, name){
		this._categoriesContainerSelector.append('<div class="custom-views-category" data-for="custom-views-dataviews-' + id + '">' + name + '</div>');
		this._dataviewsContainerSelector.append('<div class="custom-views-window" id="custom-views-dataviews-' + id + '">' +
				'<div class="custom-views-window-wrapper">' +
					'<div class="custom-views-window-content"></div>' +
				'</div>' +
			'</div>');
	};

	/**
	 * Show/hide overlay switch
	 * @param isAdmin {boolean} true, if logged user is admin
	 */
	CustomViewsWidget.prototype.toggleOverlaySwitch = function(isAdmin){
		if (this._overlaySwitchSelector){
			if (isAdmin){
				this._overlaySwitchSelector.css("display", "inline-block");
			} else {
				this._overlaySwitchSelector.css("display", "none");
			}
		} else if (isAdmin) {
			this.renderOverlaySwitch();
		}
	};

	/**
	 * Add switch to the header toolbar, which allows to admin switch off/on the overlay
	 */
	CustomViewsWidget.prototype.renderOverlaySwitch = function(){
		$("#header .menu").append("<li id='overlay-switch'><a href='#'>" + polyglot.t("dataviewOverlaySwitchToOld") + "</a></li>");
		this._overlaySwitchSelector = $("#overlay-switch");
		var self = this;
		this._overlaySwitchSelector.on("click",function(){
			var switcherLink = $(this).find("a");
			var bodySelector = $('body');
			var overlayActive = self._widgetSelector.hasClass("open");
			if (overlayActive){
				self._widgetSelector.removeClass("open");
				bodySelector.removeClass("intro-overlay");
				switcherLink.text(polyglot.t("dataviewOverlaySwitchToNew"));
			} else {
				self._widgetSelector.addClass("open");
				bodySelector.addClass("intro-overlay");
				switcherLink.text(polyglot.t("dataviewOverlaySwitchToOld"));
			}
		});
	};

	/**
	 * Add content for selected scope
	 * @param data {Array} data for dataviews card
	 * @param scope {string|number} current scope
	 * @param isAdmin {boolean} true, if logged user is admin
	 */
	CustomViewsWidget.prototype.renderAsWidget = function(data, scope, isAdmin){

		//filter dataviews for this scope only
		// TODO move fiter to backend
		var filteredData = this.filterDataByScope(data, scope);
		var sortedData = this.sortDataByTime(filteredData);

		if (sortedData.length === 0){
			$("#top-toolbar-saved-views").addClass("hidden");
		} else {
			$("#top-toolbar-saved-views").removeClass("hidden");
		}

		var self = this;
		sortedData.forEach(function(dataview){
			var data = self.prepareDataForCard(dataview);
			self.addDataviewCard(data, self._contentSelector, isAdmin);
		});
		this.handleLoading("hide");
	};

	/**
	 * Add on click listener to category menu item
	 */
	CustomViewsWidget.prototype.addCategoryListener = function(){
		var self = this;
		$(".custom-views-category").off("click.category").on("click.category", function(){
			var category = $(this);
			var categories = $(".custom-views-category");
			var contentWindows = $(".custom-views-window");
			var selectedId = $(this).attr("data-for");
			var activeId = self._activeWindow.attr("id");
			var secondId = self._secondWindow.attr("id");
			var thirdId = self._thirdWindow.attr("id");
			var index = contentWindows.index(this);

			categories.removeClass("active");
			category.addClass("active");
			contentWindows.removeClass("active").removeClass("second").removeClass("third");

			if (selectedId === secondId){
				self._activeWindow = $("#" + selectedId);
				self._secondWindow = $("#" + activeId);
			} else if (selectedId === thirdId || selectedId !== activeId){
				self._activeWindow = $("#" + selectedId);
				self._secondWindow = $("#" + activeId);
				self._thirdWindow = $("#" + secondId);
			}

			self._activeWindow.addClass("active");
			self._secondWindow.addClass("second");
			self._thirdWindow.addClass("third");
		});
	};

	/**
	 * @param type {string} type of event
	 */
	CustomViewsWidget.prototype.onEvent = function(type){
		if (type === Actions.userChanged || type === "initialLoadingFinished"){
			this.handleLoading("show");
			Stores.retrieve('dataview').load().then(this.redraw.bind(this));
		} else if (type === Actions.dataviewShow){
			this._widgetSelector.find(".widget-minimise").trigger("click");
		}
	};

	/**
	 * Prepare data for dataview card
	 * @param d {Object} original data about dataview
	 * @return {Object} prepared data about dataview
	 */
	CustomViewsWidget.prototype.prepareDataForCard = function(d){
		var language = d.data.language || "en";

		var auth = "";
		if (Config.auth){
			auth = "&needLogin=true";
		}
		var prepared = {
			id: d.id,
			url: window.location.origin + window.location.pathname + "?id=" + d.id + auth + "&lang=" + language
		};

		if (d.data.name && d.data.name.length > 0){
			prepared.name = d.data.name;
		} else {
			prepared.name = "Dataview " + d.id;
		}

		if (d.data.description && d.data.description.length > 0){
			prepared.description = d.data.description;
		} else {
			prepared.description = "Dataview " + d.id;
		}

		prepared.preview = {
			background: 'linear-gradient(135deg, '+ viewUtils.getPseudorandomColor() +' 0%, ' + viewUtils.getPseudorandomColor() + ' 100%)'
		};

		return prepared;
	};

	/**
	 * Group data for dataviews by scope
	 * @param data {Array}
	 * @returns {Object} data grouped by scope
	 */
	CustomViewsWidget.prototype.groupDataByScope = function(data){
		return _.groupBy(data, function(d){
			return d.data.dataset;
		});
	};

	/**
	 * Filter data for dataviews cards by scope
	 * @param data {Array}
	 * @param scope {string|number} id of current scope
	 * @returns {Array} filtered data
	 */
	CustomViewsWidget.prototype.filterDataByScope = function(data, scope){
		return _.filter(data, function(d){
			return d.data.dataset === Number(scope);
		});
	};

	/**
	 * Sort data for daataviews by time from the newest
	 * @param data {Array}
	 * @returns {Array} sorted data
	 */
	CustomViewsWidget.prototype.sortDataByTime = function(data){
		return _.sortBy(data, function(d){
			return - (new Date(d.date).getTime());
		});
	};

	/**
	 * Add dataview card to target
	 * @param data {Object} data for card
	 * @param target {Object} JQuery selector of parent element
	 * @param hasTools {boolean} if true, tools will be displayed
	 * @returns {DataviewCard}
	 */
	CustomViewsWidget.prototype.addDataviewCard = function(data, target, hasTools){
		return new DataviewCard({
			id: data.id,
			url: data.url,
			name: data.name,
			description: data.description,
			dispatcher: this._dispatcher,
			preview: data.preview,
			target: target,
			hasTools: hasTools
		});
	};

	return CustomViewsWidget;
});
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
		if (Config.toggles.showDataviewsOverlay){
			this._widgetSelector.addClass("open expanded active");
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
		this._widgetBodySelector.html('<div class="custom-views-content"></div>');
		this._contentSelector = this._widgetBodySelector.find(".custom-views-content");

		if (data.length === 0){
			this._widgetSelector.find(".widget-minimise").trigger("click");
			$("#top-toolbar-saved-views").addClass("hidden");
		} else {
			var bodySelector = $('body');
			var isIntro = bodySelector.hasClass('intro');
			if (isIntro && Config.toggles.showDataviewsOverlay){
				this.renderAsOverlay(data);

			} else {
				var scope = Stores.retrieve("state").current().scope;
				this.renderAsWidget(data, scope)
			}
		}

		this.handleLoading("hide");
	};

	/**
	 * Add content grouped to one category per scope
	 * @param data {Array} data for dataviews card
	 */
	CustomViewsWidget.prototype.renderAsOverlay = function(data){
		this._widgetSelector.addClass("open expanded active intro-overlay");
		$('body').addClass("intro-overlay");

		var groupedData = this.groupDataByScope(data);
		var scopeNamesPromises = [];
		for (var ds in groupedData){
			scopeNamesPromises.push(Stores.retrieve('scope').byId(Number(ds)));
		}

		var self = this;
		Promise.all(scopeNamesPromises).then(function(results){
			var scopes = _.flatten(results);
			self.renderAsOverlayContent(scopes, groupedData);
		}).catch(function(err){
			throw new Error(err);
		});
	};

	/**
	 * Render content of widget in overlay mode
	 * @param scopes {Array} Collestion of scopes
	 * @param data {Object} Data about dataviews grouped by scope
	 */
	CustomViewsWidget.prototype.renderAsOverlayContent = function(scopes, data){
		this._contentSelector.html('<div class="custom-views-categories"></div>' +
			'<div class="custom-views-dataviews">' +
				'<div class="custom-views-dataviews-container"></div>' +
			'</div>');
		this._categoriesContainerSelector = this._contentSelector.find('.custom-views-categories');
		this._dataviewsContainerSelector = this._contentSelector.find('.custom-views-dataviews-container');

		for (var dataset in data){
			var name = _.find(scopes, function(scope){
				return Number(scope.id) === Number(dataset);
			}).name;

			this._categoriesContainerSelector.append('<div class="custom-views-category" data-for="custom-views-dataviews-' + dataset + '">' + name + '</div>');
			this._dataviewsContainerSelector.append('<div class="custom-views-dataviews4scope" id="custom-views-dataviews-' + dataset + '">' +
					'<div class="custom-views-dataviews4scope-wrapper">' +
						'<div class="custom-views-dataviews4scope-content"></div>' +
					'</div>' +
				'</div>');

			var dataviews4scope = $('#custom-views-dataviews-' + dataset + ' .custom-views-dataviews4scope-content');
			var sortedData = this.sortDataByTime(data[dataset]);
			var self = this;
			sortedData.forEach(function(dataview){
				var data = self.prepareDataForCard(dataview);
				self.addDataviewCard(data, dataviews4scope);
			});
		}

		$(".custom-views-category:first-child").addClass("active");
		$(".custom-views-dataviews4scope:first-child").addClass("active");

		this.addCategoryListener();
	};

	/**
	 * Add content for selected scope
	 * @param data {Array} data for dataviews card
	 * @param scope {string|number} current scope
	 */
	CustomViewsWidget.prototype.renderAsWidget = function(data, scope){

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
			self.addDataviewCard(data, self._contentSelector);
		});
	};

	/**
	 * Add on click listener to category menu item
	 */
	CustomViewsWidget.prototype.addCategoryListener = function(){
		var self = this;
		$(".custom-views-category").off("click.category").on("click.category", function(){
			var category = $(this);
			var categories = $(".custom-views-category");
			var contentWindows = $(".custom-views-dataviews4scope");
			var contentWindowId = $(this).attr("data-for");
			var contentWindow = $("#" + contentWindowId);

			categories.removeClass("active");
			category.addClass("active");
			contentWindows.removeClass("active");
			contentWindow.addClass("active");
		});
	};

	/**
	 * @param type {string} type of event
	 */
	CustomViewsWidget.prototype.onEvent = function(type){
		if (type === Actions.userChanged){
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
	 * @returns {DataviewCard}
	 */
	CustomViewsWidget.prototype.addDataviewCard = function(data, target){
		return new DataviewCard({
			id: data.id,
			url: data.url,
			name: data.name,
			description: data.description,
			dispatcher: this._dispatcher,
			preview: data.preview,
			target: target
		});
	};

	return CustomViewsWidget;
});
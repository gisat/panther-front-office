define([], function () {
    var loadingInterval;

	function onLegChange(leg, iframe, appOffset) {
		var iframeSelector = $("#snow-iframe");

		leg.$el.css({
			marginTop: appOffset + "px"
		});
		if (leg.index > 7){
			leg.reposition();
		}
		if (!leg.rawData.el || leg.rawData.el === "#top-toolbar" || leg.rawData.el === ".ptr-overview-collection .ptr-button"){
			leg.$el.css({
				marginTop: "0px"
			});
		}
		if (leg.rawData.el === "#top-toolbar"){
			leg.$el.css({
				left: "auto",
				right: "0px"
			});
		}
		if (leg.rawData.el === "#scope-config-controls .ptr-button"){

		}

		if (leg.rawData.el === "#overview-header-scope"){
			iframe.rebuild(Config.snowAppExampleUrl);
			leg.$el.css({
				left: "200px"
			});
			checkDataLoading();
		}
		if (leg.rawData.el === "#overview-header-scenes"){
			leg.$el.css({
				left: "500px"
			});
		}
		if (leg.rawData.el === "#overview-collections"){
			leg.$el.css({
				top: "350px",
				left: "500px",
				marginTop: "0px"
			});
		}
		if (leg.rawData.el === "#add-composites-button"){
			setTimeout(function(){
				iframe.scrollY(300);
				leg.$el.css({
					bottom: "150px",
					top: "auto"
				});
			}, 100);
		}
		if (leg.rawData.el === "#compare-composites-button"){
			leg.$el.css({
				bottom: "150px",
				top: "auto"
			});
		}
		if (leg.rawData.el === "#composites-list-header"){
			// iframe.rebuild(Config.snowAppExampleUrl + "/?s=composites");
			var button = iframeSelector.contents().find("#overview-collections .ptr-button");
			button.trigger("click");
			leg.$el.css({
				left: "200px"
			});
		}
		if (leg.rawData.el === "#composites .ptr-composites-composite .ptr-button:first-child"){
			leg.$el.css({
				left: "500px"
			});
		}
		if (leg.rawData.el === "#map-holder"){
			var showInMapButton = iframeSelector.contents().find("#composites-list .ptr-composites-composite .ptr-button:first-child");
			showInMapButton.trigger("click");
			leg.$el.css({
				top: "300px"
			});
		}
	}

	function onTourStart(iframe){
		var button = $("#snow-iframe").contents().find(".ptr-button.show-overview");
		button.trigger("click");
		iframe.rebuild(Config.snowAppUrl);
	}

	function onTourStop(iframe){
		iframe.rebuild(Config.snowAppUrl);
		var button = $("#snow-iframe").contents().find(".ptr-button.show-overview");
		button.trigger("click");
	}

	function checkDataLoading(){
		var scenes = $("#snow-iframe").contents().find(".ptr-overview-scenes");
		var scenesLoaded = scenes.hasClass("loaded");
		var composites = $("#snow-iframe").contents().find(".ptr-overview-collection");
		var compositesLoaded = composites.hasClass("loaded");

		var info = $(".loading-info");
		var nextButton = $(".hidden-while-loading");

		if (scenesLoaded && compositesLoaded){
			info.addClass("hidden");
			nextButton.removeClass("hidden");
			clearInterval(loadingInterval);
		} else {
			info.removeClass("hidden");
			nextButton.addClass("hidden");
			loadingInterval = window.setInterval(checkDataLoading, 1000);
		}
	}

	return {
		onLegChange: onLegChange,
		onTourStart: onTourStart,
		onTourStop: onTourStop
	};
});
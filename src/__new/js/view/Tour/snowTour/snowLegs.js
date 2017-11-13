define([], function () {

	function onLegChange(leg, iframe, appOffset) {
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
			var button = $("#snow-iframe").contents().find("#overview-collections .ptr-button");
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
			var showInMapButton = $("#snow-iframe").contents().find("#composites-list .ptr-composites-composite .ptr-button:first-child");
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

	return {
		onLegChange: onLegChange,
		onTourStart: onTourStart,
		onTourStop: onTourStop
	};
});
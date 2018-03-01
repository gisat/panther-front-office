Ext.define('PumaMain.controller.DomManipulation', {
	extend: 'Ext.app.Controller',
	views: [],
	requires: [],
	init: function() {
		if (Config.exportPage) {
			return;
		}
		Observer.addListener("resizeMap",this.resizeMap.bind(this));
		$("#sidebar-reports-toggle").on("click", $.proxy(this._onReportsSidebarToggleClick, this));
		$("#sidebar-tools-toggle").on("click", $.proxy(this._onToolsSidebarToggleClick, this));
		$(window).on("resize", $.proxy(this._onWindowResize, this));
		this.control({
			"toolspanel panel" : {
				expand   : this.onToolPanelExpand,
				collapse : this.onToolPanelCollapse
			},
			"toolspanel" : {
				resize: this.onToolsResize,
				afterrender: this.onToolsResize
			},
			"window" : {
				dragstart: this.onWindowDragStart,
				dragend: this.onWindowDragEnd
			}
		});
		this.resizeMap();
		this.resizeSidebars();

        Observer.notify('DomManipulation#init');
	},

	onWindowDragStart: function() {
		$("#map-holder").append('<div id="draggingOverMapProtectionOverlay"></div>');
	},
	
	onWindowDragEnd: function(xWindow) {
		$("#draggingOverMapProtectionOverlay").remove();
		window.Stores.notify('floaters#sort', {
			fromExt: true,
			xWindow: xWindow
		});
	},

	onToolsResize: function(toolPanel) {
		this.resizeTools();
	},
	
	onToolPanelResize: function(panel) {
		this.resizeTools();
	},
	
	onToolPanelExpand: function(panel) {
		this.resizeTools();
	},
	
	onToolPanelCollapse: function(panel) {
		this.resizeTools();
	},
	
	renderApp: function() {
		$("body").removeClass("intro").addClass("application");
		window.Stores.notify("appRenderingStarted");
		this.resizeMap();
		this.resizeSidebars();
	},
	
	renderIntro: function() {
		// zatim neni potreba
        $("body").addClass("intro");
    },
	
	resizeMap: function() {
		var availableSize = this.getContentAvailableSize();
		
		var w  = availableSize.width;
		var h  = availableSize.height;
		var sw = $("#sidebar-reports").width();

		if ($("body").hasClass("application") && sw > 0) {
			w = w - sw;
			var reportsRight = $("#sidebar-reports").css("right");
			if (reportsRight){
				w = w - Number(reportsRight.slice(0,-2));
			}

		}
		
		$("#map-holder").css({width : w, height : h});
		$("#maps-container").css({width : w, height : h});
	},
	
	resizeSidebars: function() {
		this.resizeTools();
		this.resizeReports();
	},
	
	resizeTools: function() {
		if (!Config.toggles.useTopToolbar) { // TODO do we need to do something else?
			var availableSize = this.getContentAvailableSize();
			var accordeonMaxH = availableSize.height - $("#app-tools-actions").outerHeight(true) - $("#sidebar-tools-colors").outerHeight(true);
			var accordeon = Ext.ComponentQuery.query('toolspanel')[0];
			if (accordeon) {
				accordeon.maxHeight = accordeonMaxH;
				accordeon.updateLayout();
			}
			$("#sidebar-tools").css("max-height", availableSize.height);
		}
	},
	
	resizeReports: function() {
		var availableSize = this.getContentAvailableSize();
		$("#sidebar-reports").height(availableSize.height);
		if(Config.toggles.isSnow) {
			$("#app-extra-content").height(availableSize.height);
		} else {
			$("#app-reports-accordeon").height(availableSize.height - $("#app-reports-paging").outerHeight(true));
		}
	},
	
	activateMapSplit: function() {
		$("#map-holder").addClass("split");
		this.resizeMap();
	},
	
	deactivateMapSplit: function() {
		$("#map-holder").removeClass("split");
		this.resizeMap();
	},
	
	getContentAvailableSize: function() {
		var w  = $(window).width();
		var h  = $(window).height() - $("#wb-header").outerHeight(true) - $("#header").outerHeight(true) - $("#footer").outerHeight(true);

		//var h  = $(window).height();

		if ($("body").hasClass("application")) {
			if (Config.toggles.useNewViewSelector) {
				h -= $("#view-selector").outerHeight(true);
			} else {
				h -= $("#legacy-view-selector").outerHeight(true);
			}
			if (Config.toggles.useTopToolbar) {
				h -= $("#top-toolbar").outerHeight(true);
			}
			if (Config.toggles.hideSelectorToolbar){
				h += $("#view-selector").outerHeight(true);
			}
		}
		return { width  : w, height : h };
	},
	
	activateLoadingMask: function() {
		//$("#loading-mask-shim, #loading-mask").show();
		console.log('DomManipulation#activateLoadingMask Show Loading');
		$('#loading-screen').css('display', 'block');
	},
	
	deactivateLoadingMask: function() {
		//$("#loading-mask-shim, #loading-mask").hide();
		console.log('DomManipulation#activateLoadingMask Hide Loading');
		$('#loading-screen').css('display', 'none');
	},
	
	_onReportsSidebarToggleClick: function() {
		$("#sidebar-reports").toggleClass("hidden");
		$("#world-wind-map").toggleClass("charts-hidden");
		this.resizeMap();
	},

	_onReportsSidebarHide: function() {
		$("#sidebar-reports").addClass("hidden");
		$("#world-wind-map").addClass("charts-hidden");
		this.resizeMap();
	},
	
	_onToolsSidebarToggleClick: function() {
		$("#sidebar-tools").toggleClass("hidden");
	},
	
	_onWindowResize: function() {
		this.resizeMap();
		this.resizeSidebars();
	}
});

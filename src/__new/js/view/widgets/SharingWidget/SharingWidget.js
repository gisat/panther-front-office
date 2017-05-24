define([
	'../../../stores/UrbanTepPortalStore',
	'../Widget',

	'text!./SharingWidget.html',
	'css!./SharingWidget'
], function (UrbanTepPortalStore,
			 Widget,

			 htmlBody) {
	var SharingWidget = function (options) {
		Widget.call(this, options);

		this.build();

		this._url = '';
		this._name = '';
	};

	SharingWidget.prototype = Object.create(Widget.prototype);

	Object.defineProperties(SharingWidget.prototype, {
		url: {
			get: function() {
				return this._url;
			},
			set: function(url) {
				this._url = url;
			}
		}
	});

	SharingWidget.prototype.rebuild = function(){
		$('#floater-sharing .floater-body').empty();
		$('#floater-sharing .floater-body').append(
			'<div>' +
			'	<span>'+this.url+'</span>' +
			'</div>'
		);

		$('#floater-sharing .floater-footer').empty();


		if(Config.toggles.isUrbanTep) {
			// Also share name and community.
			var self = this;
			$('#floater-sharing .floater-body').append(
				'<div>' +
				'	<label>Name: <input id="sharing-name" type="text" value="'+self.name+'"/></label>' +
				'	<label>Community: <select id="sharing-community"></select></label>' +
				'</div>'
			);
			$('#floater-sharing .floater-footer').append('<div class="widget-button" id="sharing-portal">Share on the portal.</div>');

			$('#sharing-portal').off();
			$('#sharing-portal').on('click', function(){
				UrbanTepPortalStore.share(self.url, $('#floater-sharing .floater-body #sharing-name').val(), '');
			});
		}
	};

	SharingWidget.prototype.build = function() {
		this.handleLoading("hide");

		$(this._widgetSelector).find(".widget-minimise").off();
		$(this._widgetSelector).find(".widget-minimise").on("click", function(){
			$('#floater-sharing').hide();
		});

		this.rebuild();
	};

	return SharingWidget;
});
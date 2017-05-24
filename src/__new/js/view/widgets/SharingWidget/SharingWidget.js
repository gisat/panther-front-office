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
		var name = $('#floater-sharing .floater-body #sharing-name').val() || '';
		$('#floater-sharing .floater-body').empty();
		$('#floater-sharing .floater-body').append(
			'<div>' +
			'	<span>'+this.url+'</span>' +
			'</div>'
		);

		$('#floater-sharing .floater-footer').empty();


		if(Config.toggles.isUrbanTep) {
			UrbanTepPortalStore.communities().then(function(communities){
				var self = this;

				var optionsHtml = communities.map(function(community){
					return '<option value="'+community.identifier+'">'+community.title+'</option>';
				}).join(' ');
				$('#floater-sharing .floater-body').append(
					'<div>' +
					'	<div><label>Name: <input id="sharing-name" type="text" value="'+name+'"/></label></div>' +
					'	<div><label>Community: ' +
					'		<select id="sharing-community">' + optionsHtml +
					'		</select>' +
					'	</label></div>' +
					'</div>'
				);
				$('#floater-sharing .floater-footer').append('<div class="widget-button" id="sharing-portal">Share on the portal.</div>');

				$('#sharing-portal').off();
				$('#sharing-portal').on('click', function(){
					UrbanTepPortalStore.share(self.url, $('#floater-sharing .floater-body #sharing-name').val(), '');
				});
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
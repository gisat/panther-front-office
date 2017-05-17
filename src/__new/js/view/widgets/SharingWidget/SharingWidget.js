define([
	'../Widget',

	'text!./SharingWidget.html',
	'css!./SharingWidget'
], function (Widget,

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
		$('#floater-sharing .floater-body').empty();
		$('#floater-sharing .floater-body').append(
			'<div>' +
			'	<span>'+this.url+'</span>' +
			'</div>'
		);

		$('#floater-sharing .floater-footer').empty();


		if(Config.toggles.isUrbanTep) {
			$('#floater-sharing .floater-footer').append('<div class="widget-button" id="sharing-portal">Share on the portal.</div>');

			var self = this;
			$('#sharing-portal').off();
			$('#sharing-portal').on('click', function(){
				$.post('https://urban-tep.eo.esa.int/t2api/apps/puma', {
					url: self.url
				}, function(){
					alert('Application was published on the portal.');
				})
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
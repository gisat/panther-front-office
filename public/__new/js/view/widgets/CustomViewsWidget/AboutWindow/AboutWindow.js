define([
	'../../../components/Button/Button',

	'jquery',
	'underscore',
	'string',
	'text!./AboutWindow.html',
	'css!./AboutWindow'
], function(Button,
			$,
			_,
			S,
			aboutWindowHtml
			){

	/**
	 * Build content of About window in dataviews intro overlay
	 * @param options {Object}
	 * @param options.target {Object} JQuery selector of parent element
	 * @param options.onShowMapsClick {function}
	 * @constructor
	 */
	var AboutWindow = function(options){
		this._target = options.target;
		this.onShowMapsClick = options.onShowMapsClick;
		this.build();
	};

	AboutWindow.prototype.build = function(){
		var logoClass = "logo-circle";
		var logoSource = "panther/panther_logo.png";
		var title = "Panther Data Exploration";
		var text = "";
		var introClass = "";

		if (Config.toggles.intro){
			var intro = Config.toggles.intro;
			if (intro.title){
				title = intro.title;
			}
			if (intro.text){
				text = intro.text;
			}
			if (intro.logo && intro.logo.type){
				var type = intro.logo.type;
				if (type === 'rectangle'){
					logoClass = "";
				} else if (type === 'wide_rectangle'){
					logoClass = "logo-wide-rectangle";
				} else if (type === 'none'){
					introClass = "without-logo";
				}
			}
			if (intro.logo && intro.logo.source){
				logoSource = intro.logo.source;
			}
		}

		var html = S(aboutWindowHtml).template({
			introClass: introClass,
			logoSource: "__new/img/" + logoSource,
			logoClass: logoClass,
			projectName: title,
			projectAbout: text
		}).toString();
		this._target.append(html);

		this._buttonContainerSelector = this._target.find(".about-window-footer");
		this.buildShowMapsButton();
	};

	AboutWindow.prototype.buildShowMapsButton = function(){
		return new Button({
			id: 'show-maps',
			containerSelector: this._buttonContainerSelector,
			text: polyglot.t("showMaps"),
			title: polyglot.t("showMaps"),
			onClick: this.onShowMapsClick,
			textCentered: true,
			classes: 'w18 extra-large colored'
		});
	};

	return AboutWindow;
});
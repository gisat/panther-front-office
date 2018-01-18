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
		var html = S(aboutWindowHtml).template({
			logoSource: "__new/img/panther/panther_logo.png",
			logoClass: "logo-circle",
			projectName: "Panther Data Exploration",
			projectAbout: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n" +
			"\t\t\tPhasellus mollis sodales lorem, nec hendrerit mi tincidunt pellentesque.\n" +
			"\t\t\tQuisque facilisis ipsum id elit hendrerit, vitae elementum tortor elementum.\n" +
			"\t\t\tProin in pretium tellus, sit amet pretium nisi. Curabitur eget egestas mauris."
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
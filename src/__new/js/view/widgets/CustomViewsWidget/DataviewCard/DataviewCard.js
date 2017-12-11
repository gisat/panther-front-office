define(['../../../../actions/Actions',
	'../../../../error/ArgumentError',
	'../../../../util/Logger',

	'../../../components/Button/Button',

	'jquery',
	'string',
	'text!./DataviewCard.html',
	'css!./DataviewCard'
], function(Actions,
			ArgumentError,
			Logger,

			Button,

			$,
			S,
			DataviewCardHtml){

	/**
	 * @param options {Object}
	 * @param options.target {Object} JQuery selector of parent element
	 * @param options.id {number} id of the dataview
	 * @param options.name {string} name of dataview
	 * @param options.description {string} desription of dataview
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @param options.preview {Object} data for preview
	 * @param options.url {string} dataview original URL
	 * @constructor
	 */
	var DataviewCard = function(options){
		if (!options.target){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DataviewCard", "constructor", "missingTarget"));
		}
		this._target = options.target;
		this._id = options.id;
		this._name = options.name;
		this._description = options.description;
		this._dispatcher = options.dispatcher;
		this._preview = options.preview;
		this._url = options.url;

		this.build();
	};

	DataviewCard.prototype.build = function(){
		var html = S(DataviewCardHtml).template({
			id: "dataview-card-" + this._id,
			name: this._name,
			description: this._description
		}).toString();
		this._target.append(html);
		this._cardSelector = $("#dataview-card-" + this._id);

		this._cardPreviewSelector = this._cardSelector.find(".dataview-card-preview");
		this._cardPreviewSelector.css("background", this._preview.color);

		this._cardShowButton = this.buildShowButton();
	};

	/**
	 * Build button for show the dataview
	 * @returns {Button}
	 */
	DataviewCard.prototype.buildShowButton = function(){
		return new Button({
			id: "dataview-card-" + this._id + "-button-show",
			containerSelector: this._cardSelector.find(".dataview-card-buttons"),
			text: polyglot.t("show"),
			onClick: this.onShowButtonClick.bind(this),
			textCentered: true,
			textSmall: true,
			classes: "w6"
		});
	};

	/**
	 * Show dataview on click
	 */
	DataviewCard.prototype.onShowButtonClick = function(options){
		this._dispatcher.notify("dataview#show", options);

		// TODO upgrade this provisional solution
		window.location = this._url;
	};

	return DataviewCard;
});
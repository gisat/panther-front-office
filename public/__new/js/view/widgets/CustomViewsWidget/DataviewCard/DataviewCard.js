define(['../../../../actions/Actions',
	'../../../../error/ArgumentError',
	'../../../../util/Logger',
	'../../../../util/RemoteJQ',

	'../../../components/Button/Button',

	'jquery',
	'string',
	'text!./DataviewCard.html',
	'css!./DataviewCard'
], function(Actions,
			ArgumentError,
			Logger,
			Remote,

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
	 * @param options.hasTools {boolean} if true, tools will be displayed
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
		this._hasTools = options.hasTools;

		this.build();
	};

	DataviewCard.prototype.build = function(){
		var html = S(DataviewCardHtml).template({
			id: this._id,
			name: this._name,
			description: this._description,
			deleteTitle: polyglot.t("delete"),
			urlTitle: polyglot.t("URL")
		}).toString();
		this._target.append(html);
		this._cardSelector = $("#dataview-card-" + this._id);

		this._cardPreviewSelector = this._cardSelector.find(".dataview-card-preview");
		this._cardPreviewSelector.css("background-image", this._preview.background);
		this._cardToolsSelector = this._cardSelector.find(".dataview-card-tools");

		if (!this._hasTools){
			this._cardToolsSelector.css("display", "none");
		}

		this.addOnCardClickListener();
		this.addOnShowUrlClickListener();
		this.addDeleteOnClickListener();
	};

	/**
	 * Remove Dataview Card from DOM
	 */
	DataviewCard.prototype.removeCard = function(){
		this._cardSelector.remove();
	};

	DataviewCard.prototype.addOnCardClickListener = function(){
		this._cardSelector.off("click.card").on("click.card", this.onShowButtonClick.bind(this));
		this._cardToolsSelector.click(function(e) {
			e.stopPropagation();
		});
	};

	/**
	 * Show dataview on click
	 */
	DataviewCard.prototype.onShowButtonClick = function(){
		// TODO upgrade this provisional solution
		window.location = this._url;
	};

	DataviewCard.prototype.addOnShowUrlClickListener = function(){
		var self = this;
		this._cardSelector.find(".fa-link").off("click.customViewLink").on("click.customViewLink", function(){
			// todo better popup window
			window.alert(self._url);
		});
	};

	/**
	 * Delete dataview on delete icon click
	 */
	DataviewCard.prototype.addDeleteOnClickListener = function(){
		var self = this;
		this._cardSelector.find(".fa-trash-o").off("click.deleteDataview").on("click.deleteDataview", function(){
			var id = $(this).parents(".dataview-card").attr("data-for");
			if (window.confirm(polyglot.t("dataviewDeleteConfirmText"))) {
				new Remote({
					url: "rest/customview/delete",
					params: {
						id: Number(id)
					}
				}).get().then(function(result){
					if (result.status === "Ok"){
						self.removeCard();
					}
				}).catch(function(err){
					console.error(err);
				});
			}
		});
	};

	return DataviewCard;
});
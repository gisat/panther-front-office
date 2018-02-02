define([
	'../../../actions/Actions',
	'../../../stores/gisat/Groups',
	'../../../stores/Stores',
	'../../../stores/UrbanTepPortalStore',
    '../../../stores/gisat/Users',
    '../Widget',

	'../../components/Button/Button',
	'../../../util/Promise',

	'jquery',
	'string',
	'text!./SharingWidget.html',
	'css!./SharingWidget'
], function (Actions,
			 Groups,
			 Stores,
			 UrbanTepPortalStore,
			 Users,
			 Widget,

			 Button,
			 Promise,

			 $,
			 S,
			 SharingWidgetHtml) {
	var SharingWidget = function (options) {
		Widget.call(this, options);

		this.build();

		this._url = '';
		this._dispatcher = options.dispatcher;
		this._dispatcher.addListener(this.onEvent.bind(this));
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
		this.handleLoading("show");

		$('#floater-sharing .floater-body').empty();

        var self = this;
		Promise.all([
			Groups.all(),
			Users.all()
		]).then(function(results){
			var groups = results[0];
			var users = results[1];

			self.addWidgetContent(groups, users);
			self.handleLoading("hide");
		}).catch(function(error){
			console.error(error);
			alert(polyglot.t('itWasntPossibleToLoadGroupsUsers') + error);
			self.handleLoading("hide");
		});
	};

	/**
	 * Add content to widget body and footer
	 * @param groups
	 * @param users
	 */
	SharingWidget.prototype.addWidgetContent = function(groups, users){
		var groupOptions = groups.map(function(group){
			return '<option value="'+group.id+'">' + group.name + '</option>';
		});
		groupOptions.unshift('<option value=""></option>');
		var userOptions = users.map(function(user){
			return '<option value="'+user.id+'">' + user.name + '</option>';
		});
		userOptions.unshift('<option value=""></option>');


		var content = S(SharingWidgetHtml).template({
			dataviewMetadataTitle: polyglot.t('sharingMetadataTitle'),
			dataviewMetadataDescription: polyglot.t('sharingMetadataDescription'),
			nameLabel: polyglot.t('sharingNameLabel'),
			descriptionLabel: polyglot.t('sharingDescriptionLabel'),
			langLabel: polyglot.t('sharingLangLabel'),
			permissionsTitle: polyglot.t('sharingPermissionsTitle'),
			permissionsDescription: polyglot.t('sharingPermissionsDescription'),
			userLabel: polyglot.t('sharingUserLabel'),
			userOptions: userOptions,
			groupLabel: polyglot.t('sharingGroupLabel'),
			groupOptions: groupOptions
		}).toString();

		$('#floater-sharing .floater-body').html(content);
		$('#floater-sharing .floater-footer').empty();
		this.buildSaveButton();
	};

	/**
	 * Build button for save the dataview
	 * @returns {Button}
	 */
	SharingWidget.prototype.buildSaveButton = function(){
		return new Button({
			id: "sharing",
			containerSelector: this._widgetSelector.find(".floater-footer"),
			text: polyglot.t("share"),
			onClick: this.onShareClick.bind(this),
			textCentered: true,
			textSmall: false,
			classes: "w8"
		});
	};

	/**
	 * Execute on share button click
	 */
	SharingWidget.prototype.onShareClick = function(){
		var name = $( "#floater-sharing .floater-body #sharing-name" ).val();
		var description = $( "#floater-sharing .floater-body #sharing-description" ).val();
		var language = $( "#floater-sharing .floater-body #sharing-lang option:checked" ).val();
		var state = Stores.retrieve("state").currentExtended();

		Observer.notify("PumaMain.controller.ViewMng.onShare", {
			state: state,
			name: name,
			language: language,
			description: description
		});
	};

	/**
	 * Show url on share click
	 * @param options {Object}
	 */
	SharingWidget.prototype.showUrl = function(options){
		var selectedGroup = $( "#floater-sharing .floater-body #sharing-group option:checked" ).val();
		var selectedUser = $( "#floater-sharing .floater-body #sharing-user option:checked" ).val();
		var minimiseBtn = this._widgetSelector.find(".widget-minimise");
		var state = Stores.retrieve("state").currentExtended();
		var self = this;
		Promise.all([
			Groups.share(selectedGroup, state.scope, state.places, options.dataviewId),
			Users.share(selectedUser, state.scope, state.places, options.dataviewId)
		]).then(function(){
			var auth = "&needLogin=true";
			if (Config.auth && selectedGroup === '2'){
				auth = "";
			}
			self._url = options.url + auth +'&lang=' + $( "#floater-sharing .floater-body #sharing-lang option:checked" ).val();
			alert(polyglot.t('theStateWasCorrectlyShared') + self._url);
			minimiseBtn.trigger("click");
			self.rebuild();
			self._dispatcher.notify("sharing#viewShared");
		}).catch(function(error){
			alert(polyglot.t('thereWasAnIssueWithSharing') + error);
		});
	};

	/**
	 * Add minimise on click listener
	 */
	SharingWidget.prototype.build = function() {
		this.handleLoading("hide");

		var self = this;
		this._widgetSelector.find(".widget-minimise").off().on("click", function(){
			var item = $('#top-toolbar-share-view');
			if (self._widgetSelector.hasClass("open")){
				item.removeClass("open");
				self._widgetSelector.removeClass("open");
			} else {
				item.addClass("open");
				self._widgetSelector.addClass("open");
			}
		});

		this.rebuild();
	};

	/**
	 * @param type {string} type of event
	 * @param options {Object|string}
	 */
	SharingWidget.prototype.onEvent = function(type, options){
		if (type === Actions.sharingUrlReceived){
			this.showUrl(options);
		}
	};

	return SharingWidget;
});
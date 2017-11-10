define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/RemoteJQ',

	'../../../stores/Stores',
	'../Widget',

	'jquery',
	'string',
	'text!./SnowRegistration.html',
	'css!./SnowRegistration'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,
			RemoteJQ,

			Stores,
			Widget,

			$,
			S,
			SnowRegistrationHtml
){
	/**
	 * Class representing widget for registration to snow portal
	 * @param options {Object}
	 * @constructor
	 */
	var SnowRegistration = function(options){
		Widget.apply(this, arguments);

		this.rebuild();
		this._dispatcher = options.dispatcher;
		this._dispatcher.addListener(this.onEvent.bind(this));

	};

	SnowRegistration.prototype = Object.create(Widget.prototype);

	/**
	 * Rebuild widget. If period or scope has been changed, redraw widget. The change of scope basicaly means the change
	 * in a Scope select in a top bar (or an initial selection of scope). It is the same for the selection of period or any
	 * other change visualization/theme/place/level
	 *
	 * For info about detection of changes see: FrontOffice.js#rebuild
	 */

	SnowRegistration.prototype.rebuild = function(){
		this._widgetBodySelector.html("");
		var html = S(SnowRegistrationHtml).template().toString();
		this._widgetBodySelector.append(html);
		this.handleLoading("hide");

		this._confirmSelector = $("#snow-reg-submit");
		this._emailSelector = $("#snow-reg-email");
		this._passwordSelector = $("#snow-reg-password");
		this._passwordCheckSelector = $("#snow-reg-password-check");
		this._infoSelector = $("#snow-reg-info");

		this.addConfirmButtonListener();
	};

	/**
	 * Confirm form and execute endpoint request
	 */
	SnowRegistration.prototype.confirmForm = function(){
		var validation = this.validateForm();
		var self = this;
		if (validation.status === "ok"){
			new RemoteJQ({
				url: "api/snowportal/registration",
				params: {
					email: validation.email,
					password: validation.password,
					username: validation.email
				}
			}).post().then(function(results){
				if (results.success){
					self.displayValidationInfo(validation.status);
				} else {
					self.displayValidationInfo("error", results.message);
				}
			}).catch(function(response){
				self.displayValidationInfo("error", response.message);
			});
		} else {
			this.displayValidationInfo(validation.status);
		}
	};

	/**
	 * Display info about validation
	 * @param status {string}
	 * @param msg {string}
	 */
	SnowRegistration.prototype.displayValidationInfo = function(status, msg){
		var message = "Registration was succesfull!";

		if (status === "error"){
			message = msg;
		}
		if (status === "missing email"){
			message = "Fill out email!";
		}
		if (status === "wrong email"){
			message = "Incorrect form of e-mail address!";
		}
		if (status === "missing password"){
			message = "Fill in the password!";
		}
		if (status === "wrong password"){
			message = "Passwords must have at least 6 characters (0-9, a-z, A-Z)!"
		}
		if (status === "password mismatch"){
			message = "Passwords are different!"
		}
		this._infoSelector.find("span").html(message);
		if (status === "ok"){
			this._infoSelector.removeClass("error");
		} else {
			this._infoSelector.addClass("error");
		}
	};

	/**
	 * Validate the form
	 * @returns {Object}
	 */
	SnowRegistration.prototype.validateForm = function(){
		var email = this._emailSelector.val();
		var psw = this._passwordSelector.val();
		var pswCheck = this._passwordCheckSelector.val();
		var response = {
			status: "ok",
			email: email,
			password: psw
		};

		if (!email){
			response.status = "missing email";
		}
		if (email.indexOf("@") === -1){
			response.status = "wrong email"
		} else {
			var parts = email.split("@");
			if (parts[0].length < 1 || parts[1].length < 1){
				response.status = "wrong email";
			}
		}
		if (!psw || !pswCheck){
			response.status = "missing password";
		}
		if (psw !== pswCheck){
			response.status = "password mismatch";
		}

		var pswValidation = psw.match(/[a-zA-Z0-9_]{6,}/);
		var pswCheckValidation = pswCheck.match(/[a-zA-Z0-9_]{6,}/);
		if (!pswValidation || !pswCheckValidation){
			response.status = "wrong password";
		}
		return response;
	};

	/**
	 * Execute on Sign up button in top tool bar click
	 */
	SnowRegistration.prototype.onSignUpClick = function(){
		if (this._widgetSelector.hasClass("open")){
			this._widgetSelector.removeClass("open");
		} else {
			this._widgetSelector.addClass("open active");
		}
	};

	/**
	 * Add on click listener to confirm button
	 */
	SnowRegistration.prototype.addConfirmButtonListener = function(){
		this._confirmSelector.off("click.registration").on("click.registration", this.confirmForm.bind(this));
	};

	/**
	 * @param type {string}
	 */
	SnowRegistration.prototype.onEvent = function (type) {
		if (type === Actions.showSnowRegistration){
			this.onSignUpClick();
			this.rebuild();
		}
		if (type === Actions.userChanged){
			this._widgetSelector.removeClass("open").removeClass("active");
		}
	};

	return SnowRegistration;
});
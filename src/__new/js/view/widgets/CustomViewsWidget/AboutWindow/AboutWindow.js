define([
	'jquery',
	'underscore',
	'string',
	'text!./AboutWindow.html',
	'css!./AboutWindow'
], function($,
			_,
			S,
			aboutWindowHtml
			){

	/**
	 * Build content of About window in dataviews intro overlay
	 * @param options {Object}
	 * @param options.target {Object} JQuery selector of parent element
	 * @constructor
	 */
	var AboutWindow = function(options){
		this._target = options.target;
		this.build();
	};

	AboutWindow.prototype.build = function(){
		var html = S(aboutWindowHtml).template({
			logoSource: "__new/img/panther/panther_logo.png"
		}).toString();
		this._target.append(html);
	};

	return AboutWindow;
});
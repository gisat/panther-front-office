/**
 * Basic observer global object for Ext-Require communication
 * @type {{listeners: Array}}
 */

var Observer = {
	listeners: []
};

Observer.addListener = function(listener) {
	Observer.listeners.push(listener);
};

Observer.notify = function(event){
	Observer.listeners.forEach(function(listener){
		listener(event);
	});
};
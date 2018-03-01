/**
 * Basic observer global object for Ext-Require communication
 * @type {{listeners: Array}}
 */

var Observer = {
	listeners: []
};

Observer.addListener = function(flag, listener) {
	Observer.listeners.push({
		flag: flag,
		listener: listener
	});
};

Observer.notify = function(event, options){
	Observer.listeners.forEach(function(lst){
		if (event == lst.flag){
			lst.listener(options);
		}
	});
};
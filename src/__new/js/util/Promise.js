define(['../../lib/es6-promise'], function(PromiseEs6){
	if(window.Promise) {
		return window.Promise;
	} else {
		return PromiseEs6.Promise;
	}
});
define(['./Stores'], function(Stores){
	var urbanTepPortal;

	var UrbanTepPortalStore = function() {

	};

	UrbanTepPortalStore.prototype.communities = function() {
		return $.get('https://urban-tep.eo.esa.int/t2api/apps/puma'); // TODO: Update once there is version ready
	};

	UrbanTepPortalStore.prototype.share = function(url, name, community) {
		$.post('https://urban-tep.eo.esa.int/t2api/apps/puma', {
			url: url,
			name: name,
			community: community
		}, function(){
			alert('Application was published on the portal.');
		})
	};

	if(!urbanTepPortal) {
		urbanTepPortal = new UrbanTepPortalStore();
		Stores.register('urbanTepPortal', urbanTepPortal);
	}
	return urbanTepPortal;
});
define(['./Stores'], function(Stores){
	var urbanTepPortal;

	var UrbanTepPortalStore = function() {

	};

	UrbanTepPortalStore.prototype.communities = function() {
		return $.get('https://urban-tep.eo.esa.int/t2api/community/search?status=joined&format=json').then(function(result){
			return result.features.map(function(feature){
				return {
					title: feature.title,
					identifier: feature.identifier
				}
			})
		});
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
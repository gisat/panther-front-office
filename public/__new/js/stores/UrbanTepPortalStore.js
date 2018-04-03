define(['jquery','./UrbanTepCommunitiesStore'], function ($, UrbanTepCommunitiesStore) {
    var UrbanTepPortalStore = function () {

    };

    UrbanTepPortalStore.communities = function () {
        return $.get('https://urban-tep.eo.esa.int/t2api/community/search?status=joined&format=json').then(function (result) {
            return result.features.map(function (feature) {
                return {
                    title: feature.properties.title,
                    identifier: feature.properties.identifier
                }
            })
        });
    };

	UrbanTepPortalStore.share = function (url, name, community) {
		$.post('https://urban-tep.eo.esa.int/t2api/apps/puma', {
			url: url,
			name: name,
			community: community
		}, function () {
			UrbanTepCommunitiesStore.share(url, community);
			alert('Application was published on the portal.');
		})
	};

    return UrbanTepPortalStore;
});
define(['jquery'], function($){
    var UrbanTepCommunitiesStore = function() {

    };

    UrbanTepCommunitiesStore.update = function(communities) {
        return $.post(Config.url + '/rest/communities', {
            communities: communities
        });
    };

	UrbanTepCommunitiesStore.share = function(url, community) {
		url = new URL(url);
		return $.post(Config.url + '/rest/share/communities', {
			dataViewId: url.searchParams.get('id'),
			group: community
		});
	};

    return UrbanTepCommunitiesStore;
});
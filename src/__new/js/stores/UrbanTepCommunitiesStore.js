define(['./Stores'], function(Stores){
    var urbanTepCommunities;

    var UrbanTepCommunitiesStore = function() {

    };

    UrbanTepCommunitiesStore.prototype.update = function(communities) {
        return $.post(Config.url + '/rest/communities', {
            communities: communities
        });
    };

    UrbanTepCommunitiesStore.prototype.share = function(url, community) {
        var url = new URL(url);
        return $.post(Config.url + '/rest/share/communities', {
            dataViewId: url.searchParams.get('id'),
            group: community.identifier
        });
    };

    if(!urbanTepCommunities) {
        urbanTepCommunities = new UrbanTepCommunitiesStore();
        Stores.register('urbanTepCommunities', urbanTepCommunities);
    }
    return urbanTepCommunities;
});
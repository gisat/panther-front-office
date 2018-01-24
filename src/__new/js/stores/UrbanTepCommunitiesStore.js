define(['./Stores'], function(Stores){
    var urbanTepCommunities;

    var UrbanTepCommunitiesStore = function() {

    };

    UrbanTepCommunitiesStore.prototype.update = function(communities) {
        return $.post(Config.url + '/rest/communities', {
            communities: communities
        });
    };

    if(!urbanTepCommunities) {
        urbanTepCommunities = new UrbanTepCommunitiesStore();
        Stores.register('urbanTepCommunities', urbanTepCommunities);
    }
    return urbanTepCommunities;
});
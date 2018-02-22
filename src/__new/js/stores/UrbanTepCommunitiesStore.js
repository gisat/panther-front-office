define([], function(){
    var UrbanTepCommunitiesStore = function() {

    };

    UrbanTepCommunitiesStore.prototype.update = function(communities) {
        return $.post(Config.url + '/rest/communities', {
            communities: communities
        });
    };

    return UrbanTepCommunitiesStore;
});


class UrbanTepCommunitiesStore {
    update(communities) {
        return $.post(Config.url + '/rest/communities', {
            communities: communities
        });
    };
}

export default UrbanTepCommunitiesStore;
let $ = window.$;

class UrbanTepCommunitiesStore {
    static update(communities) {
        return $.post(window.Config.url + '/rest/communities', {
            communities: communities
        });
    };

    static share(url, community) {
        url = new URL(url);
        return $.post(window.Config.url + '/rest/share/communities', {
            dataViewId: url.searchParams.get('id'),
            group: community
        });
    }
}

export default UrbanTepCommunitiesStore;
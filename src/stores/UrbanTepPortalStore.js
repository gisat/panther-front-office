import UrbanTepCommunitiesStore from './UrbanTepCommunitiesStore';
let $ = window.$;

class UrbanTepPortalStore {
    static communities() {
        return $.get('https://urban-tep.eo.esa.int/t2api/community/search?status=joined&format=json').then(function (result) {
            return result.features.map(function (feature) {
                return {
                    title: feature.properties.title,
                    identifier: feature.properties.identifier
                }
            })
        });
    };

    static share(url, name, community) {
        $.post('https://urban-tep.eo.esa.int/t2api/apps/puma', {
            url: url,
            name: name,
            community: community
        }, function () {
            UrbanTepCommunitiesStore.share(url, community);
            alert('Application was published on the portal.');
        })
    };
}

window.UrbanTepPortalStore = UrbanTepPortalStore;

export default UrbanTepPortalStore;
let $ = window.$;

class UrbanTepPortalStore {
    static share(url, name, description, community) {
        return $.post('https://urban-tep.eu/t2api/apps/puma', {
            url: url,
            name: name,
            description: description,
            community: community
        })
    };
}

export default UrbanTepPortalStore;
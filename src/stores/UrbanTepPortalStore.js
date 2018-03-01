

class UrbanTepPortalStore {
    communities() {
        return $.get('https://urban-tep.eo.esa.int/t2api/community/search?status=joined&format=json').then(function (result) {
            return result.features.map(function (feature) {
                return {
                    title: feature.properties.title,
                    identifier: feature.properties.identifier
                }
            })
        });
    };
}

export default UrbanTepPortalStore;
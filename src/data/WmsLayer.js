import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class WmsLayer extends Model {

    data() {
        return {
            id: {
                serverName: 'id'
            },
            name: {
                serverName: 'name'
            },
            layer: {
                serverName: 'layer'
            },
            url: {
                serverName: 'url'
            },
            scope: {
                serverName: 'scope'
            },
            locations: {
                serverName: 'places'
            },
            periods: {
                serverName: 'periods'
            },
            permissions: {
                serverName: 'permissions'
            },
            custom: {
                serverName: 'custom'
            }
        };
    };
}

export default WmsLayer;
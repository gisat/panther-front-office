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
                serverName: 'id',
                transformToLocal: Number
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
                serverName: 'scope',
                transformToLocal: Number
            },
            locations: {
                serverName: 'places',
                transformToLocal: objects => {
                    return objects.map(obj => Number(obj))
                }
            },
            periods: {
                serverName: 'periods',
                transformToLocal: objects => {
                    return objects.map(obj => Number(obj))
                }
            },
            permissions: {
                serverName: 'permissions'
            },
            custom: {
                serverName: 'custom'
            },
            getDates: {
                serverName: 'getDates'
            }
        };
    };
}

export default WmsLayer;
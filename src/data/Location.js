import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class Location extends Model {
    data() {
        return {
            id: {
                serverName: '_id',
                transformToLocal: Number
            },
            name: {
                serverName: 'name'
            },
            bbox: {
                serverName: 'bbox'
            },
            dataset: {
                serverName: 'dataset',
                transformToLocal: Number
            },
            geometry: {
                serverName: 'geometry'
            },
            changeReviewGeometryBefore: {
                serverName: 'changeReviewGeometryBefore'
            },
            changeReviewGeometryAfter: {
                serverName: 'changeReviewGeometryAfter'
            }
        };
    };
}

export default Location;
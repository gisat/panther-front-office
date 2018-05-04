import BaseStore from '../BaseStore';
import Location from '../../data/Location';

class Locations extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(locationData) {
        return new Location({data: locationData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/location";
    }

    loaded(models) {
        window.Stores.notify("PLACES_LOADED", models);
    }
}

export default Locations;
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

	onEvent(type, data){
		if (type === "REDUX_PLACES_ADD"){
			if (data.length){
				this.addFromRedux(data);
			}
		}
	}
}

export default Locations;
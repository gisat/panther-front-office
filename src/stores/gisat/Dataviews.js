import BaseStore from '../BaseStore';
import Dataview from '../../data/Dataview';

class Dataviews extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(dataviewData) {
        return new Dataview({data: dataviewData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/views";
    }

	loaded(models) {
		window.Stores.notify("VIEWS_LOADED", models);
	}
}

export default Dataviews;
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
        return "rest/dataview";
    }
}

export default Dataviews;
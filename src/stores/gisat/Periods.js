import BaseStore from '../BaseStore';
import Period from '../../data/Period';

class Periods extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(periodData) {
        return new Period({data: periodData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/year";
    }

    loaded(models) {
        window.Stores.notify("PERIODS_LOADED", models);
    }
}

export default Periods;
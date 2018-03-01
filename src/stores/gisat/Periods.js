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
}

export default Periods;
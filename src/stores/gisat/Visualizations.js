import BaseStore from '../BaseStore';
import Visualization from '../../data/Visualization';

class Visualizations extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(themeData) {
        return new Visualization({data: themeData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/visualization";
    }
}

export default Visualizations;

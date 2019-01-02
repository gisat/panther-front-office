import BaseStore from '../BaseStore';
import Visualization from '../../data/Visualization';

class Visualizations extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(visualizationsData) {
        return new Visualization({data: visualizationsData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/visualization";
    }
}

export default Visualizations;

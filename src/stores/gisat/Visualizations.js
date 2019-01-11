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

	onEvent(type, data){
		if (type === "REDUX_VISUALIZATIONS_ADD"){
			if (data.length){
				this.addFromRedux(data);
			}
		}
	}
}

export default Visualizations;

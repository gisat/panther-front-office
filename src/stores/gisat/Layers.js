import BaseStore from '../BaseStore';
import Layer from '../../data/Layer';

class Layers extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(layerData) {
        return new Layer({data: layerData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/layer";
    }
}

export default Layers;
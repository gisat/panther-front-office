import BaseStore from '../BaseStore';
import WmsLayer from '../../data/WmsLayer';

class WmsLayers extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(wmsLayerData) {
        return new WmsLayer({data: wmsLayerData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/wms/layers";
    }
}

export default WmsLayers;
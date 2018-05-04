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
        return "rest/wms/layer";
    }

    loaded(models) {
        window.Stores.notify("WMS_LAYERS_LOADED", models);
    }
}

export default WmsLayers;
import BaseStore from '../BaseStore';
import Attribute from '../../data/Attribute';

class Attributes extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(attributeData) {
        return new Attribute({data: attributeData});
    };

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/attribute";
    }

    loaded(models) {
        window.Stores.notify("ATTRIBUTES_LOADED", models);
    }
}

export default Attributes;
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
    };
}

export default Attributes;
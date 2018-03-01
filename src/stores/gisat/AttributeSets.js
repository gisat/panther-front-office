import BaseStore from '../BaseStore';
import AttributeSet from '../../data/AttributeSet';

class AttributeSets extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(attributeSetData) {
        return new AttributeSet({data: attributeSetData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/attributeset";
    }
}

export default AttributeSets;
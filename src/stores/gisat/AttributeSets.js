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

    loaded(models) {
        window.Stores.notify("ATTRIBUTE_SETS_LOADED", models);
    }
}

export default AttributeSets;
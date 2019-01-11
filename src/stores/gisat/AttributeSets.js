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

	onEvent(type, data){
		if (type === "REDUX_ATTRIBUTE_SETS_ADD"){
			if (data.length){
				this.addFromRedux(data);
			}
		}
	}
}

export default AttributeSets;
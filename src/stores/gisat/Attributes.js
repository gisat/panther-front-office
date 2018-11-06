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

	onEvent(type, data){
		if (type === "REDUX_ATTRIBUTES_ADD"){
			if (data.length){
				this.addFromRedux(data);
			}
		}
	}
}

export default Attributes;
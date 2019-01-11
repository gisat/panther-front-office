import BaseStore from '../BaseStore';
import Scope from '../../data/Scope';

class Scopes extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(scopeData) {
        return new Scope({data: scopeData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/dataset";
    }

    onEvent(type, data){
        if (type === "REDUX_SCOPES_ADD"){
            if (data.length){
                this.addFromRedux(data);
            }
        }
    }
}

export default Scopes;
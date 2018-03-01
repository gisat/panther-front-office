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
}

export default Scopes;
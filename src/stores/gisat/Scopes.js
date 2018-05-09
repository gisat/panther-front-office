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

    loaded(models) {
        window.Stores.notify("SCOPES_LOADED", models);
    }
}

export default Scopes;
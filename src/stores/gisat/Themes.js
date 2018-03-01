import BaseStore from '../BaseStore';
import Theme from '../../data/Theme';

class Themes extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(themeData) {
        return new Theme({data: themeData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/theme";
    }
}

export default Themes;
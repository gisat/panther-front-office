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

	onEvent(type, data){
		if (type === "REDUX_THEMES_ADD"){
			if (data.length){
				this.addFromRedux(data);
			}
		}
	}
}

export default Themes;
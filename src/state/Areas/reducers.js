import {combineReducers} from "redux";

import areaTreeLevels from "./AreaTreeLevels/reducers";
import areaTrees from "./AreaTrees/reducers";

export default combineReducers({
	areaTreeLevels,
	areaTrees
});
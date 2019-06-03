import {combineReducers} from "redux";

import casesReducers from "./cases/reducers";
import scenariosReducers from "./scenarios/reducers";

export default combineReducers({
	cases: casesReducers,
	scenarios: scenariosReducers
});
import {utils} from "panther-utils"
import {commonActionTypesDefinitions} from "../../../constants/ActionTypes";

export const tacrAgritasActionTypesDefinitions = {
	TACR_AGRITAS_DATA: {
		ADD: null,
	}
};

export default utils.deepKeyMirror({...commonActionTypesDefinitions, ...tacrAgritasActionTypesDefinitions});


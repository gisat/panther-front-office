import {utils} from '@gisatcz/ptr-utils'
import {commonActionTypesDefinitions} from '@gisatcz/ptr-state';

export const tacrAgritasActionTypesDefinitions = {
	TACR_AGRITAS_DATA: {
		ADD: null,
	}
};

export default utils.deepKeyMirror({...commonActionTypesDefinitions, ...tacrAgritasActionTypesDefinitions});


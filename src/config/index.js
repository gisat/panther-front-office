/**
 * CONFIG LOGIC - NOT FOR CONFIGURATION VALUES
 */

import _ from 'lodash';

/**
 * DEFAULT VALUES (fallback)
 * Used if not specified in rewrites.
 */
import {configDefaults} from '@gisatcz/ptr-core';
/**
 * CONFIG PROPER
 * Per-instance values, development values & features.
 */
import rewrites from './rewrites';

let url = window.location.origin;
let validConfigurationUpdate = {};
for(let configKey in rewrites) {
	if(rewrites[url] && rewrites[url][configKey]){
		validConfigurationUpdate[configKey] = rewrites[url][configKey];
	}else {
		validConfigurationUpdate[configKey] = rewrites[configKey];
	}
}

let config = _.merge({}, configDefaults, validConfigurationUpdate);
export default config;

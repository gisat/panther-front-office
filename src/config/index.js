/**
 * CONFIG LOGIC - NOT FOR CONFIGURATION VALUES
 */

import _ from 'lodash';

/**
 * DEFAULT VALUES (fallback)
 * Used if not specified in rewrites.
 */
import defaults from './defaults';
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

let config = _.merge({}, defaults, validConfigurationUpdate);
export default config;

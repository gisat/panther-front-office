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


let config = _.merge({}, defaults, rewrites);
export default config;

import WorldWind from '@nasaworldwind/worldwind';

import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import Cache from "../Cache";
import MyOsmLayer from "./MyOsmLayer";

/**
 * Class extending MyOsmLayer.
 * @param options.source {string} source URL
 * @augments MyOsmLayer
 * @constructor
 */
class MyOsmCartoLayer extends MyOsmLayer {
	constructor(options) {
		super(options);
		this.tileCache = null;
	};

	buildPrefix(prefixes){
		let data = prefixes.data;
		let prefix = prefixes.prefix;
		if (data && prefix){
			let index = Math.floor((Math.random() * data.length));
			return prefix + data[index] + ".";
		} else {
			return "";
		}
	}
}

export default MyOsmCartoLayer;


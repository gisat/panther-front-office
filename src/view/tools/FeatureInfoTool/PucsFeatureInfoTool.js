import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import LayerInfoTool from './LayerInfoTool';
import PucsFeatureInfoWindow from './PucsFeatureInfoWindow';

let polyglot = window.polyglot;

/**
 *
 * @param options {Object}
 * @param options.store {Object}
 * @param options.store.map {MapStore}
 * @param options.store.state {StateStore}
 * @constructor
 */
class PucsFeatureInfoTool extends LayerInfoTool {
	constructor(options) {
		super(options);
	};

	rebuild() {
	};


	buildInfoWindow() {
		return new PucsFeatureInfoWindow({
			target: this._floaterTarget,
			id: this._id + "-window",
			title: polyglot.t("featureInfo"),
			store: {
				state: this._store.state,
				map: this._store.map
			}
		});
	};
}

export default PucsFeatureInfoTool;
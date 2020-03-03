var path = require('path');

module.exports = function override(config, env) {
	// TODO comment when using package from npm
	config.resolve = {
		alias: {
			// "@gisatcz/ptr-charts": "C:/Users/pvlach/DATA/ptr-charts/dist",
			// "@gisatcz/ptr-maps": "C:/Users/pvlach/DATA/ptr-maps/dist",
			// "@gisatcz/ptr-state": "C:/Users/pvlach/DATA/ptr-state/dist",
			// "@gisatcz/ptr-deprecated": "C:/Users/pvlach/DATA/ptr-deprecated/dist",
		}
	};

	return config;
};
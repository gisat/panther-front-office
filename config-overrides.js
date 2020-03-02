var path = require('path');

module.exports = function override(config, env) {
	//do stuff with the webpack config...

	config.resolve = {
		alias: {
			"@gisatcz/ptr-charts": "C:/Users/pvlach/DATA/ptr-charts/dist",
		}
	};

	return config;
};
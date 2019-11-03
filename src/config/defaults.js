/**
 * DEFAULT CONFIG VALUES FOR ALL INSTANCES
 *
 * Default values only.
 * Do not use this file for development, per-instance config, etc.
 */
//import legacyConfig from '../../public/config';

export default {

	// legacy: Config

	apiGeoserverWFSProtocol: 'http',
	apiGeoserverWFSHost: 'localhost',
	apiGeoserverWFSPath: 'geoserver/wfs',

	apiGeoserverWMSProtocol: 'http',
	apiGeoserverWMSHost: 'localhost',
	apiGeoserverWMSPath: 'geoserver/wms',

	apiGeoserverOWSPath: 'backend/geoserver/ows',

	apiBackendProtocol: 'http',
	apiBackendHost: 'localhost',
	apiBackendPath: '',
	apiBackendAoiLayerPeriodsPath: 'backend/rest/imagemosaic/getDates',
	apiBackendSzifPath: 'backend/rest/szif/case',

	devHostnames: [],
	
	requestPageSize: 10,

	pucsInputVectorTemplateId: 3332,
	pucsOutputRasterHwdTemplateId: 4092,
	pucsOutputRasterUhiTemplateId: 4091

};

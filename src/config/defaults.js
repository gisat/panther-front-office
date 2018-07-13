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

	apiGeoserverOWSPath: 'geoserver/geonode/ows',

	apiBackendProtocol: 'http',
	apiBackendHost: 'localhost',
	apiBackendAoiLayerPeriodsPath: 'backend/rest/imagemosaic/getDates',
	apiBackendSzifPath: 'backend/rest/szif/case',

    geoServerUrl: 'http://192.168.2.205/geoserver/',
    serverUrl: 'http://192.168.2.205/backend/',

	pucsInputVectorTemplateId: 3332,
	pucsOutputRasterHwdTemplateId: 4092,
	pucsOutputRasterUhiTemplateId: 4091

};

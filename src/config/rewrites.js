/**
 * CONFIG
 *
 * Per-instance values, development values & features.
 * See documentation in ./defaults.js
 * Versions/variants managed in github.com/gisat/docker/
 */

export default {
    geoServerUrl: 'http://192.168.2.205/geoserver/',
    serverUrl: 'http://192.168.2.205/backend/',

    apiGeoserverWFSProtocol: 'http',
    apiGeoserverWFSHost: 'panther.gisat.cz',
    apiGeoserverWFSPath: 'geoserver/geonode/wfs',

    apiBackendProtocol: 'http',
    apiBackendHost: 'panther.gisat.cz',
    apiBackendAoiLayerPeriodsPath: 'backend/rest/imagemosaic/getDates',
    apiBackendSzifPath: 'backend/rest/szif/case',

    hasPeriodsSelector: true
};

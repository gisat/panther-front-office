/**
 * CONFIG
 *
 * Per-instance values, development values & features.
 * See documentation in ./defaults.js
 * Versions/variants managed in github.com/gisat/docker/
 */

export default {
    // geoServerUrl: 'http://panther.gisat.cz/geoserver/',
    // serverUrl: 'http://panther.gisat.cz/backend/',
    geoServerUrl: '192.168.2.206/geoserver/',
    serverUrl: '192.168.2.206/backend/',

    apiGeoserverWFSProtocol: 'http',
    apiGeoserverWFSHost: '192.168.2.206',
    apiGeoserverWFSPath: 'geoserver/geonode/wfs',

    apiBackendProtocol: 'http',
    // apiBackendHost: 'panther.gisat.cz',
    apiBackendHost: '192.168.2.206',
    apiBackendAoiLayerPeriodsPath: 'backend/rest/imagemosaic/getDates',
    apiBackendSzifPath: 'backend/rest/szif/case',

    hasPeriodsSelector: true
};

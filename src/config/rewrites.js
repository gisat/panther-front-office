/**
 * CONFIG
 *
 * Per-instance values, development values & features.
 * See documentation in ./defaults.js
 * Versions/variants managed in github.com/gisat/docker/
 */

export default {
    geoServerUrl: 'https://urban-tep.eu/puma/geoserver/',
    serverUrl: 'https://urban-tep.eu/puma/backend/',

    apiGeoserverWFSProtocol: 'https',
    apiGeoserverWFSHost: 'urban-tep.eu/puma/',
    apiGeoserverWFSPath: 'geoserver/geonode/wfs',

    apiBackendProtocol: 'https',
    apiBackendHost: 'urban-tep.eu/puma/',
    apiBackendPath: 'backend/',
    apiBackendAoiLayerPeriodsPath: 'backend/rest/imagemosaic/getDates',
    apiBackendSzifPath: 'backend/rest/szif/case',

    hasPeriodsSelector: true
};

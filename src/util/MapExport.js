

/**
 * Class for exporting of map as a shapefile or csv file
 * @param options {Object} options necessarz for request
 * @param options.attributes {Array} list of attributes
 * @param options.places {Array} ids of places
 * @param options.areaTemplate {number} id of area template
 * @param options.periods {Array} ids of periods
 * @param options.gids {Array} ids of selected areas
 * @constructor
 */
let $ = window.$;
class MapExport {
    constructor(options) {
        this._places = options.places;
        this._areaTemplate = options.areaTemplate;
        this._periods = options.periods;
        this._gids = options.gids;
        this._attributes = options.attributes;
    };

    /**
     * Export current selection
     * @param type {('json'|'csv'|'xls'|'shp')} format of the export output
     */
    export(type) {
        let url = window.Config.url + "export/" + type;
        let form = "<form id='download-form' action='" + url + "' method='post'>" +
            "<input name='attributes' value='" + this._attributes + "'>" +
            "<input name='places' value='" + this._places + "'>" +
            "<input name='areaTemplate' value='" + this._areaTemplate + "'>" +
            "<input name='periods' value='" + this._periods + "'>" +
            "<input name='gids' value='" + this._gids + "'>" +
            "</form>";
        $('body').append(form);
        document.getElementById("download-form").submit();
        $('#download-form').remove();
    };
}

export default MapExport;

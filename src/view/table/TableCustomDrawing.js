import Table from './Table';

import 'TableCustomDrawing.css';

/**
 * @constructor
 */
class TableCustomDrawing extends Table {
    constructor(options) {
        super(options);
        this._recordCount = 1;
    };

    rebuild(data) {
        this.clear();
        this._recordCount = 1;

        let self = this;
        data.forEach(function (record) {
            self.addRecord("", record.uuid, record.name);
        });
    };

    /**
     * Add record to the table
     * @param olid {string} olid of the feature
     * @param uuid {string} uuid of the feature
     * @param name {string} name of the feature
     */
    addRecord(olid, uuid, name) {
        if (!this._header) {
            this._header = this.buildHeader();
        }

        let featureName = "";
        let openLayersID = "";
        let uniqueID = "";
        let disabled = "";
        if (name) {
            featureName = name;
            disabled = 'disabled="disabled"';
        }
        if (olid) {
            openLayersID = olid;
        }
        if (uuid) {
            uniqueID = uuid;
        }

        let html = '<tr class="record-row" data-olid="' + openLayersID + '" data-uuid="' + uniqueID + '">' +
            '<td>' + this._recordCount + '</td>' +
            '<td class="record-name"><input type="text" value="' + featureName + '" ' + disabled + '></td>' +
            '<td class="save-record"><div class="widget-button button-save-record" ' + disabled + '>' + polyglot.t("save") + '</div></td>' +
            '<td class="delete-record"><div class="widget-button button-delete-record">' + polyglot.t('delete') + '</div></td>' +
            '</tr>';
        this._table.append(html);
        this._recordCount++;
    };

    /**
     * Build table header
     * @returns {boolean}
     */
    buildHeader() {
        let html = '<tr class="header">' +
            '<th>#</th>' +
            '<th>' + polyglot.t("name") + '</th>' +
            '<th></th>' +
            '<th></th>' +
            '</tr>';
        this._table.append(html);
        return true;
    };

    /**
     * Delete whole row
     * @param uuid {string} uuid of the record
     */
    deleteRecord(uuid) {
        this._table.find("tr[data-uuid=" + uuid + "]").remove();
    };
}

export default TableCustomDrawing;

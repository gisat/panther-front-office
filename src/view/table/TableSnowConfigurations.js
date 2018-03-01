import S from 'string';

import Table from './Table';

import compositesIcon from '../widgets/SnowWidget/icons/composites.svg';
import satelliteIcon from '../widgets/SnowWidget/icons/satellite.svg';
import calendarIcon from '../widgets/SnowWidget/icons/calendar.isvg';
import placemarkIcon from '../widgets/SnowWidget/icons/placemark.isvg';

import './TableSnowConfigurations.css'

/**
 * @constructor
 */
class TableSnowConfigurations extends Table {


    /**
     * Add record to the table
     * @param data {Object}
     * @param saved {boolean} true for saved records, false for current configuration record
     */
    addRecord(data, saved) {
        let compIcon = S(compositesIcon).template().toString();
        let satIcon = S(satelliteIcon).template().toString();
        let calIcon = S(calendarIcon).template().toString();
        let areaIcon = S(placemarkIcon).template().toString();
        let content = '<tr data-url="' + data.url + '" data-id="' + data.uuid + '">';

        if (!saved) {
            content += '<td><input class="snow-input snow-cfg-name" type="text" placeholder="Type name..."/></td>';
        } else {
            content += '<td class="snow-cfg-name-date"><div class="snow-name">' + data.name + '</div><div class="snow-timestamp">' + data.timeStamp + '</div></td>';
        }

        // add location and period cell
        content += '<td class="snow-icon snow-area"><div class="snow-icon-container">' + areaIcon + '</div><div>' + data.area + '</div></td>';
        content += '<td class="snow-icon snow-date"><div class="snow-icon-container">' + calIcon + '</div><div>' + data.dateFrom + ' -<br/>' + data.dateTo + '</div></td>';

        // add sensors cell
        let sensors = '';
        for (let satellite in data.sensors) {
            sensors += satellite + ' (';
            sensors += data.sensors[satellite].join(', ');
            sensors += ')<br/>';
        }
        content += '<td class="snow-icon snow-sensors"><div class="snow-icon-container">' + satIcon + '</div><div>' + sensors + '</div></td>';

        // add composites cell
        content += '<td class="snow-icon snow-composites"><div class="snow-icon-container icon-composites">' + compIcon + '</div><div>Daily composites </br>';
        if (data.composites.length) {
            content += '' + data.composites.join(",") + '-day composites';
        }
        content += '</div></td>';


        //add action button
        if (saved) {
            content += '<td class="button-cell button-cell-delete"><div title="Delete" class="widget-button delete-composites"><i class="fa fa-trash-o" aria-hidden="true"></i></div></td>';
            content += '<td class="button-cell"><div class="widget-button show-composites">Show<i class="fa fa-arrow-right" aria-hidden="true"></i></div></td>';
        } else {
            content += '<td class="button-cell"><div class="widget-button save-composites"><i class="fa fa-floppy-o" aria-hidden="true"></i>Save</div></td>';
        }

        content += '</tr>';

        this._table.append(content);
    };
}

export default TableSnowConfigurations;

import React from 'react';
import ReactDOM from 'react-dom';
import fetch from "isomorphic-fetch";
import xml2js from 'xml2js';
import _ from 'lodash';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';

import utils from "../../utils/sort";
import Elections from "./Elections/Elections";

let url = "https://volby.cz/pls/ep2019/vysledky";

const colors = {
	"30": "#32c0ee", //ANO
	"5": "#1344ff", //ODS
	"27": "#c8c8c8", //PIRATI
	"26": "#390be4", //TOP09
	"28": "#9c6d2a", //SPD
	"39": "#e2cd18", //KDU-CSL
	"9": "#d6201d", //KSCM
	"7": "#ff9702", //CSSD
	"24": "#26912b", //HLAS
	"6": "#cd45a6", //TROL
};

export default () => {
	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'text/xml; charset=UTF-8',
			'Accept': 'text/xml'
		}
	}).then(
		response => {
			if (response ) {
				response.arrayBuffer()
					.then(data => {
						const dataView = new DataView(data);
						const decoder = new TextDecoder('ISO-8859-2');
						return decoder.decode(dataView);
					}).then((data) => {
					let parser = new xml2js.Parser({xmldec: {'encoding': 'ISO-8859-2'}});
					parser.parseString(data, (err, result) => {
						let totalResults = result.VYSLEDKY.CR[0].STRANA;
						let adjustedResults = _.map(totalResults, party => {
							let id = party.$.ESTRANA;
							party.$.COLOR = colors[id];
							party.HLASY_STRANA[0].$.PROC_HLASU = Number(party.HLASY_STRANA[0].$.PROC_HLASU);
							return party;
						});
						let orderedTotalResults = utils.sortByOrder(adjustedResults, [['HLASY_STRANA[0].$.PROC_HLASU', 'desc']]);
						let preparedData = _.slice(orderedTotalResults, 0, 10);

						ReactDOM.render(
							<Elections
								data={preparedData}
							/>,
							document.getElementById('ptr')
						);
					});
				});
			} else {
				throw new Error('response error');
			}
		},
		error => {
			throw error;
		}
	);

}
import React from 'react';
import ReactDOM from 'react-dom';
import fetch from "isomorphic-fetch";
import xml2js from 'xml2js';
import _ from 'lodash';

// base styles need to be imported before all components
import '@gisatcz/ptr-core/src/styles/reset.css';
import '@gisatcz/ptr-core/src/styles/base.scss';

import {sort} from '@gisatcz/ptr-utils';
import {layersHelper} from '@gisatcz/ptr-deprecated';
import {getStyleFunction} from "./Elections/layerTurnoutStyle";
import Elections from "./Elections/Elections";
import nuts3 from "./data/nuts3_cr.js";

let url = "https://s3.eu-central-1.amazonaws.com/cog-gisat/vysledky.xml";

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

const backgroundLayer = layersHelper.addLayer([], {type:'wikimedia'}, 0);
const navigator = {
	lookAtLocation: {
		latitude: 49.8,
		longitude: 15.4
	},
	range: 500000,
	roll: 0,
	tilt: 0,
	heading: 0
}
const layers = [];
const nutsLayer = layersHelper.getLayerByType({type: 'vector-relative', spatialRelationsData: {}, attributeRelationsData: {}}, 'vector-relative');

const setTurnoutLayer = (nutsData) => {
	const fl = nuts3.features.length;
	
	let min = null;
	let max = null;
			
	for(let i = 0; i < fl; i++) {
		let data = nutsData.find(nd => nuts3.features[i].properties.NUTS_ID === nd.kraj);
		min = min ? Math.min(min, data.ucast) : data.ucast;
		max = max ? Math.max(max, data.ucast) : data.ucast;
		nuts3.features[i].properties = {...nuts3.features[i].properties, ...nutsData.find(nd => nuts3.features[i].properties.NUTS_ID === nd.kraj)}
	}

	layers.push(nutsLayer);
	nutsLayer.setRenderables(nuts3, null, {});
	nutsLayer.setStyleFunction(getStyleFunction(min, max, 5, 'blue'));
	
}

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
						let nutsTurnoutResults = result.VYSLEDKY.KRAJ.map(k => ({kraj: k.$.NUTS_KRAJ, ucast: parseInt(k.UCAST[0].$.UCAST_PROC)}));
						setTurnoutLayer(nutsTurnoutResults);
						
						let adjustedResults = _.map(totalResults, party => {
							let id = party.$.ESTRANA;
							party.$.COLOR = colors[id];
							party.HLASY_STRANA[0].$.PROC_HLASU = Number(party.HLASY_STRANA[0].$.PROC_HLASU);
							return party;
						});
						let orderedTotalResults = sort.sortByOrder(adjustedResults, [['HLASY_STRANA[0].$.PROC_HLASU', 'desc']]);
						let preparedData = _.slice(orderedTotalResults, 0, 10);

						ReactDOM.render(
							<Elections
								data={preparedData}
								layers={[...backgroundLayer, ...layers]}
								navigator = {navigator}
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
import React from 'react';
import {withNamespaces} from "react-i18next";

import Page, {
	SyntaxHighlighter
} from '../../../Page';
import {PresentationMap} from "../../../../../../components/common/maps/Map";
import WorldWindMap from "../../../../../../components/common/maps/WorldWindMap/presentation";
import PresentationMapControls from "../../../../../../components/common/maps/controls/MapControls/presentation";
import cz_gadm from "../../../mockData/map/czGadm1WithStyles/geometries";
import largePointData from "../../../mockData/map/largePointData/geometries";
import style from "../../../mockData/map/czGadm1WithStyles/style";
import style2 from "../../../mockData/map/czGadm1WithStyles/style2";
import largeDataStyle from "../../../mockData/map/largePointData/style";
import {HoverHandler} from "@gisatcz/ptr-core";

const shapesStyle = {
	"key":"szdc-zonal-classification-circles",
	"data":{
		"source":"definition",
		"definition":{
			"rules":[
				{
					"styles": [
						{
							// "shape": "circle"
							// "shape": "square"
							"shape": "diamond"
							// "shape": "triangle"
						},{
							"attributeKey": "attr3",
							"attributeScale": {
								"volume": {
									"inputInterval": [0,1],
									"outputInterval": [10,100]
								}
							}
						}
					]
				}
			]
		}
	}
};

const wikimedia = {
	type: 'worldwind',
	options: {
		layer: 'wikimedia'
	}
};

const backgroundCuzk = {
	key: 'cuzk_ortofoto',
	name: 'CUZK Ortofoto',
	type: 'wms',
	options: {
		url: 'http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?',
		params: {
			layers: 'GR_ORTFOTORGB'
		}
	}
};

const presentationalLayers = [{
	key: "gadm-1-cz",
	type: "vector",
	options: {
		features: cz_gadm.features,
		style: style.data.definition
	}
}];

const presentationalLayers2 = [{
	key: "gadm-1-cz-2",
	type: "vector",
	options: {
		features: cz_gadm.features,
		style: style2.data.definition
	}
}];

const largeDataLayers = [{
	key: "large-data-layers",
	type: "vector",
	options: {
		features: largePointData.features,
		style: largeDataStyle.data.definition
	}
}];

const largeDataLayersShapes = [{
	key: "large-data-layers",
	type: "vector",
	options: {
		features: largePointData.features,
		style: shapesStyle.data.definition
	}
}];

const levelsRange = [10, 18];

class StyleDoc extends React.PureComponent {

	render() {
		return (
			<Page title="Styles">
				<p>Styles are for styling. </p>{/* todo */}


				<SyntaxHighlighter language="javascript">
					{
`{
	key: '3a188ace-94d2-46e5-86c8-684172bd2af4',
	data: {
		nameInternal: '',
		nameDisplay: '',
		description: '',
		source: 'geoserver|definition',
		nameGeoserver: '',
		definition: {
			rules: [
				{
					filter: {
						['and'|'or']: [
							{
								featureType: 'Point|MultiPolygon|pixel|...',
								attributeKey: '4a188ace-94d2-46e5-86c8-684172bd2af5',
								attributeInterval: [-10.12,11.45] | [null, 11.45],
								attributeValue: 'Prague' | 7 | ...
								...
							}
						], 
						featureType: 'Point|MultiPolygon|pixel|...',
						attributeKey: '4a188ace-94d2-46e5-86c8-684172bd2af5',
						attributeInterval: [-10.12,11.45] | [null, 11.45],
						attributeValue: 'Prague' | 7 | ...
						...
					},
					styles: [
						{
							attributeKey: '54fba0c3-889b-4a26-bda9-5cf9235517d0',
							attributeClasses: [
								{
									interval: [7, 8]
									intervalBounds: [true, false] // 7 is included, 8 not
									fill: '#ff00ee'
								}, {
									
								}
							]
						}
					]
				}
			]
		}
	}
}`
					}
				</SyntaxHighlighter>

				<h3>Classes for fill, scale for outlines</h3>
				<SyntaxHighlighter language="javascript">
					{
						`{
\t"key":"szdc-zonal-classification-example",
\t"data":{
\t"nameInternal":"",
\t"nameDisplay":"",
\t"description":"",
\t"source":"definition",
\t"nameGeoserver":"",
\t"definition":{
\t  "rules":[
\t\t{
\t\t  "styles":[
\t\t\t{
\t\t\t  "attributeKey":"e575b4d4-7c7a-4658-bb9a-a9b61fcc2587",
\t\t\t  "attributeClasses":[
\t\t\t\t{
\t\t\t\t  "interval": [0,5],
\t\t\t\t  "intervalBounds": [true, false],
\t\t\t\t  "fill": "#e41a1c"
\t\t\t\t},{
\t\t\t\t  "interval": [5,10],
\t\t\t\t  "intervalBounds": [true, false],
\t\t\t\t  "fill": "#377eb8"
\t\t\t\t},{
\t\t\t\t  "interval": [10,20],
\t\t\t\t  "intervalBounds": [true, false],
\t\t\t\t  "fill": "#984ea3"
\t\t\t\t}
\t\t\t  ]
\t\t\t}, {
\t\t\t  "attributeKey": "22a43eb3-6552-476f-97a5-b47490519642",
\t\t\t  "attributeScale": {
\t\t\t\t"outlineWidth": {
\t\t\t\t  "inputInterval": [-10,10],
\t\t\t\t  "outputInterval": [0,7]
\t\t\t\t}
\t\t\t  }
\t\t\t}
\t\t  ]
\t\t}
\t  ]
\t}
  }
}`
					}
				</SyntaxHighlighter>

				<div style={{marginTop: 10, height: 400}}>
					<PresentationMap
						mapComponent={WorldWindMap}
						backgroundLayer={wikimedia}
						layers={presentationalLayers}
						view={{
							boxRange: 1000000
						}}
					>
						<PresentationMapControls/>
					</PresentationMap>
				</div>


				<h3>Scale for fill</h3>
				<SyntaxHighlighter language="javascript">
					{
						`{
\t"key":"szdc-zonal-classification-example",
\t"data":{
\t"nameInternal":"",
\t"nameDisplay":"",
\t"description":"",
\t"source":"definition",
\t"nameGeoserver":"",
\t"definition":{
\t  "rules":[
\t\t{
\t\t  "styles":[
\t\t\t{
\t\t\t  "attributeKey": "22a43eb3-6552-476f-97a5-b47490519642",
\t\t\t  "attributeScale": {
\t\t\t\t"fill": {
\t\t\t\t  "inputInterval": [-10,0,10],
\t\t\t\t  "outputInterval": ["yellow", "lightgreen", "008ae5"]
\t\t\t\t}
\t\t\t  }
\t\t\t}
\t\t  ]
\t\t}
\t  ]
\t}
  }
}`
					}
				</SyntaxHighlighter>

				<div style={{marginTop: 10, height: 400}}>
					<PresentationMap
						mapComponent={WorldWindMap}
						backgroundLayer={wikimedia}
						layers={presentationalLayers2}
						view={{
							boxRange: 1000000
						}}
					>
						<PresentationMapControls/>
					</PresentationMap>
				</div>


				<h3>Custom point symbol (large data layer)</h3>

				<SyntaxHighlighter language="javascript">
					{
`{
	"key":"szdc-zonal-classification-example",
	"data":{
		"nameInternal":"",
		"nameDisplay":"",
		"description":"",
		"source":"definition",
		"nameGeoserver":"",
		"definition":{
			"rules":[
				{
					"styles": [
						{
							"shape": "circle-with-arrow",
							"outlineWidth": 1,
							"arrowColor": "#39ff14",
							"arrowWidth": 3
						},
						{
							"attributeKey": "attr1",
							"attributeClasses": [
								{
									"interval": [0,25],
									"fill": "#edf8fb"
								},
								{
									"interval": [25,50],
									"fill": "#b3cde3"
								},{
									"interval": [50,75],
									"fill": "#8c96c6"
								},{
									"interval": [75,101],
									"fill": "#88419d"
								}
							]
						},{
							"attributeKey": "attr3",
							"attributeScale": {
								"size": {
									"inputInterval": [0,1],
									"outputInterval": [5,20]
								}
							}
						},{
							"attributeKey": "attr2",
							"attributeScale": {
								"arrowLength": {
									"inputTransformation": ["abs"],
									"inputInterval": [0,10],
									"outputInterval": [0,30]
								}
							}
						},{
							"attributeKey": "attr2",
							"attributeTransformation": {
								"arrowDirection": {
									"inputTransformation": ["sign"]
								}
							}
						}
					]
				}
			]
		}
	}
}`
					}
				</SyntaxHighlighter>

				<div style={{marginTop: 10, height: 400}}>
					<HoverHandler>
						<PresentationMap
							levelsBased={levelsRange}
							mapComponent={WorldWindMap}
							backgroundLayer={backgroundCuzk}
							layers={largeDataLayers}
							view={{
								boxRange: 20000,
								center: {
									lat: 50.25,
									lon: 15.75
								}
							}}
						>
							<PresentationMapControls levelsBased={levelsRange}/>
						</PresentationMap>
					</HoverHandler>
				</div>
				<div style={{marginTop: 10, height: 400}}>
					<HoverHandler>
						<PresentationMap
							levelsBased={levelsRange}
							mapComponent={WorldWindMap}
							backgroundLayer={backgroundCuzk}
							layers={largeDataLayersShapes}
							view={{
								boxRange: 20000,
								center: {
									lat: 50.25,
									lon: 15.75
								}
							}}
						>
							<PresentationMapControls levelsBased={levelsRange}/>
						</PresentationMap>
					</HoverHandler>
				</div>
			</Page>
		);
	}
}

export default withNamespaces()(StyleDoc);
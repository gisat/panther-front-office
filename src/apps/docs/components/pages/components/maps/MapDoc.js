import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";
import WorldWindMap from "../../../../../../components/common/maps/WorldWindMap/presentation";
import layersHelper from '../../../../../../components/common/maps/WorldWindMap/layers/helpers';
import PresentationMapControls from "../../../../../../components/common/maps/controls/MapControls/presentation";
import {Link} from "@gisatcz/ptr-state";
import ComponentPropsTable, {Section, Prop} from "../../../ComponentPropsTable/ComponentPropsTable";
import Map, {PresentationMap} from "../../../../../../components/common/maps/Map";
import _ from 'lodash';

import cz_gadm from '../../../mockData/map/czGadm1WithStyles/geometries';
import style from '../../../mockData/map/czGadm1WithStyles/style';
import {HoverHandler} from "@gisatcz/ptr-core";

const hoveredStyle = {
	"rules":[
		{
			"styles": [
				{
					"fill": "#ff0000"
				}
			]
		}
	]
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

const wikimedia = {
	type: 'worldwind',
	options: {
		layer: 'wikimedia'
	}
};

const backgroundLayer = {
	layerTemplateKey: 'd54f7782-976b-4fb2-9066-5f1ca4f3b703',
	metadataModifiers: {
		applicationKey: 'docs'
	}
};

const layers = [{
		key: 'layer-cz',
		layerTemplateKey: 'b5afa739-7828-4ed0-8844-306a5470e7e0'
	},{
		key: 'layer-geoinv',
		layerTemplateKey: '097d3fed-e6da-4f08-833e-839c88513b8b',
		metadataModifiers: {
			applicationKey: 'docs'
	}
}];

const presentationalLayers = [{
	key: "gadm-1-cz",
	type: "vector",
	options: {
		features: cz_gadm.features,
		style: style.data.definition
	}
}];

const largeDataLayers = [{
	key: 'large-data-test',
	areaTreeLevelKey: 'd1b6b010-16c3-40c6-b62f-bffe76b15067',
	options: {
		hovered: {
			keys: null,
			style: hoveredStyle
		}
	}
}];

const levelsRange = [0, 18];

class MapDoc extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			largeDataLayers,
			hoveredKeys: null
		};

		this.onLayerFeaturesHover = this.onLayerFeaturesHover.bind(this);
	}

	onLayerFeaturesHover(layerKey, hoveredKeys) {
		let layer = _.find(this.state.largeDataLayers, {key: layerKey});
		hoveredKeys = hoveredKeys.length ? hoveredKeys : null;

		let updatedLayer = {...layer, options: {...layer.options, hovered: {...layer.options.hovered, keys: hoveredKeys}}};

		layer.options.hovered.keys = hoveredKeys;

		if (!_.isEqual(this.state.hoveredKeys, hoveredKeys)) {
			this.setState({
				hoveredKeys,
				largeDataLayers: [updatedLayer]
			});
		}
	}

	// TODO uncomment after szdc testing
	render() {
		return (
			<Page title="Map">

				<h3>Uncontrolled connected - large data as analytical units</h3>
				<div style={{marginTop: 10, height: 400}}>
					<HoverHandler>
						<Map
							mapKey="Map-1"
							mapComponent={WorldWindMap}
							backgroundLayer={backgroundCuzk}
							layers={this.state.largeDataLayers}
							levelsBased={levelsRange}
							view={{
								boxRange: 1000,
								center: {
									lat: 50.348,
									lon: 13.07
								}
							}}
							onLayerFeaturesHover={this.onLayerFeaturesHover}
						>
							<PresentationMapControls levelsBased={levelsRange}/>
						</Map>
					</HoverHandler>
				</div>

				{/*<h3>Uncontrolled connected</h3>*/}
				{/*<div style={{height: 300}}>*/}
				{/*	<Map*/}
				{/*		mapKey="Map-2"*/}
				{/*		mapComponent={WorldWindMap}*/}
				{/*		backgroundLayer={backgroundCuzk}*/}
				{/*		layers={layers}*/}
				{/*		view={{*/}
				{/*			boxRange: 1000000*/}
				{/*		}}*/}
				{/*	>*/}
				{/*		<PresentationMapControls/>*/}
				{/*	</Map>*/}
				{/*</div>*/}

				{/*<h3>Uncontrolled unconnected</h3>*/}
				{/*<div style={{marginTop: 10, height: 400}}>*/}
				{/*	<PresentationMap*/}
				{/*		mapComponent={WorldWindMap}*/}
				{/*		backgroundLayer={wikimedia}*/}
				{/*		layers={presentationalLayers}*/}
				{/*		view={{*/}
				{/*			boxRange: 1000000*/}
				{/*		}}*/}
				{/*	>*/}
				{/*		<PresentationMapControls/>*/}
				{/*	</PresentationMap>*/}
				{/*</div>*/}

				{/*<h2>Props</h2>*/}
				{/*<ComponentPropsTable*/}
				{/*	// content={*/}
				{/*	// 	[{*/}
				{/*	// 		name: "view",*/}
				{/*	// 		type: "map view",*/}
				{/*	// 		description: <Link to="/architecture/systemDataTypes/mapView">Map view</Link>*/}
				{/*	// 	},{*/}
				{/*	// 		name: "layers",*/}
				{/*	// 		type: "layers",*/}
				{/*	// 		description: <Link to="/architecture/systemDataTypes/layers">Layers</Link>*/}
				{/*	// 	},{*/}
				{/*	// 		name: "backgroundLayer",*/}
				{/*	// 		type: "background layer",*/}
				{/*	// 		description: <Link to="/architecture/systemDataTypes/layers#backgroundLayer">Background layer</Link>*/}
				{/*	// 	},{*/}
				{/*	//*/}
				{/*	// 	},{*/}
				{/*	// 		name: "stateMapKey",*/}
				{/*	// 		type: "string",*/}
				{/*	// 		description: "Valid key of a map in map store"*/}
				{/*	// 	},{*/}
				{/*	//*/}
				{/*	// 	},{*/}
				{/*	// 		name: "onViewChange",*/}
				{/*	// 		type: "function",*/}
				{/*	// 		description: "Function called when a view change is initiated inside the Map component"*/}
				{/*	// 	},{*/}
				{/*	// 		name: "onClick",*/}
				{/*	// 		type: "function",*/}
				{/*	// 		description: "Function called on click"*/}
				{/*	// 	}]*/}
				{/*	// }*/}
				{/*>*/}
				{/*	<Prop name="mapComponent" required>Presentational component to render the final map</Prop>*/}
				{/*	<Section name="Controlled">*/}
				{/*		<Prop name="stateMapKey" required type="string">Valid key of a map in map store</Prop>*/}
				{/*	</Section>*/}
				{/*	<Section name="Uncontrolled">*/}
				{/*		<Prop name="mapKey" required type="string"/>*/}
				{/*		<Prop name="view" required type="map view"><Link to="/architecture/systemDataTypes/mapView">Map view</Link></Prop>*/}
				{/*		<Prop name="layers" type="layers"><Link to="/architecture/systemDataTypes/layers">Layers</Link></Prop>*/}
				{/*		<Prop name="backgroundLayer" type="background layer">*/}
				{/*			<Link to="/architecture/systemDataTypes/layers#backgroundLayer">Background layer</Link>*/}
				{/*		</Prop>*/}
				{/*		<Prop name="onViewChange" type="function">Function called when a view change is initiated inside the Map component</Prop>*/}
				{/*		<Prop name="onClick" type="function">Function called on click</Prop>*/}
				{/*		<Prop name="wrapperClasses" type="string">Class names for wrapper component</Prop>*/}
				{/*	</Section>*/}
				{/*</ComponentPropsTable>*/}

				{/*<DocsToDo>Usage</DocsToDo>*/}
				
			</Page>
		);
	}
}

export default MapDoc;
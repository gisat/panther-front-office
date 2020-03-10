import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../../Page";

import {ReactLeafletMap, LeafletMap, WorldWindMap, MapControls as MapControlsPresentation, MapSet, MapSetPresentationMap, PresentationMap} from "@gisatcz/ptr-maps";

import {connects} from '@gisatcz/ptr-state';

const ConnectedMap = connects.Map(PresentationMap);
const ConnectedMapSet = connects.MapSet(MapSet);

const backgroundLayer = {
	layerTemplateKey: 'd54f7782-976b-4fb2-9066-5f1ca4f3b703',
	metadataModifiers: {
		applicationKey: 'docs'
	}
};

const osm = {
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
	}
};

const wikimedia = {
	type: 'worldwind',
	options: {
		layer: 'wikimedia'
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

const layers2 = [{
	key: 'layer-geoinv',
	layerTemplateKey: '097d3fed-e6da-4f08-833e-839c88513b8b',
	metadataModifiers: {
		applicationKey: 'docs'
	}
}];

const layersForLeaflet = [{
	key: 'cuzk_ortofoto',
	name: 'CUZK Ortofoto',
	type: 'wms',
	opacity: 0.5,
	options: {
		url: 'http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?',
		params: {
			layers: 'GR_ORTFOTORGB'
		}
	}
}];

class MapSetDoc extends React.PureComponent {
	constructor(props){
		super(props);

		props.addSet({
			key: 'docs-MapSet',
			data: {
				backgroundLayer: osm,
				layers: layers,
				view: {
					center: {
						lat: 50,
						lon: 15
					},
					boxRange: 1000000
				}
			}
		});
		props.setSetSync('docs-MapSet', {center: true, boxRange: true, heading: true});
		props.addMap({key: 'docs-MapSet-Map1', data: {
				view: {
					heading: 10
				}
			}},);
		props.addMap({key: 'docs-MapSet-Map2'});
		props.addMap({key: 'docs-MapSet-Map3'});
		props.addMapToSet('docs-MapSet', 'docs-MapSet-Map1');
		props.addMapToSet('docs-MapSet', 'docs-MapSet-Map2');
		props.addMapToSet('docs-MapSet', 'docs-MapSet-Map3');
	}

	render() {
		return (
			<Page title="Map set">
				<h2>Leaflet</h2>
				<h3>Connected to store</h3>
				<div style={{height: 500}}>
					<ConnectedMapSet
						stateMapSetKey="docs-MapSet"
						mapComponent={ReactLeafletMap}
						connectedMapComponent={ConnectedMap}
					>
						<MapControlsPresentation levelsBased zoomOnly/>
					</ConnectedMapSet>
				</div>

				<h3>Uncontrolled</h3>
				<div style={{height: 500}}>
					<ConnectedMapSet
						activeMapKey='map-2'
						mapComponent={ReactLeafletMap}
						view={{
							boxRange: 1000000,
							heading: 10,
							tilt: 10
						}}
						sync={{
							boxRange: true,
							center: true
						}}
						backgroundLayer={osm}
						layers={layersForLeaflet}
					>
						<MapSetPresentationMap
							mapKey='map-1'
						/>
						<MapSetPresentationMap
							mapKey='map-2'
						/>
						<MapSetPresentationMap
							mapKey='map-3'
						/>
						<MapControlsPresentation levelsBased zoomOnly/>
					</ConnectedMapSet>
				</div>

				<h3>Uncontrolled unconnected</h3>
				<div style={{height: 500}}>
					<MapSet
						activeMapKey='map-2'
						mapComponent={ReactLeafletMap}
						view={{
							boxRange: 100000,
							heading: 10,
							tilt: 10
						}}
						sync={{
							boxRange: true,
							center: true
						}}
						backgroundLayer={osm}
						layers={layersForLeaflet}
					>
						<MapSetPresentationMap
							mapKey='map-1'
						/>
						<MapSetPresentationMap
							mapKey='map-2'
						/>
						<MapSetPresentationMap
							mapKey='map-3'
						/>
						<MapControlsPresentation levelsBased zoomOnly/>
					</MapSet>
				</div>

				<h2>World Wind</h2>
				<h3>Connected to store</h3>
				<div style={{height: 500}}>
					<ConnectedMapSet
						stateMapSetKey="docs-MapSet"
						mapComponent={WorldWindMap}
						connectedMapComponent={ConnectedMap}
					>
						<MapControlsPresentation/>
					</ConnectedMapSet>
				</div>

				<h3>Uncontrolled</h3>
				<div style={{height: 500}}>
					<ConnectedMapSet
						activeMapKey='map-2'
						mapComponent={WorldWindMap}
						view={{
							boxRange: 1000000,
							heading: 10,
							tilt: 10
						}}
						sync={{
							boxRange: true,
							center: true
						}}
						backgroundLayer={wikimedia}
						layers={layers2}
					>
						<MapSetPresentationMap
							mapKey='map-1'
						/>
						<MapSetPresentationMap
							mapKey='map-2'
						/>
						<MapSetPresentationMap
							mapKey='map-3'
						/>
						<MapControlsPresentation/>
					</ConnectedMapSet>
				</div>

				<h3>Uncontrolled unconnected</h3>
				<div style={{height: 500}}>
					<MapSet
						activeMapKey='map-2'
						mapComponent={WorldWindMap}
						view={{
							boxRange: 100000,
							heading: 10,
							tilt: 10
						}}
						sync={{
							boxRange: true,
							center: true
						}}
						backgroundLayer={wikimedia}
					>
						<MapSetPresentationMap
							mapKey='map-1'
						/>
						<MapSetPresentationMap
							mapKey='map-2'
						/>
						<MapSetPresentationMap
							mapKey='map-3'
						/>
						<MapControlsPresentation/>
					</MapSet>
				</div>
			</Page>
		);
	}
}

export default MapSetDoc;
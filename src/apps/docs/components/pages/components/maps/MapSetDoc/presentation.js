import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../../Page";

import MapControlsPresentation from "../../../../../../../components/common/maps/controls/MapControls/presentation";
import MapSet from "../../../../../../../components/common/maps/MapSet";
import MapSetPresentation, {PresentationMap} from "../../../../../../../components/common/maps/MapSet/presentation";
import WorldWindMap from "../../../../../../../components/common/maps/WorldWindMap/presentation";

const backgroundLayer = {
	layerTemplateKey: 'd54f7782-976b-4fb2-9066-5f1ca4f3b703',
	metadataModifiers: {
		applicationKey: 'docs'
	}
};

const layers = [{
	key: 'layer-cz',
	layerTemplateKey: 'c87619f8-ef27-436f-9d99-d2b200415160',
	metadataModifiers: {
		applicationKey: 'docs'
	}
},{
	key: 'layer-geoinv',
	layerTemplateKey: '097d3fed-e6da-4f08-833e-839c88513b8b',
	metadataModifiers: {
		applicationKey: 'docs'
	}
}];

class MapSetDoc extends React.PureComponent {
	constructor(props){
		super(props);

		props.addSet({
			key: 'docs-MapSet',
			data: {
				backgroundLayer: {
					type: 'worldwind',
					options: {
						layer: 'wikimedia'
					}
				},
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
				<h2>Connected to store</h2>
				<div style={{height: 500}}>
					<MapSet
						stateMapSetKey="docs-MapSet"
						mapComponent={WorldWindMap}
					>
						<MapControlsPresentation/>
					</MapSet>
				</div>

				<h2>Uncontrolled</h2>
				<div style={{height: 500}}>
					<MapSet
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
						backgroundLayer={backgroundLayer}
						layers={layers}
					>
						<PresentationMap
							mapKey='map-1'
						/>
						<PresentationMap
							mapKey='map-2'
						/>
						<PresentationMap
							mapKey='map-3'
						/>
						<MapControlsPresentation/>
					</MapSet>
				</div>

				<h2>Uncontrolled unconnected</h2>
				<div style={{height: 500}}>
					<MapSetPresentation
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
						backgroundLayer={{
							type: 'worldwind',
							options: {
								layer: 'wikimedia'
							}
						}}
					>
						<PresentationMap
							mapKey='map-1'
						/>
						<PresentationMap
							mapKey='map-2'
						/>
						<PresentationMap
							mapKey='map-3'
						/>
						<MapControlsPresentation/>
					</MapSetPresentation>
				</div>
			</Page>
		);
	}
}

export default MapSetDoc;
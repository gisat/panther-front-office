import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../../Page";

import MapControlsPresentation from "../../../../../../../components/common/maps/controls/MapControls/presentation";
import MapSet from "../../../../../../../components/common/maps/MapSet";
import MapSetPresentation, {PresentationMap} from "../../../../../../../components/common/maps/MapSet/presentation";
import WorldWindMap from "../../../../../../../components/common/maps/WorldWindMap/presentation";

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
				layers: [
					{
						key: 'lulc',
						layerTemplateKey: '8d1afd87-908b-4d22-90bb-af1a4e161930'
					}
				],
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
				// backgroundLayer: {
				// 	layerTemplateKey: '8d1afd87-908b-4d22-90bb-af1a4e161930'
				// },
				layers: [
					{
						key: 'lulc',
						layerTemplateKey: '8d1afd87-908b-4d22-90bb-af1a4e161930'
					}, {
						key: 'vector',
						layerTemplateKey: 'cfe1ceb6-a9c1-40f7-b6e0-034e14307cc3'
					}
				],
				view: {
					heading: 10
				}
			}},);
		props.addMap({key: 'docs-MapSet-Map2', data: {
				layers: [
					{
						key: 'vector',
						layerTemplateKey: 'cfe1ceb6-a9c1-40f7-b6e0-034e14307cc3'
					}
				],
			}});
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
							boxRange: 100000,
							heading: 10,
							tilt: 10
						}}
						sync={{
							boxRange: true,
							center: true
						}}
						backgroundLayer={{
							layerTemplateKey: 'd54f7782-976b-4fb2-9066-5f1ca4f3b703',
							metadataModifiers: {
								applicationKey: 'docs'
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
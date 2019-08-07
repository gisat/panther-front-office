import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";

import MapControls from "../../../../../../components/common/maps/MapControls/presentation";
import MapSet, {PresentationMap} from "../../../../../../components/common/maps/MapSet/presentation";
import WorldWindMap from "../../../../../../components/common/maps/WorldWindMap/presentation";
import LeafletMap from "../../../../../../components/common/maps/LeafletMap/presentation";

import * as dodoma_au_level_3 from '../../../../../scudeoCities/data/EO4SD_DODOMA_AL3.json';
const au_3_data = dodoma_au_level_3.features;

class MapSetDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Map">
				<div style={{height: 500}}>
					<MapSet
						activeMapKey='map-2'
						mapComponent={WorldWindMap}
						view={{
							boxRange: 100000
						}}
						sync={{
							boxRange: true,
							center: true
						}}
					>
						<PresentationMap
							mapKey='map-1'
							backgroundLayer={{
								type: 'worldwind',
								options: {
									layer: 'wikimedia'
								}
							}}
						/>
						<PresentationMap
							mapKey='map-2'
							backgroundLayer={{
								type: 'worldwind',
								options: {
									layer: 'wikimedia'
								}
							}}
						/>
						<PresentationMap
							mapKey='map-3'
							backgroundLayer={{
								type: 'worldwind',
								options: {
									layer: 'wikimedia'
								}
							}}
						/>
						<MapControls/>
					</MapSet>
				</div>
				<br/>
				<div style={{height: 500}}>
					<MapSet
						activeMapKey='map-2'
						mapComponent={LeafletMap}
						view={{
							center: {
								lat: -6.15,
								lon: 35.75
							},
							boxRange: 50000
						}}
						sync={{
							boxRange: true,
							center: true
						}}
						backgroundLayer={{
							key: 'osm',
							type: 'wmts',
							options: {url: 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png'}
						}}
						layers={[
							{key: 'dodomaAuLevel3',
								name: 'Analytical units 3',
								type: 'vector',
								options: {
									features: au_3_data,
									keyProperty: 'AL3_ID',
									nameProperty: 'AL3_NAME'
								}}
						]}
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
						<MapControls zoomOnly levelsBased/>
					</MapSet>
				</div>
			</Page>
		);
	}
}

export default MapSetDoc;
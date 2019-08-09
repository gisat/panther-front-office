import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../../Page";

import MapControlsPresentation from "../../../../../../../components/common/maps/MapControls/presentation";
import MapControls from "../../../../../../../components/common/maps/MapControls";
import MapSet from "../../../../../../../components/common/maps/MapSet";
import MapSetPresentation, {PresentationMap} from "../../../../../../../components/common/maps/MapSet/presentation";
import WorldWindMap from "../../../../../../../components/common/maps/WorldWindMap/presentation";
import LeafletMap from "../../../../../../../components/common/maps/LeafletMap/presentation";
import * as dodoma_au_level_3 from '../../../../../../scudeoCities/data/EO4SD_DODOMA_AL3.json';
const au_3_data = dodoma_au_level_3.features;

class MapSetDoc extends React.PureComponent {
	constructor(props){
		super(props);

		props.addSet({
			key: 'docs-MapSet',
			data: {
				backgroundLayer: {
					layerTemplateKey: '2793f35f-5433-45e1-9f59-55aa99985fc2'
				},
				layers: [
					{
						key: 'lulc',
						layerTemplateKey: '8d1afd87-908b-4d22-90bb-af1a4e161930'
					}
				],
				view: {
					center: {
						lat: -6.15,
						lon: 35.75
					},
					boxRange: 50000
				}
			}
		});
		props.setSetSync('docs-MapSet', {center: true, boxRange: true});
		props.addMap({key: 'docs-MapSet-Map1', data: {
				backgroundLayer: {
					layerTemplateKey: '8d1afd87-908b-4d22-90bb-af1a4e161930'
				},
				layers: [
					{
						key: 'lulc',
						layerTemplateKey: '8d1afd87-908b-4d22-90bb-af1a4e161930'
					}, {
						key: 'vector',
						layerTemplateKey: 'cfe1ceb6-a9c1-40f7-b6e0-034e14307cc3'
					}
				]
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
			<Page title="Map">
				<h2>Connected to store</h2>
				<div style={{height: 500}}>
					<MapSet
						mapSetKey="docs-MapSet"
						mapComponent={WorldWindMap}
					>
						<MapControls zoomOnly levelsBased/>
					</MapSet>
				</div>

				{/*<h2>Presentation</h2>*/}
				{/*<div style={{height: 500}}>*/}
					{/*<MapSetPresentation*/}
						{/*activeMapKey='map-2'*/}
						{/*mapComponent={WorldWindMap}*/}
						{/*view={{*/}
							{/*boxRange: 100000*/}
						{/*}}*/}
						{/*sync={{*/}
							{/*boxRange: true,*/}
							{/*center: true*/}
						{/*}}*/}
						{/*backgroundLayer={{*/}
							{/*type: 'worldwind',*/}
							{/*options: {*/}
								{/*layer: 'wikimedia'*/}
							{/*}*/}
						{/*}}*/}
					{/*>*/}
						{/*<PresentationMap*/}
							{/*mapKey='map-1'*/}
						{/*/>*/}
						{/*<PresentationMap*/}
							{/*mapKey='map-2'*/}
						{/*/>*/}
						{/*<PresentationMap*/}
							{/*mapKey='map-3'*/}
						{/*/>*/}
						{/*<MapControlsPresentation/>*/}
					{/*</MapSetPresentation>*/}
				{/*</div>*/}
				{/*<br/>*/}
				{/*<div style={{height: 500}}>*/}
					{/*<MapSetPresentation*/}
						{/*activeMapKey='map-2'*/}
						{/*mapComponent={LeafletMap}*/}
						{/*view={{*/}
							{/*center: {*/}
								{/*lat: -6.15,*/}
								{/*lon: 35.75*/}
							{/*},*/}
							{/*boxRange: 50000*/}
						{/*}}*/}
						{/*sync={{*/}
							{/*boxRange: true,*/}
							{/*center: true*/}
						{/*}}*/}
						{/*backgroundLayer={{*/}
							{/*key: 'osm',*/}
							{/*type: 'wmts',*/}
							{/*options: {url: 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png'}*/}
						{/*}}*/}
						{/*layers={[*/}
							{/*{key: 'dodomaAuLevel3',*/}
								{/*name: 'Analytical units 3',*/}
								{/*type: 'vector',*/}
								{/*options: {*/}
									{/*features: au_3_data,*/}
									{/*keyProperty: 'AL3_ID',*/}
									{/*nameProperty: 'AL3_NAME'*/}
								{/*}}*/}
						{/*]}*/}
					{/*>*/}
						{/*<PresentationMap*/}
							{/*mapKey='map-1'*/}
						{/*/>*/}
						{/*<PresentationMap*/}
							{/*mapKey='map-2'*/}
						{/*/>*/}
						{/*<PresentationMap*/}
							{/*mapKey='map-3'*/}
						{/*/>*/}
						{/*<MapControlsPresentation zoomOnly levelsBased/>*/}
					{/*</MapSetPresentation>*/}
				{/*</div>*/}
			</Page>
		);
	}
}

export default MapSetDoc;
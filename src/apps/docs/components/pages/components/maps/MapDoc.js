import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";
import WorldWindMap from "../../../../../../components/common/maps/WorldWindMap/presentation";
import layersHelper from '../../../../../../components/common/maps/WorldWindMap/layers/helpers';
import PresentationMapControls from "../../../../../../components/common/maps/controls/MapControls/presentation";
import {Link} from "react-router-dom";
import ComponentPropsTable, {Section, Prop} from "../../../ComponentPropsTable/ComponentPropsTable";
import Map, {PresentationMap} from "../../../../../../components/common/maps/Map";

class MapDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Map">

				<h3>Uncontrolled unconnected</h3>
				<div style={{height: 300}}>
					<Map
						mapComponent={WorldWindMap}
						backgroundLayer={{
							layerTemplateKey: 'd54f7782-976b-4fb2-9066-5f1ca4f3b703',
							metadataModifiers: {
								applicationKey: 'docs'
							}
						}}
						view={{
							boxRange: 10000
						}}
					>
						<PresentationMapControls/>
					</Map>
				</div>

				<div style={{marginTop: 10, height: 300}}>
					<PresentationMap
						mapComponent={WorldWindMap}
						backgroundLayer={{
							key: 'cuzk_ortofoto',
							name: 'CUZK Ortofoto',
							type: 'wms',
							options: {
								url: 'http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?',
								params: {
									layers: 'GR_ORTFOTORGB'
								}
							}
						}}
						view={{
							boxRange: 10000
						}}
					>
						<PresentationMapControls/>
					</PresentationMap>
				</div>

				<h2>Props</h2>
				<ComponentPropsTable
					// content={
					// 	[{
					// 		name: "view",
					// 		type: "map view",
					// 		description: <Link to="/architecture/systemDataTypes/mapView">Map view</Link>
					// 	},{
					// 		name: "layers",
					// 		type: "layers",
					// 		description: <Link to="/architecture/systemDataTypes/layers">Layers</Link>
					// 	},{
					// 		name: "backgroundLayer",
					// 		type: "background layer",
					// 		description: <Link to="/architecture/systemDataTypes/layers#backgroundLayer">Background layer</Link>
					// 	},{
					//
					// 	},{
					// 		name: "stateMapKey",
					// 		type: "string",
					// 		description: "Valid key of a map in map store"
					// 	},{
					//
					// 	},{
					// 		name: "onViewChange",
					// 		type: "function",
					// 		description: "Function called when a view change is initiated inside the Map component"
					// 	},{
					// 		name: "onClick",
					// 		type: "function",
					// 		description: "Function called on click"
					// 	}]
					// }
				>
					<Prop name="mapComponent" required>Presentational component to render the final map</Prop>
					<Section name="Controlled">
						<Prop name="stateMapKey" required type="string">Valid key of a map in map store</Prop>
					</Section>
					<Section name="Uncontrolled">
						<Prop name="mapKey" required type="string"/>
						<Prop name="view" required type="map view"><Link to="/architecture/systemDataTypes/mapView">Map view</Link></Prop>
						<Prop name="layers" type="layers"><Link to="/architecture/systemDataTypes/layers">Layers</Link></Prop>
						<Prop name="backgroundLayer" type="background layer">
							<Link to="/architecture/systemDataTypes/layers#backgroundLayer">Background layer</Link>
						</Prop>
						<Prop name="onViewChange" type="function">Function called when a view change is initiated inside the Map component</Prop>
						<Prop name="onClick" type="function">Function called on click</Prop>
						<Prop name="wrapperClasses" type="string">Class names for wrapper component</Prop>
					</Section>
				</ComponentPropsTable>

				<DocsToDo>Usage</DocsToDo>
				
			</Page>
		);
	}
}

export default MapDoc;
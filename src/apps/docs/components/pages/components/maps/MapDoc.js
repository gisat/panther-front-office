import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";
import WorldWindMap from "../../../../../../components/common/maps/WorldWindMap/presentation";
import layersHelper from '../../../../../../components/common/maps/WorldWindMap/layers/helpers';
import Deprecated_PresentationMapWithControls from "../../../../../../components/common/maps/Deprecated_PresentationMapWithControls";
import MapControls from "../../../../../../components/common/maps/controls/MapControls/presentation";
import {Link} from "react-router-dom";
import ComponentPropsTable, {Section, Prop} from "../../../ComponentPropsTable/ComponentPropsTable";

class MapDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Map">
				<div style={{height: 300}}>
					<Deprecated_PresentationMapWithControls
						map={(<WorldWindMap
							backgroundLayer={{
								type: 'worldwind',
								options: {
									layer: 'wikimedia'
								}
							}}
							layers={[
								{
									key: 'wtf-wms',
									type: 'wms',
									options: {
										url: 'https://urban-tep.eu/puma/geoserver/gwc/service/wms',
										params: {
											layers: 'geonode:SE_Asia_WSF_Evolution_1995',
											version: '1.1.0'
										}
									}
								}
							]}
							view={{
								center: {
									lat: 10,
									lon: 100
								},
								boxRange: 4000000
							}}
						/>)}
						controls={(<MapControls/>)}
					/>
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
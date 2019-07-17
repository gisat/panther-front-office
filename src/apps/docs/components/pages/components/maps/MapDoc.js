import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";
import WorldWindMap from "../../../../../../components/common/maps/WorldWindMap/presentation";
import layersHelper from '../../../../../../components/common/maps/WorldWindMap/layers/helpers';
import PresentationMapWithControls from "../../../../../../components/common/maps/PresentationMapWithControls";
import MapControls from "../../../../../../components/common/maps/MapControls/presentation";

class MapDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Map">
				<div style={{height: 500}}>
					<PresentationMapWithControls
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
				<h2>View</h2>
				<h2>Layers</h2>
				<DocsToDo>Structure description, ...</DocsToDo>

				<h2>Container component</h2>
			</Page>
		);
	}
}

export default MapDoc;
import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";
import WorldWindMap from "../../../../../../components/common/maps/WorldWindMap/presentation";
import layersHelper from '../../../../../../components/common/maps/WorldWindMap/layers/helpers';
import Deprecated_PresentationMapWithControls from "../../../../../../components/common/maps/Deprecated_PresentationMapWithControls";
import MapControls from "../../../../../../components/common/maps/MapControls/presentation";

class MapDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Map">
				<div style={{height: 500}}>
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
				<h2>View</h2>
				<h2>Layers</h2>
				<SyntaxHighlighter language="javascript">
					{'{\n' +
					'\tkey: "layerKey",\n' +
					'\ttype: "wms|wmts|worldwind|vector",\n' +
					'\topacity: 0.7,\n' +
					'\toptions: {\n' +
					'\t\t// type: wms\n' +
					'\t\turl: "http://192.168.2.206/geoserver/geonode/wms?",\n' +
					'\t\tparams: {} // wms query params\n' +
					'\n' +
					'\t\t// type: wmts\n' +
					'\t\turl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",\n' +
					'\n' +
					'\t\t// type: worldwind\n' +
					'\t\tlayer: "wikimedia|bluemarble|bingAerial",\n' +
					'\n' +
					'\t\t// type: vector\n' +
					'\t\tfeature: {}, // geojson with or without properties\n' +
					'\t\tstyle: {}|"",\n' +
					'\t\tselected: {selectionKey: [], selectionKey2: []} //keys\n' +
					'\t\tfiltered: []\n' +
					'\t\thovered: []\n' +
					'\t}\n' +
					'\n}'}
				</SyntaxHighlighter>

				<DocsToDo>Structure description, ...</DocsToDo>

				<h2>Container component</h2>
			</Page>
		);
	}
}

export default MapDoc;
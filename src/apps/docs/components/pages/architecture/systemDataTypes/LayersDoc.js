import React from 'react';
import {withNamespaces} from "react-i18next";

import Page, {
	SyntaxHighlighter
} from '../../../Page';

class LayersDoc extends React.PureComponent {
	
	render() {
		return (
			<Page title="Layers">
				<p>Layers are for layering. Full format for presentational map components, state-dependent for connected.</p>{/* todo */}
				<SyntaxHighlighter language="javascript">
					{
`{
	key: "example_layer",
	type: "wms",
	opacity: 0.7,
	
	options: {
		url: "http://panther.gisat.cz/geoserver/geonode/wms?"
		params: {
			layers: "",
			styles: ""
		}
	}
}`
					}
				</SyntaxHighlighter>
				
				<h2>Full format</h2>
				<p>End format supplied to presentational (map framework) map components. (Can also be supplied to connected.) Contains everything needed to display final layer on the map.</p>
				
				<h3>WMS</h3>
				<SyntaxHighlighter language="javascript">
					{
`{
	key: "example_wms_layer",
	type: "wms",
	opacity: 0.7,
	
	options: {
		url: "http://192.168.2.206/geoserver/geonode/wms?"
		params: {
			layers: ""
		}
	}
}`
					}
				</SyntaxHighlighter>
				
				<h3>WMTS</h3>
				<SyntaxHighlighter language="javascript">
					{
`{
	key: "example_wmts_layer",
	type: "wmts",
	opacity: 0.7,
	
	options: {
		urls: ["http://192.168.2.206/geoserver/geonode/wms&\${x}&\${y}&\${z}"]
	}
}`
					}
				</SyntaxHighlighter>
				
				<h3>Vector</h3>
				<SyntaxHighlighter language="javascript">
					{
`{
	key: "snezka_example_layer",
	type: "vector",
	opacity: 0.7,
	
	options: {
		features: {} //geojson with or without properties
		style: ???
		selected: {selectionKey: [], selectionKey2: []} //keys
		filtered: [] //keys
		hovered: [] //keys
	}
}`
					}
				</SyntaxHighlighter>
				
				<h3>Raster</h3>
				
				
				<h3>Colour</h3>
				
				
				<h3>Framework specific</h3>
				<SyntaxHighlighter language="javascript">
					{
`{
	key: "snezka_example_layer",
	type: "worldwind",
	opacity: 0.7,
	
	options: {
		layer: "wikimedia|bluemarble|bing"
	}
}`
					}
				</SyntaxHighlighter>
				
				<h3>WFS</h3>
				
				
				<h2>State-dependent format</h2>
				<p>Supplied to connected component, or stored in map store. References layer template and modifiers (fixed or active). Gets transformed into end format.</p>
				
				<SyntaxHighlighter language="javascript">
					{
`{
	key: "example_layer",
	opacity: 0.7,
	layerTemplateKey: "366f98d0-10e1-4e6c-8be5-7754c45ef599",
	metadataModifiers: {
		caseKey: "c9f1f8cd-fdff-43ca-9440-80d3dc6667d6"
	},
	filterByActive: {
		period: true
	}
}`
					}
				</SyntaxHighlighter>
				
			</Page>
		);
	}
}

export default withNamespaces()(LayersDoc);
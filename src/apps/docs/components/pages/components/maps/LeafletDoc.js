import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";
import {LeafletMap, ReactLeafletMap} from "@gisatcz/ptr-maps";
import ComponentPropsTable from "../../../ComponentPropsTable/ComponentPropsTable";

const backgroundLayer = {
	key: 'background-osm',
	type: 'wmts',
	options: {
		url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
	}
};

class LeafletDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Leaflet">
				<div style={{height: 500, marginBottom: 10}}>
					<ReactLeafletMap
						mapKey='react-leaflet-map'
						view={{
							center: {lat: 50, lon: 12},
							boxRange: 10000
						}}
						backgroundLayer={backgroundLayer}
					/>
				</div>

				<div style={{height: 500}}>
					<LeafletMap
						mapKey='typical-example'
						view={{
							center: {lat: 50, lon: 15},
							boxRange: 10000000
						}}
						backgroundLayer={backgroundLayer}
					/>
				</div>
				<h2>Props</h2>
				<ComponentPropsTable
					content={[
						{
							name: "scrollWheelZoom",
							type: "string",
							default: "enabled",
							description: "How the mouse wheel action is handled in the map. If the value is 'enabled', it is possible to zoom in/zoom out the map by mouse wheel. If 'afterClick', it is possible to zoom the map by mouse wheel after it was clicked on the map. If 'disabled', zooming by wheel is disabled"
						}
					]}
				/>
			</Page>
		);
	}
}

export default LeafletDoc;
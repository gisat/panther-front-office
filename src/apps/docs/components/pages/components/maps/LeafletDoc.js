import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";
import LeafletMap from "../../../../../../components/common/maps/LeafletMap/presentation";

class LeafletDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Leaflet">
				<div style={{height: 500}}>
					<LeafletMap
						mapKey='typical-example'
						view={{
							center: {lat: 50, lon: 15},
							boxRange: 10000000
						}}
						backgroundLayer={{
							key: 'background-osm',
							type: 'wmts',
							options: {
								urls: ['http://{s}.tile.osm.org/{z}/{x}/{y}.png']
							}
						}}
					/>
				</div>
			</Page>
		);
	}
}

export default LeafletDoc;
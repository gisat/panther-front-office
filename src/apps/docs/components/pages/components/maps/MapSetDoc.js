import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";

import MapControls from "../../../../../../components/common/maps/MapControls/presentation";
import MapSet, {PresentationMap} from "../../../../../../components/common/maps/MapSet/presentation";
import WorldWindMap from "../../../../../../components/common/maps/WorldWindMap/presentation";

class MapSetDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Map">
				<div style={{height: 500}}>
					<MapSet
						mapComponent={WorldWindMap}
					>
						<PresentationMap
							backgroundLayer={{
								type: 'worldwind',
								options: {
									layer: 'wikimedia'
								}
							}}
						/>
						<PresentationMap
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
			</Page>
		);
	}
}

export default MapSetDoc;